import {
  CONTACT_CUSTOMER_CREATE,
  CONTACT_CUSTOMER_QUERY,
  CONTACT_CUSTOMER_UPDATE,
} from '~/graphql/admin/contact';
import {
  CONTACT_ERROR_MESSAGE,
  CONTACT_RATE_LIMIT_MESSAGE,
  CONTACT_SUBMIT_MODE,
  normalizeContactValue,
  normalizeContactValues,
  toE164Phone,
  validateContactValues,
} from '~/lib/contact';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_AGE_MS = 2000;
const CUSTOMER_NOTE_MAX_LENGTH = 5000;
const ADMIN_API_VERSION_FALLBACK = '2026-01';
// In-memory only. On Oxygen this lives for the lifetime of a worker isolate,
// so it slows down bursts on one instance but is not a global rate limit.
const submissionLog = new Map();

/**
 * @typedef {object} ContactSubmissionResult
 * @property {'success' | 'invalid' | 'error'} status
 * @property {Record<string, string>} [errors]
 * @property {Record<string, string>} [values]
 * @property {string} [reason]
 * @property {boolean} [spam]
 */

/**
 * @param {{request: Request, env: Env, formData: FormData}} args
 * @returns {Promise<ContactSubmissionResult>}
 */
export async function processContactSubmission({request, env, formData}) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    body: formData.get('body'),
  };
  const values = normalizeContactValues(raw);

  // Honeypot: real shoppers never fill this. Pretend everything worked so
  // bots do not learn that they were filtered out.
  if (normalizeContactValue(formData.get('website'))) {
    return {status: 'success', spam: true};
  }

  // Time trap: a genuine message needs at least a couple of seconds to write.
  const renderedAt = Number(formData.get('renderedAt'));
  if (
    !Number.isFinite(renderedAt) ||
    Date.now() - renderedAt < MIN_FORM_AGE_MS
  ) {
    return {status: 'success', spam: true};
  }

  if (!isSameOrigin(request, env)) {
    return {status: 'error', values, reason: 'Origin/Host mismatch'};
  }

  const ip = getClientIp(request);

  const turnstile = await verifyTurnstile({env, formData, ip});
  if (!turnstile.ok) {
    return {
      status: 'invalid',
      values,
      errors: {
        form: 'Please complete the verification and try again.',
      },
    };
  }

  const {errors} = validateContactValues(values);
  if (Object.keys(errors).length > 0) {
    return {status: 'invalid', values, errors};
  }

  if (!allowSubmission(ip)) {
    return {
      status: 'error',
      values,
      errors: {form: CONTACT_RATE_LIMIT_MESSAGE},
      reason: 'Rate limit exceeded',
    };
  }

  const mode = resolveSubmitMode(env);

  if (mode === 'shopify-endpoint' || mode === 'auto') {
    const endpointResult = await submitToShopifyEndpoint({env, values, ip});
    if (endpointResult.ok) {
      return {status: 'success'};
    }
    if (mode === 'shopify-endpoint') {
      console.error(
        `[contact] Shopify endpoint submission failed: ${endpointResult.reason}`,
      );
      return {
        status: 'error',
        values,
        errors: {form: CONTACT_ERROR_MESSAGE},
        reason: endpointResult.reason,
      };
    }
  }

  const adminResult = await submitToAdminApi({env, values});
  if (adminResult.ok) {
    return {status: 'success'};
  }

  console.error(
    `[contact] Admin API submission failed: ${adminResult.reason}`,
  );
  return {
    status: 'error',
    values,
    errors: {form: CONTACT_ERROR_MESSAGE},
    reason: adminResult.reason,
  };
}

/**
 * @param {unknown} value
 * @returns {'auto' | 'shopify-endpoint' | 'admin-api'}
 */
function resolveSubmitMode(value) {
  const env = /** @type {Record<string, string | undefined>} */ (value);
  const requested = env?.CONTACT_SUBMIT_MODE;
  if (
    requested === 'shopify-endpoint' ||
    requested === 'admin-api' ||
    requested === 'auto'
  ) {
    return requested;
  }
  return /** @type {'auto' | 'shopify-endpoint' | 'admin-api'} */ (
    CONTACT_SUBMIT_MODE
  );
}

/**
 * @param {Request} request
 * @returns {string}
 */
function getClientIp(request) {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * @param {Request} request
 * @param {Env} env
 * @returns {boolean}
 */
function isSameOrigin(request, env) {
  const source =
    request.headers.get('origin') || request.headers.get('referer');
  if (!source) return true;

  let sourceHost;
  try {
    sourceHost = new URL(source).host.toLowerCase();
  } catch {
    return false;
  }

  const allowedHosts = new Set(
    [
      new URL(request.url).host,
      normalizeHost(env?.PUBLIC_STORE_DOMAIN),
      normalizeHost(env?.SHOPIFY_CONTACT_ENDPOINT_DOMAIN),
    ]
      .filter(Boolean)
      .map((host) => String(host).toLowerCase()),
  );

  return allowedHosts.has(sourceHost);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeHost(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '');
}

/**
 * @param {string} ip
 * @returns {boolean}
 */
function allowSubmission(ip) {
  const now = Date.now();
  for (const [key, timestamps] of submissionLog) {
    const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      submissionLog.delete(key);
    } else {
      submissionLog.set(key, recent);
    }
  }

  const recent = submissionLog.get(ip) || [];
  if (recent.length >= RATE_LIMIT_MAX) return false;

  recent.push(now);
  submissionLog.set(ip, recent);
  return true;
}

/**
 * @param {{env: Env, formData: FormData, ip: string}} args
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
async function verifyTurnstile({env, formData, ip}) {
  const secret = env?.TURNSTILE_SECRET_KEY;
  const siteKey = env?.TURNSTILE_SITE_KEY;

  if (!secret || !siteKey) return {ok: true, reason: 'Turnstile not configured'};

  const token = formData.get('cf-turnstile-response');
  if (!token || typeof token !== 'string') {
    return {ok: false, reason: 'Missing Turnstile token'};
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body,
      },
    );
    const result = await response.json();
    return {
      ok: result?.success === true,
      reason: result?.success === true ? undefined : 'Turnstile rejected',
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Turnstile failed',
    };
  }
}

/**
 * Sends the native Shopify contact form payload from the server.
 * @param {{env: Env, values: ReturnType<typeof normalizeContactValues>, ip: string}} args
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
async function submitToShopifyEndpoint({env, values, ip}) {
  const domain = normalizeHost(
    env?.SHOPIFY_CONTACT_ENDPOINT_DOMAIN || env?.PUBLIC_STORE_DOMAIN,
  );
  if (!domain) {
    return {ok: false, reason: 'No contact endpoint domain configured'};
  }

  const body = new URLSearchParams({
    form_type: 'contact',
    utf8: '✓',
    'contact[name]': values.name,
    'contact[email]': values.email,
    'contact[phone]': values.phone,
    'contact[body]': values.body,
  });

  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'text/html,application/xhtml+xml',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  });
  if (ip && ip !== 'unknown') {
    headers.set('X-Forwarded-For', ip);
  }

  try {
    const response = await fetch(`https://${domain}/contact`, {
      method: 'POST',
      headers,
      body,
      redirect: 'manual',
    });

    const location = response.headers.get('location') || '';
    const isRedirect = response.status >= 300 && response.status < 400;

    if (isRedirect && /contact_posted=true/i.test(location)) {
      return {ok: true};
    }

    if (/\/challenge(?:[/?#]|$)/i.test(location)) {
      return {ok: false, reason: 'Shopify bot protection challenge'};
    }

    if (
      response.status === 0 ||
      response.status === 429 ||
      response.status === 430 ||
      (response.status >= 400 && response.status < 500)
    ) {
      return {
        ok: false,
        reason: `Shopify endpoint blocked (${response.status || 'opaque'})`,
      };
    }

    if (isRedirect) {
      return {
        ok: false,
        reason: `Shopify endpoint redirected to ${location || 'unknown'}`,
      };
    }

    return {
      ok: false,
      reason: `Shopify endpoint returned ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Endpoint request failed',
    };
  }
}

/**
 * @param {{env: Env, values: ReturnType<typeof normalizeContactValues>}} args
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
async function submitToAdminApi({env, values}) {
  const token = env?.SHOPIFY_ADMIN_API_TOKEN;
  const domain = normalizeHost(
    env?.SHOPIFY_ADMIN_API_DOMAIN || env?.PUBLIC_STORE_DOMAIN,
  );

  if (!token) {
    return {ok: false, reason: 'SHOPIFY_ADMIN_API_TOKEN is not set'};
  }
  if (!domain) {
    return {ok: false, reason: 'No Admin API domain configured'};
  }

  try {
    const existing = await findCustomerByEmail({env, token, email: values.email});
    const phone = toE164Phone(values.phone);

    let result = await saveCustomer({
      env,
      token,
      values,
      existing,
      phone,
    });

    // Shopify rejects some phone numbers (for example, a number already
    // attached to another customer). Keep the submission and put the phone in
    // the note instead of failing the whole contact request.
    if (!result.ok && result.userError && phone) {
      result = await saveCustomer({
        env,
        token,
        values,
        existing,
        phone: null,
      });
    }

    if (!result.ok) {
      return {
        ok: false,
        reason: result.userError
          ? `Admin API user error: ${result.userError}`
          : result.reason || 'Admin API request failed',
      };
    }

    await sendNotificationEmail({env, values});
    return {ok: true};
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Admin API failed',
    };
  }
}

/**
 * @param {{env: Env, token: string, email: string}} args
 * @returns {Promise<{id: string, note: string, tags: string[]} | null>}
 */
async function findCustomerByEmail({env, token, email}) {
  const data = await adminGraphql({
    env,
    token,
    query: CONTACT_CUSTOMER_QUERY,
    variables: {query: `email:${email}`},
  });

  const customer = data?.customers?.nodes?.[0];
  if (!customer) return null;

  return {
    id: customer.id,
    note: customer.note || '',
    tags: Array.isArray(customer.tags) ? customer.tags : [],
  };
}

/**
 * @param {{
 *   env: Env,
 *   token: string,
 *   values: ReturnType<typeof normalizeContactValues>,
 *   existing: {id: string, note: string, tags: string[]} | null,
 *   phone: string | null,
 * }} args
 * @returns {Promise<{ok: boolean, userError?: string, reason?: string}>}
 */
async function saveCustomer({env, token, values, existing, phone}) {
  const message = formatContactNote(values, Boolean(existing) || !phone);
  const nameParts = values.name ? values.name.split(/\s+/) : [];
  const firstName = nameParts.shift() || undefined;
  const lastName = nameParts.join(' ') || undefined;

  if (existing) {
    // Preserve the original tag casing where possible.
    const mergedTags = existing.tags
      .filter((tag) => tag.toLowerCase() !== 'contact')
      .concat('contact');

    const data = await adminGraphql({
      env,
      token,
      query: CONTACT_CUSTOMER_UPDATE,
      variables: {
        input: {
          id: existing.id,
          note: appendCustomerNote(existing.note, message),
          tags: mergedTags,
        },
      },
    });

    const userError = readUserError(data?.customerUpdate);
    if (userError) return {ok: false, userError};
    return {ok: true};
  }

  /** @type {Record<string, unknown>} */
  const input = {
    email: values.email,
    tags: ['contact'],
    note: appendCustomerNote('', message),
  };
  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;
  if (phone) input.phone = phone;

  const data = await adminGraphql({
    env,
    token,
    query: CONTACT_CUSTOMER_CREATE,
    variables: {input},
  });

  const userError = readUserError(data?.customerCreate);
  if (userError) return {ok: false, userError};
  return {ok: true};
}

/**
 * @param {{customerCreate?: {userErrors?: Array<{message?: string}>}} | {customerUpdate?: {userErrors?: Array<{message?: string}>}}} payload
 * @returns {string | null}
 */
function readUserError(payload) {
  const errors = payload?.userErrors;
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return errors.map((error) => error?.message).filter(Boolean).join('; ');
}

/**
 * @param {ReturnType<typeof normalizeContactValues>} values
 * @param {boolean} includePhone
 * @returns {string}
 */
function formatContactNote(values, includePhone) {
  const timestamp = new Date().toISOString();
  const body = truncate(values.body, 4000);
  const lines = [`Contact message (${timestamp})`];
  if (values.name) lines.push(`Name: ${values.name}`);
  lines.push(`Email: ${values.email}`);
  if (includePhone && values.phone) lines.push(`Phone: ${values.phone}`);
  lines.push('', body);
  return lines.join('\n');
}

/**
 * Appends a new note and drops the oldest text when Shopify's limit is reached.
 * @param {string} existingNote
 * @param {string} addition
 * @returns {string}
 */
function appendCustomerNote(existingNote, addition) {
  const trimmed = (existingNote || '').trim();
  const combined = trimmed ? `${trimmed}\n\n${addition}` : addition;
  if (combined.length <= CUSTOMER_NOTE_MAX_LENGTH) return combined;
  return combined.slice(combined.length - CUSTOMER_NOTE_MAX_LENGTH);
}

/**
 * @param {string} value
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(value, maxLength) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

/**
 * @param {{env: Env, token: string, query: string, variables: Record<string, unknown>}} args
 * @returns {Promise<any>}
 */
async function adminGraphql({env, token, query, variables}) {
  const domain = normalizeHost(
    env?.SHOPIFY_ADMIN_API_DOMAIN || env?.PUBLIC_STORE_DOMAIN,
  );
  const version =
    env?.SHOPIFY_ADMIN_API_VERSION || ADMIN_API_VERSION_FALLBACK;

  const url = `https://${domain}/admin/api/${version}/graphql.json`;
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({query, variables}),
    redirect: 'manual',
  };

  let response = await fetch(url, init);

  // A custom domain may 301 to the shop's myshopify.com domain. Re-send the
  // POST there instead of letting fetch turn it into a GET and drop the body.
  if ([301, 302, 307, 308].includes(response.status)) {
    const location = response.headers.get('location');
    if (location) {
      const redirectUrl = new URL(location, url);
      if (
        redirectUrl.protocol === 'https:' &&
        redirectUrl.hostname.endsWith('.myshopify.com') &&
        redirectUrl.pathname.startsWith('/admin/api/')
      ) {
        response = await fetch(redirectUrl, init);
      }
    }
  }

  if (!response.ok) {
    throw new Error(`Admin API HTTP ${response.status}`);
  }

  const result = await response.json();

  if (Array.isArray(result?.errors) && result.errors.length > 0) {
    throw new Error(
      result.errors.map((error) => error?.message).filter(Boolean).join('; '),
    );
  }

  return result?.data;
}

/**
 * Sends a plain text notification through Resend when configured. A missing
 * provider is not fatal: the customer note is the source of truth.
 * @param {{env: Env, values: ReturnType<typeof normalizeContactValues>}} args
 */
async function sendNotificationEmail({env, values}) {
  const notifyEmail = env?.CONTACT_NOTIFY_EMAIL;
  const apiKey = env?.RESEND_API_KEY;
  const fromEmail = env?.CONTACT_FROM_EMAIL;

  if (!notifyEmail || !apiKey || !fromEmail) {
    console.warn(
      '[contact] Message saved to the customer note, but CONTACT_NOTIFY_EMAIL, RESEND_API_KEY and CONTACT_FROM_EMAIL are not all set. No email notification was sent.',
    );
    return;
  }

  const lines = [
    'New contact message from the Rosavita storefront',
    '',
    `Name: ${values.name || '(not provided)'}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || '(not provided)'}`,
    '',
    values.body,
  ];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        reply_to: values.email,
        subject: `New contact message from ${values.name || values.email}`,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      console.error(
        `[contact] Resend notification failed with HTTP ${response.status}. The customer note was saved.`,
      );
    }
  } catch (error) {
    console.error(
      `[contact] Resend notification failed: ${
        error instanceof Error ? error.message : 'unknown error'
      }. The customer note was saved.`,
    );
  }
}

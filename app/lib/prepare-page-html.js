const OWN_DOMAINS = [
  'tryrosavita.com',
  'www.tryrosavita.com',
  'shop.tryrosavita.com',
];

const POLICY_PAGE_PATHS = {
  '/policies/privacy-policy': '/pages/privacy-policy',
  '/policies/terms-of-service': '/pages/terms-of-service',
  '/policies/refund-policy': '/pages/refund-policy',
};

const ALLOWED_EMBED_HOSTS = [
  'youtube.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
];

const HTML_ENTITY_MAP = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  mdash: '—',
  ndash: '–',
  hellip: '…',
};

/**
 * Prepare a Shopify page body for rendering inside the storefront.
 *
 * The work is intentionally done on the server (in the route loader) so the
 * exact same HTML string is used for SSR and hydration.
 *
 * @param {string | null | undefined} html
 * @param {{storeDomain?: string | null}} [options]
 * @returns {string}
 */
export function preparePageHtml(html, options = {}) {
  if (!html) return '';

  const ownDomains = new Set(OWN_DOMAINS);
  const storeDomain = normalizeHost(options.storeDomain);
  if (storeDomain) ownDomains.add(storeDomain);

  let prepared = String(html);
  prepared = stripDangerousElements(prepared);
  prepared = prepared.replace(/<(\/?)h1(\s[^>]*)?>/gi, '<$1h2$2>');
  prepared = prepared.replace(/<[^>]*>/g, (tag) =>
    sanitizeTag(tag, ownDomains),
  );
  prepared = wrapTables(prepared);

  return prepared.trim();
}

/**
 * Build a plain-text SEO description from a page body.
 *
 * @param {string | null | undefined} html
 * @param {number} [maxLength]
 * @returns {string}
 */
export function createPageDescription(html, maxLength = 155) {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(' ');

  return (
    lastSpace > Math.floor(maxLength * 0.6)
      ? clipped.slice(0, lastSpace)
      : clipped.slice(0, maxLength)
  ).trim();
}

/** @param {string} html */
function stripDangerousElements(html) {
  let output = html;

  output = output.replace(
    /<(script|style|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    '',
  );
  output = output.replace(/<(script|style|object)\b[^>]*\/?>/gi, '');
  output = output.replace(/<embed\b[^>]*\/?>/gi, '');
  output = output.replace(
    /<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>|<iframe\b[^>]*\/?>/gi,
    (tag) => {
      const src = getAttribute(tag, 'src');
      return src && isAllowedEmbedUrl(src) ? tag : '';
    },
  );

  return output;
}

/**
 * @param {string} tag
 * @param {Set<string>} ownDomains
 */
function sanitizeTag(tag, ownDomains) {
  if (!tag.startsWith('<') || /^<\s*[!/]/.test(tag)) return tag;

  let cleaned = removeUnsafeAttributes(tag);

  if (/^<a\b/i.test(cleaned)) {
    cleaned = normalizeAnchor(cleaned, ownDomains);
  }

  return cleaned;
}

/** @param {string} tag */
function removeUnsafeAttributes(tag) {
  return tag
    .replace(/\s+on[a-z0-9_:-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)/gi, '')
    .replace(/\s+srcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)/gi, '')
    .replace(
      /(\s)((?:href|src|xlink:href|action|formaction|poster|background|data)\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+)/gi,
      (match, space, name, quotedValue) => {
        const value = unquote(quotedValue);
        const normalized = normalizeUrlScheme(value);

        if (
          normalized.startsWith('javascript:') ||
          normalized.startsWith('vbscript:') ||
          normalized.startsWith('data:text/html')
        ) {
          return '';
        }

        return `${space}${name}${quotedValue}`;
      },
    );
}

/**
 * @param {string} tag
 * @param {Set<string>} ownDomains
 */
function normalizeAnchor(tag, ownDomains) {
  const href = getAttribute(tag, 'href');

  if (!href) return tag;

  const trimmed = decodeHtmlEntities(href).trim();

  if (!trimmed || /^(mailto:|tel:|#)/i.test(trimmed)) return tag;

  if (trimmed.startsWith('//')) {
    return normalizeAbsoluteAnchor(tag, `https:${trimmed}`, ownDomains);
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeAbsoluteAnchor(tag, trimmed, ownDomains);
  }

  if (trimmed.startsWith('/')) {
    return setAttribute(tag, 'href', mapRelativeHref(trimmed));
  }

  return tag;
}

/**
 * @param {string} tag
 * @param {string} href
 * @param {Set<string>} ownDomains
 */
function normalizeAbsoluteAnchor(tag, href, ownDomains) {
  let url;

  try {
    url = new URL(href);
  } catch {
    return tag;
  }

  if (!/^https?:$/i.test(url.protocol)) return tag;

  const host = normalizeHost(url.hostname);

  if (isOwnHost(host, ownDomains)) {
    const pathname = POLICY_PAGE_PATHS[stripTrailingSlash(url.pathname)];

    return setAttribute(
      tag,
      'href',
      `${pathname || url.pathname}${url.search}${url.hash}`,
    );
  }

  let next = setAttribute(tag, 'target', '_blank');
  next = setAttribute(
    next,
    'rel',
    mergeRel(getAttribute(next, 'rel'), ['noopener', 'noreferrer']),
  );

  return next;
}

/** @param {string} href */
function mapRelativeHref(href) {
  const match = href.match(/^([^?#]*)([\s\S]*)$/);
  const pathname = match?.[1] || href;
  const suffix = match?.[2] || '';
  const mapped = POLICY_PAGE_PATHS[stripTrailingSlash(pathname)];

  return `${mapped || pathname}${suffix}`;
}

/** @param {string} host */
function normalizeHost(host) {
  return String(host || '')
    .trim()
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.$/, '');
}

/**
 * @param {string} host
 * @param {Set<string>} ownDomains
 */
function isOwnHost(host, ownDomains) {
  if (!host) return false;

  for (const domain of ownDomains) {
    const normalized = normalizeHost(domain);
    if (host === normalized) return true;
  }

  // The store's Shopify-provided domain should be treated as an internal link.
  return host.endsWith('.myshopify.com');
}

/** @param {string} pathname */
function stripTrailingSlash(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * @param {string} src
 * @returns {boolean}
 */
function isAllowedEmbedUrl(src) {
  const value = decodeHtmlEntities(src).trim();

  try {
    const url = new URL(
      value.startsWith('//') ? `https:${value}` : value,
      'https://tryrosavita.com',
    );

    if (!/^https?:$/i.test(url.protocol)) return false;

    const host = normalizeHost(url.hostname);

    return ALLOWED_EMBED_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

/**
 * @param {string} tag
 * @param {string} name
 * @returns {string | null}
 */
function getAttribute(tag, name) {
  const pattern = new RegExp(
    `\\s${escapeRegExp(name)}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    'i',
  );
  const match = tag.match(pattern);

  if (!match) return null;

  return match[1] ?? match[2] ?? match[3] ?? null;
}

/**
 * @param {string} tag
 * @param {string} name
 * @param {string} value
 */
function setAttribute(tag, name, value) {
  const pattern = new RegExp(
    `\\s${escapeRegExp(name)}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s"'>]+)`,
    'i',
  );
  const escaped = escapeAttribute(value);

  if (pattern.test(tag)) {
    return tag.replace(pattern, ` ${name}="${escaped}"`);
  }

  return tag.replace(/\s*(\/?>)$/, ` ${name}="${escaped}"$1`);
}

/**
 * @param {string | null} existing
 * @param {string[]} required
 */
function mergeRel(existing, required) {
  const values = [];
  const seen = new Set();

  for (const value of [...String(existing || '').split(/\s+/), ...required]) {
    const token = value.trim().toLowerCase();
    if (!token || seen.has(token)) continue;
    seen.add(token);
    values.push(token);
  }

  return values.join(' ');
}

/** @param {string} value */
function normalizeUrlScheme(value) {
  return [...decodeHtmlEntities(value)]
    .filter((character) => character.charCodeAt(0) > 32)
    .join('')
    .toLowerCase();
}

/** @param {string} value */
function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

/** @param {string} value */
function escapeAttribute(value) {
  return String(value).replace(/"/g, '&quot;');
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @param {string} html */
function stripHtml(html) {
  const withoutHidden = String(html || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');

  return decodeHtmlEntities(withoutHidden).replace(/\s+/g, ' ').trim();
}

/** @param {string} value */
function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) =>
      fromCodePoint(parseInt(hex, 16), match),
    )
    .replace(/&#(\d+);/g, (match, decimal) =>
      fromCodePoint(parseInt(decimal, 10), match),
    )
    .replace(
      /&(nbsp|amp|lt|gt|quot|apos|#39|rsquo|lsquo|ldquo|rdquo|mdash|ndash|hellip);/gi,
      (match, name) => HTML_ENTITY_MAP[name.toLowerCase()] ?? match,
    );
}

/**
 * @param {number} code
 * @param {string} fallback
 */
function fromCodePoint(code, fallback) {
  try {
    return String.fromCodePoint(code);
  } catch {
    return fallback;
  }
}

/** @param {string} html */
function wrapTables(html) {
  return html.replace(
    /<table\b[^>]*>[\s\S]*?<\/table\s*>/gi,
    (table) => `<div class="rv-rte__table-wrap">${table}</div>`,
  );
}

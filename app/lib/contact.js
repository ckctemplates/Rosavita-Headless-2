// Editable contact page copy and behaviour.
export const CONTACT_PAGE_TITLE = 'Contact';
export const CONTACT_PAGE_DESCRIPTION = 'Get in touch with the Rosavita team.';
export const CONTACT_SUCCESS_MESSAGE =
  "Thanks for contacting us. We'll get back to you as soon as possible.";
export const CONTACT_ERROR_MESSAGE =
  'Something went wrong. Please try again in a moment.';
export const CONTACT_RATE_LIMIT_MESSAGE =
  'Too many messages. Please try again later.';
export const CONTACT_SUBMIT_MODE = 'auto';
export const MAX_LINKS_IN_MESSAGE = 3;

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  body: 5000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-().\s]+$/;
const LINK_PATTERN = /(?:https?:\/\/|www\.)[^\s]+/gi;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Removes control characters, normalizes line endings and trims the value.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeContactValue(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARACTERS, '')
    .trim();
}

/**
 * @param {Record<string, unknown>} input
 * @returns {{name: string, email: string, phone: string, body: string}}
 */
export function normalizeContactValues(input = {}) {
  return {
    name: normalizeContactValue(input.name).replace(/\n+/g, ' '),
    email: normalizeContactValue(input.email).toLowerCase(),
    phone: normalizeContactValue(input.phone).replace(/\n+/g, ' '),
    body: normalizeContactValue(input.body),
  };
}

/**
 * Counts link-like fragments. Used as a lightweight spam heuristic.
 * @param {string} message
 * @returns {number}
 */
export function countLinks(message) {
  return (message.match(LINK_PATTERN) || []).length;
}

/**
 * Validates the shopper-facing fields on both the client and the server.
 * @param {Record<string, unknown>} input
 * @returns {{values: {name: string, email: string, phone: string, body: string}, errors: Record<string, string>}}
 */
export function validateContactValues(input = {}) {
  const values = normalizeContactValues(input);
  /** @type {Record<string, string>} */
  const errors = {};

  if (values.name.length > CONTACT_FIELD_LIMITS.name) {
    errors.name = `Name must be ${CONTACT_FIELD_LIMITS.name} characters or fewer.`;
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (values.email.length > CONTACT_FIELD_LIMITS.email) {
    errors.email = `Email must be ${CONTACT_FIELD_LIMITS.email} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (values.phone) {
    if (values.phone.length > CONTACT_FIELD_LIMITS.phone) {
      errors.phone = `Phone must be ${CONTACT_FIELD_LIMITS.phone} characters or fewer.`;
    } else if (
      !PHONE_PATTERN.test(values.phone) ||
      !/[0-9]/.test(values.phone)
    ) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  if (!values.body) {
    errors.body = 'Comment is required';
  } else if (values.body.length > CONTACT_FIELD_LIMITS.body) {
    errors.body = `Comment must be ${CONTACT_FIELD_LIMITS.body} characters or fewer.`;
  } else if (countLinks(values.body) > MAX_LINKS_IN_MESSAGE) {
    errors.body = `Please include no more than ${MAX_LINKS_IN_MESSAGE} links in your message.`;
  }

  return {values, errors};
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isValidContactEmail(value) {
  const email = normalizeContactValue(value).toLowerCase();
  return (
    email.length > 0 &&
    email.length <= CONTACT_FIELD_LIMITS.email &&
    EMAIL_PATTERN.test(email)
  );
}

/**
 * Returns a normalized E.164 phone number, or null when the formatted value
 * cannot be safely converted without guessing a country code.
 * @param {unknown} value
 * @returns {string | null}
 */
export function toE164Phone(value) {
  const phone = normalizeContactValue(value);
  if (!phone) return null;

  const compact = phone.replace(/[\s().-]/g, '');
  return /^\+[1-9]\d{6,14}$/.test(compact) ? compact : null;
}

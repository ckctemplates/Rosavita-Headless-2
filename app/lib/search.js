/**
 * Stable JSON stringify so filter inputs can be compared regardless of key order.
 */
export function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

/**
 * Storefront filter values return `input` as a JSON-encoded string. Normalize
 * it so filters can be compared and sent back as `ProductFilter` objects.
 */
export function parseFilterInput(input) {
  if (typeof input !== 'string') return input;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

/**
 * Find the filter (and matching value, when available) that an applied
 * `ProductFilter` input belongs to.
 */
export function findFilterForInput(input, filters = []) {
  if (!input || typeof input !== 'object') {
    return {filter: null, value: null};
  }

  const key = stableStringify(input);

  for (const filter of filters) {
    const value = (filter.values || []).find(
      (item) => stableStringify(parseFilterInput(item.input)) === key,
    );
    if (value) return {filter, value};
  }

  const inputKey = Object.keys(input)[0];
  if (!inputKey) return {filter: null, value: null};

  // Price ranges don't line up with the preset range values, and the
  // availability filter is the only boolean one.
  if (inputKey === 'price') {
    return {
      filter: filters.find((filter) => filter.type === 'PRICE_RANGE') ?? null,
      value: null,
    };
  }
  if (inputKey === 'available') {
    return {
      filter: filters.find((filter) => filter.type === 'BOOLEAN') ?? null,
      value: null,
    };
  }

  // Metafield/variant-option filters share the same top-level key, so match
  // on everything except the actual selected value.
  const identity = inputIdentity(input);
  for (const filter of filters) {
    const matches = (filter.values || []).some(
      (item) => inputIdentity(parseFilterInput(item.input)) === identity,
    );
    if (matches) return {filter, value: null};
  }

  return {filter: null, value: null};
}

function inputIdentity(input) {
  const [key, value] = Object.entries(input || {})[0] || [];
  if (!key) return '';
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rest = {...value};
    delete rest.value;
    return `${key}:${stableStringify(rest)}`;
  }
  return key;
}

/**
 * Returns the empty state of a predictive search result to reset the search state.
 */
export function getEmptyPredictiveSearchResult() {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}

/**
 * A utility function that appends tracking parameters to a URL. Tracking parameters are
 * used internally by Shopify to enhance search results and admin dashboards.
 * @example
 * ```ts
 * const baseUrl = 'www.example.com';
 * const trackingParams = 'utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront';
 * const params = { foo: 'bar' };
 * const term = 'search term';
 * const url = urlWithTrackingParams({ baseUrl, trackingParams, params, term });
 * console.log(url);
 * // Output: 'https://www.example.com?foo=bar&q=search%20term&utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront'
 * ```
 * @param {UrlWithTrackingParams}
 */
export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}) {
  let search = new URLSearchParams({
    ...extraParams,
    q: encodeURIComponent(term),
  }).toString();

  if (trackingParams) {
    search = `${search}&${trackingParams}`;
  }

  return `${baseUrl}?${search}`;
}

/**
 * @typedef {{
 *   type: Type;
 *   term: string;
 *   error?: string;
 *   result: {total: number; items: Items};
 * }} ResultWithItems
 * @template {'predictive' | 'regular'} Type
 * @template Items
 */
/**
 * @typedef {ResultWithItems<
 *   'regular',
 *   RegularSearchQuery
 * >} RegularSearchReturn
 */
/**
 * @typedef {ResultWithItems<
 *   'predictive',
 *   NonNullable<PredictiveSearchQuery['predictiveSearch']>
 * >} PredictiveSearchReturn
 */
/**
 * @typedef {Object} UrlWithTrackingParams
 * @property {string} baseUrl The base URL to which the tracking parameters will be appended.
 * @property {string|null} [trackingParams] The trackingParams returned by the Storefront API.
 * @property {Record<string,string>} [params] Any additional query parameters to be appended to the URL.
 * @property {string} term The search term to be appended to the URL.
 */

/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */

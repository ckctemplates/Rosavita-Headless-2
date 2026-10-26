import {useFetcher, useLoaderData, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchPageForm} from '~/components/SearchPageForm';
import {SearchFilters} from '~/components/SearchFilters';
import {SearchResultCard, SearchPageTile} from '~/components/SearchResultCard';
import {
  findFilterForInput,
  getEmptyPredictiveSearchResult,
  parseFilterInput,
} from '~/lib/search';
import {useEffect, useRef, useState} from 'react';

export const RESULTS_PER_PAGE = 24;
export const SHOW_QUICK_ADD = true;
export const MULTI_VARIANT_QUICK_ADD = 'first-available';
export const UNAVAILABLE_PRODUCTS = 'LAST';

export const meta = ({data}) => {
  const term = data?.term || '';
  const title = term
    ? `Search results for “${term}” | Rosavita`
    : `Search | Rosavita`;
  return [{title}, {name: 'robots', content: 'noindex, follow'}];
};

export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  if (isPredictive) {
    try {
      return await predictiveSearch({request, context});
    } catch (error) {
      console.error(error);
      return {
        type: 'predictive',
        term: String(url.searchParams.get('q') || ''),
        result: getEmptyPredictiveSearchResult(),
        error: error.message,
      };
    }
  }

  try {
    return await regularSearch({request, context});
  } catch (error) {
    console.error(error);
    const term = String(url.searchParams.get('q') || '')
      .trim()
      .slice(0, 100);
    return {
      type: 'regular',
      term,
      result: getEmptySearchResult(),
      filters: [],
      appliedFilters: [],
      error: error.message,
    };
  }
}

function getEmptySearchResult() {
  return {
    total: 0,
    items: {
      articles: {nodes: []},
      pages: {nodes: []},
      products: {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}},
    },
  };
}

function parseFilters(url) {
  const filters = url.searchParams.getAll('filter');
  const parsed = [];
  for (const f of filters) {
    try {
      const input = JSON.parse(f);
      if (input && typeof input === 'object') {
        parsed.push(input);
      }
    } catch {
      // ignore invalid JSON
    }
  }
  return parsed;
}

function mapSort(sortBy) {
  if (sortBy === 'price-ascending') return {sortKey: 'PRICE', reverse: false};
  if (sortBy === 'price-descending') return {sortKey: 'PRICE', reverse: true};
  return {sortKey: 'RELEVANCE', reverse: false};
}

export default function SearchPage() {
  const {
    type,
    term,
    result,
    filters = [],
    appliedFilters = [],
    error,
  } = useLoaderData();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sort_by') || 'relevance';
  const filterParams = searchParams.getAll('filter');
  const hasFilters = filterParams.length > 0;
  const sortByPrice =
    sortBy === 'price-ascending' || sortBy === 'price-descending';

  const products = result?.items?.products?.nodes || [];
  const pages = result?.items?.pages?.nodes || [];
  const articles = result?.items?.articles?.nodes || [];
  const pageInfo = result?.items?.products?.pageInfo || {hasNextPage: false};
  const total = result?.total || 0;

  const showContent = !hasFilters && !sortByPrice;
  const displayProducts = products;
  const displayPages = showContent ? pages : [];
  const displayArticles = showContent ? articles : [];

  const [moreNodes, setMoreNodes] = useState([]);
  const [nextCursor, setNextCursor] = useState(pageInfo.endCursor);
  const [hasNext, setHasNext] = useState(pageInfo.hasNextPage);
  const loadMoreFetcher = useFetcher({key: 'rv-search-page'});
  const lastPageRef = useRef(null);
  const requestedKeyRef = useRef(null);
  const isLoadingMore = loadMoreFetcher.state !== 'idle';

  // Reset pagination whenever the query (term, filters, sort) changes.
  const searchKey = searchParams.toString();
  useEffect(() => {
    setMoreNodes([]);
    setNextCursor(pageInfo.endCursor);
    setHasNext(pageInfo.hasNextPage);
    lastPageRef.current = null;
    requestedKeyRef.current = null;
  }, [searchKey, pageInfo.endCursor, pageInfo.hasNextPage]);

  const allProducts = [...displayProducts, ...moreNodes];

  useEffect(() => {
    const page = loadMoreFetcher.data;
    if (
      loadMoreFetcher.state !== 'idle' ||
      !page ||
      page === lastPageRef.current
    ) {
      return;
    }
    lastPageRef.current = page;

    // Ignore responses for a previous query after filters/sort changed.
    if (requestedKeyRef.current !== searchKey) return;

    const nodes = page?.result?.items?.products?.nodes || [];
    const pi = page?.result?.items?.products?.pageInfo || {};
    setMoreNodes((prev) => [...prev, ...nodes]);
    setNextCursor(pi.endCursor || null);
    setHasNext(pi.hasNextPage || false);
  }, [loadMoreFetcher.data, loadMoreFetcher.state, searchKey]);

  const loadMore = () => {
    if (!nextCursor || isLoadingMore) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor', nextCursor);
    requestedKeyRef.current = searchKey;
    loadMoreFetcher.load(`/search?${params.toString()}`);
  };

  if (type === 'predictive') return null;

  return (
    <div className="rv-searchpage">
      <div className="rv-searchpage__header">
        <h1 className="rv-searchpage__title">Search results</h1>
        <SearchPageForm term={term} />
      </div>
      <SearchFilters filters={filters} appliedFilters={appliedFilters} />
      {error ? <p className="rv-searchpage__error">{error}</p> : null}
      {!term ? (
        <p className="rv-searchpage__empty">
          Start typing to search our store.
        </p>
      ) : total === 0 &&
        allProducts.length === 0 &&
        displayPages.length === 0 &&
        displayArticles.length === 0 ? (
        <p className="rv-searchpage__empty">No results found.</p>
      ) : (
        <>
          <p className="rv-searchpage__count" aria-live="polite">
            {total} {total === 1 ? 'result' : 'results'}
          </p>
          <div className="rv-searchpage__grid">
            {allProducts.map((product, idx) => (
              <SearchResultCard
                key={product.id}
                product={product}
                loading={idx < 4 ? 'eager' : 'lazy'}
              />
            ))}
            {displayPages.map((page) => (
              <SearchPageTile key={page.id} item={page} />
            ))}
            {displayArticles.map((article) => (
              <SearchPageTile key={article.id} item={article} />
            ))}
          </div>
          {hasNext && nextCursor ? (
            <div className="rv-searchpage__loadmore">
              <button
                type="button"
                className="rv-searchpage__loadmore-btn"
                onClick={loadMore}
                disabled={isLoadingMore}
                aria-busy={isLoadingMore}
              >
                {isLoadingMore ? 'LOADING...' : 'LOAD MORE'}
              </button>
            </div>
          ) : null}
        </>
      )}
      <Analytics.SearchView
        data={{
          searchTerm: term,
          searchResults: {
            totalCount: total,
            productCount: allProducts.length,
            pageCount: displayPages.length,
            articleCount: displayArticles.length,
          },
        }}
      />
    </div>
  );
}

function normalizeConnection(connection) {
  const nodes = Array.isArray(connection?.nodes)
    ? connection.nodes
    : Array.isArray(connection)
      ? connection
      : [];

  return {
    nodes,
    totalCount:
      typeof connection?.totalCount === 'number'
        ? connection.totalCount
        : nodes.length,
    pageInfo: connection?.pageInfo || {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

function formatFilterValue(input) {
  if (!input || typeof input !== 'object') return 'Filter';

  if ('available' in input) {
    return input.available ? 'In stock' : 'Out of stock';
  }

  if (input.price) {
    const {min, max} = input.price;
    if (min != null && max != null) return `${min} – ${max}`;
    if (min != null) return `From ${min}`;
    if (max != null) return `Up to ${max}`;
    return 'Price';
  }

  const first = Object.values(input)[0];
  if (first && typeof first === 'object') {
    if (first.value != null) return String(first.value);
    const nested = Object.values(first).find(
      (entry) => typeof entry !== 'object',
    );
    return nested != null ? String(nested) : 'Filter';
  }

  return first != null ? String(first) : 'Filter';
}

function buildAppliedFilters(inputs, filters) {
  return inputs.map((input) => {
    const {filter, value} = findFilterForInput(input, filters);

    return {
      filterId: filter?.id ?? null,
      label: filter?.label ?? '',
      valueLabel: value?.label ?? formatFilterValue(input),
      input,
    };
  });
}

async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '')
    .trim()
    .slice(0, 100);
  const sortBy = url.searchParams.get('sort_by') || 'relevance';
  const appliedInputs = parseFilters(url);
  const cursor = url.searchParams.get('cursor');
  const {sortKey, reverse} = mapSort(sortBy);
  const variables = getPaginationVariables(request, {pageBy: RESULTS_PER_PAGE});
  const first = variables.first || RESULTS_PER_PAGE;
  const after = cursor || variables.endCursor || null;

  const fetchContent = appliedInputs.length === 0 && sortBy === 'relevance';

  if (!term) {
    return {
      type: 'regular',
      term: '',
      result: getEmptySearchResult(),
      filters: [],
      appliedFilters: [],
    };
  }

  const data = await storefront.query(SEARCH_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
      term,
      first,
      after,
      sortKey,
      reverse,
      productFilters: appliedInputs,
      fetchContent,
    },
  });

  const products = normalizeConnection(data.products);
  const pages = fetchContent
    ? normalizeConnection(data.pages)
    : normalizeConnection(null);
  const articles = fetchContent
    ? normalizeConnection(data.articles)
    : normalizeConnection(null);
  const availableFilters = Array.isArray(data.products?.productFilters)
    ? data.products.productFilters.map((filter) => ({
        ...filter,
        values: (filter.values || []).map((value) => ({
          ...value,
          input: parseFilterInput(value.input),
        })),
      }))
    : [];
  const appliedFilters = buildAppliedFilters(appliedInputs, availableFilters);
  const total =
    products.totalCount +
    (fetchContent ? pages.totalCount + articles.totalCount : 0);

  return {
    type: 'regular',
    term,
    result: {
      total,
      items: {products, pages, articles},
    },
    filters: availableFilters,
    appliedFilters,
  };
}

async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit')) || 5;
  const variables = {
    limit,
    term,
    limitScope: 'EACH',
    // Pages and articles require the unauthenticated_read_content scope.
    // Keep predictive search limited to resources this storefront can read.
    types: ['PRODUCT', 'QUERY', 'COLLECTION'],
  };

  if (!term) {
    return {
      type: 'predictive',
      term,
      result: getEmptyPredictiveSearchResult(),
    };
  }

  try {
    const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables,
    });
    const result = predictiveSearchResult({
      data: data?.predictiveSearch || data,
    });
    return {
      type: 'predictive',
      term,
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      type: 'predictive',
      term,
      result: getEmptyPredictiveSearchResult(),
      error: error.message,
    };
  }
}

function predictiveSearchResult({data}) {
  if (!data) {
    return getEmptyPredictiveSearchResult();
  }

  const queries = Array.isArray(data?.queries?.nodes)
    ? data.queries.nodes
    : Array.isArray(data?.queries)
      ? data.queries
      : [];

  const products = data.products?.nodes || data.products || [];
  const collections = data.collections?.nodes || data.collections || [];
  const pages = data.pages?.nodes || data.pages || [];
  const articles = data.articles?.nodes || data.articles || [];

  const total =
    products.length +
    collections.length +
    pages.length +
    articles.length +
    queries.length;

  return {
    total,
    items: {
      products: {nodes: products},
      collections: {nodes: collections},
      pages: {nodes: pages},
      articles: {nodes: articles},
      queries,
    },
  };
}

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    id
    handle
    title
    trackingParameters
    vendor
    availableForSale
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 2) {
      nodes {
        id
        availableForSale
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
    __typename
    id
    handle
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    id
    handle
    title
    trackingParameters
    image {
      id
      url
      altText
      width
      height
    }
    blog {
      handle
      title
    }
  }
`;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $language: LanguageCode
    $term: String!
    $first: Int
    $after: String
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $productFilters: [ProductFilter!]
    $fetchContent: Boolean!
  ) @inContext(country: $country, language: $language) {
    products: search(
      after: $after
      first: $first
      query: $term
      sortKey: $sortKey
      reverse: $reverse
      types: [PRODUCT]
      productFilters: $productFilters
      unavailableProducts: LAST
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
    }
    pages: search(query: $term, types: [PAGE], first: 100)
      @include(if: $fetchContent) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
      totalCount
    }
    articles: search(query: $term, types: [ARTICLE], first: 100)
      @include(if: $fetchContent) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
      totalCount
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
`;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit
      limitScope: $limitScope
      query: $term
      types: $types
    ) {
      collections {
        id
        handle
        title
        trackingParameters
      }
      products {
        id
        handle
        title
        trackingParameters
        selectedOrFirstAvailableVariant(
          selectedOptions: []
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          id
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
        }
      }
      queries {
        text
        styledText
        trackingParameters
      }
    }
  }
`;

import {useLoaderData, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchPageForm} from '~/components/SearchPageForm';
import {SearchFilters} from '~/components/SearchFilters';
import {SearchResultCard, SearchPageTile} from '~/components/SearchResultCard';
import {getEmptyPredictiveSearchResult} from '~/lib/search';
import {useRef, useState} from 'react';

export const RESULTS_PER_PAGE = 24;
export const SHOW_QUICK_ADD = true;
export const MULTI_VARIANT_QUICK_ADD = 'first-available';
export {UNAVAILABLE_PRODUCTS} from '~/components/SearchResultCard';

export const meta = ({data}) => {
  const term = data?.term || '';
  const title = term
    ? `Search results for “${term}” | Rosavita`
    : `Search | Rosavita`;
  return [
    {title},
    {name: 'robots', content: 'noindex, follow'},
  ];
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
    const term = String(url.searchParams.get('q') || '').trim().slice(0, 100);
    return {
      type: 'regular',
      term,
      result: getEmptySearchResult(),
      filters: [],
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
  const {type, term, result, filters = [], error} = useLoaderData();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sort_by') || 'relevance';
  const filterParams = searchParams.getAll('filter');
  const hasFilters = filterParams.length > 0;
  const sortByPrice = sortBy === 'price-ascending' || sortBy === 'price-descending';

  if (type === 'predictive') return null;

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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const allProducts = [...displayProducts, ...moreNodes];

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('cursor', nextCursor);
      const res = await fetch(`/search?${params.toString()}`, {
        headers: {accept: 'application/json'},
      });
      if (!res.ok) throw new Error('Failed to load more');
      const data = await res.json();
      const nodes = data?.items?.products?.nodes || [];
      const pi = data?.items?.products?.pageInfo || {};
      setMoreNodes((prev) => [...prev, ...nodes]);
      setNextCursor(pi.endCursor || null);
      setHasNext(pi.hasNextPage || false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="rv-searchpage">
      <div className="rv-searchpage__header">
        <h1 className="rv-searchpage__title">Search results</h1>
        <SearchPageForm term={term} />
      </div>
      <SearchFilters filters={filters} productFilters={result?.productFilters || []} />
      {error ? <p className="rv-searchpage__error">{error}</p> : null}
      {!term ? (
        <p className="rv-searchpage__empty">Start typing to search our store.</p>
      ) : total === 0 && allProducts.length === 0 && displayPages.length === 0 && displayArticles.length === 0 ? (
        <p className="rv-searchpage__empty">No results found.</p>
      ) : (
        <>
          <p className="rv-searchpage__count" aria-live="polite">
            {total} {total === 1 ? 'result' : 'results'}
          </p>
          <div className="rv-searchpage__grid">
            {allProducts.map((product, idx) => (
              <SearchResultCard key={product.id} product={product} loading={idx < 4 ? 'eager' : 'lazy'} />
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

async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim().slice(0, 100);
  const sortBy = url.searchParams.get('sort_by') || 'relevance';
  const productFilters = parseFilters(url);
  const cursor = url.searchParams.get('cursor');
  const {sortKey, reverse} = mapSort(sortBy);
  const variables = getPaginationVariables(request, {pageBy: RESULTS_PER_PAGE});
  const first = variables.first || RESULTS_PER_PAGE;
  const after = cursor || variables.endCursor || null;

  const isJsonRequest = request.headers.get('accept')?.includes('application/json');
  const shouldFetchContent = productFilters.length === 0 && sortBy === 'relevance';

  if (!term) {
    return {
      type: 'regular',
      term: '',
      result: getEmptySearchResult(),
      filters: [],
      total: 0,
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
      productFilters,
      types: shouldFetchContent ? ['PRODUCT', 'PAGE', 'ARTICLE'] : ['PRODUCT'],
    },
  });

  if (isJsonRequest) {
    return {
      items: {
        products: data.products || {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}},
      },
      total: data.products?.pageInfo?.hasNextPage ? (data.products?.nodes?.length || 0) + (RESULTS_PER_PAGE * 10) : (data.products?.nodes?.length || 0),
    };
  }

  const products = data.products || {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}};
  const pages = shouldFetchContent ? data.pages || {nodes: []} : {nodes: []};
  const articles = shouldFetchContent ? data.articles || {nodes: []} : {nodes: []};
  const total = products.nodes.length + pages.nodes.length + articles.nodes.length;

  return {
    type: 'regular',
    term,
    result: {
      total,
      items: {products, pages, articles},
    },
    filters: data.searchFilters?.filters || [],
    productFilters: data.productFilters || [],
  };
}

async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const variables = {limit: 5, term};

  if (!term) {
    return {
      type: 'predictive',
      term,
      result: getEmptyPredictiveSearchResult(),
    };
  }

  const data = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables,
  });

  return {
    type: 'predictive',
    term,
    result: predictiveSearchResult({data, term}),
  };
}

function predictiveSearchResult({data, term}) {
  if (!data) {
    return getEmptyPredictiveSearchResult();
  }

  const total =
    (data?.products?.nodes?.length || 0) +
    (data?.collections?.nodes?.length || 0) +
    (data?.pages?.nodes?.length || 0) +
    (data?.articles?.nodes?.length || 0) +
    (data?.queries?.nodes?.length || 0);

  return {
    total,
    items: {
      products: data.products || {nodes: []},
      collections: data.collections || {nodes: []},
      pages: data.pages || {nodes: []},
      articles: data.articles || {nodes: []},
      queries: data.queries || {nodes: []},
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

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
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
    $types: [SearchType!]
  ) @inContext(country: $country, language: $language) {
    productFilters: search(
      query: $term
      types: [PRODUCT]
      productFilters: $productFilters
      first: 1
      sortKey: $sortKey
      reverse: $reverse
      unavailableProducts: LAST
    ) {
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
    searchFilters: search(
      query: $term
      types: [PRODUCT]
      first: 1
      unavailableProducts: LAST
    ) {
      filters {
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
    }
    pages: search(query: $term, types: [PAGE], first: 100) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(query: $term, types: [ARTICLE], first: 100) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
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
      articles {
        nodes {
          id
          handle
          title
          trackingParameters
        }
      }
      collections {
        nodes {
          id
          handle
          title
          trackingParameters
        }
      }
      pages {
        nodes {
          id
          handle
          title
          trackingParameters
        }
      }
      products {
        nodes {
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
      }
      queries {
        nodes {
          id
          attributes {
            key
            value
          }
          styledText
          trackingParameters
        }
      }
    }
  }
`;

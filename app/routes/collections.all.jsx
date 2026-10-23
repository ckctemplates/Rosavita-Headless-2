import {useLoaderData} from 'react-router';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {CollectionProductGrid} from '~/components/CollectionProductGrid';

const PRODUCTS_PER_PAGE = 24;
const ALL_PAGE_TITLE = 'Shop All';
const ALL_SORT_KEY = 'BEST_SELLING';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `${ALL_PAGE_TITLE} | Rosavita`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: PRODUCTS_PER_PAGE,
  });

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {...paginationVariables},
  });

  return {products};
}

export default function CollectionAll() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  const hasProducts = Boolean(products?.nodes?.length);

  return (
    <div className="rv-collection">
      <div className="rv-collection__header">
        <h1 className="rv-collection__title">{ALL_PAGE_TITLE}</h1>
      </div>

      <div className="rv-collection__inner">
        {hasProducts ? (
          <Pagination connection={products}>
            {({nodes, isLoading, NextLink}) => (
              <>
                <CollectionProductGrid products={nodes} />
                {products.pageInfo?.hasNextPage ? (
                  <div className="rv-collection__pagination">
                    <NextLink className="rv-collection__loadmore">
                      {isLoading ? 'LOADING...' : 'LOAD MORE'}
                    </NextLink>
                  </div>
                ) : null}
              </>
            )}
          </Pagination>
        ) : (
          <div className="rv-collection__empty">
            <p className="rv-collection__empty-text">
              No products found in this collection.
            </p>
            <a href="/collections/all" className="rv-collection__empty-btn">
              BROWSE ALL PRODUCTS
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment MoneyCollectionProduct on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionProduct on Product {
    id
    handle
    title
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
        ...MoneyCollectionProduct
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionProduct
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
      title
      price {
        ...MoneyCollectionProduct
      }
      compareAtPrice {
        ...MoneyCollectionProduct
      }
      product {
        title
        handle
      }
      selectedOptions {
        name
        value
      }
      sku
    }
  }
`;

const CATALOG_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: BEST_SELLING
    ) {
      nodes {
        ...CollectionProduct
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionProductFragment} CollectionProductFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

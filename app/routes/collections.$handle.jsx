import {useLoaderData, redirect} from 'react-router';
import {getPaginationVariables, Analytics, Pagination} from '@shopify/hydrogen';
import {CollectionProductGrid} from '~/components/CollectionProductGrid';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

const PRODUCTS_PER_PAGE = 24;

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  if (!data?.collection) return [{title: 'Collection | Rosavita'}];
  const {title, description, seo} = data.collection;
  const descriptionText = (seo?.description || description || '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 155);
  return [
    {title: `${title} | Rosavita`},
    ...(descriptionText ? [{name: 'description', content: descriptionText}] : []),
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw redirect('/collections');
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: PRODUCTS_PER_PAGE,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  const products = collection.products;
  const hasProducts = Boolean(products?.nodes?.length);

  return (
    <div className="rv-collection">
      <div className="rv-collection__header">
        <h1 className="rv-collection__title">{collection.title}</h1>
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

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        sortKey: COLLECTION_DEFAULT
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
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionProductFragment} CollectionProductFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

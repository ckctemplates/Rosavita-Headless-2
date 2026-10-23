import {data} from 'react-router';

const UPSELL_PRODUCT_FRAGMENT = `#graphql
  fragment UpsellProduct on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      availableForSale
      title
      image {
        id
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
        id
        handle
        title
        vendor
      }
    }
  }
`;

const RECOMMENDATIONS_QUERY = `#graphql
  query CartUpsellRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...UpsellProduct
    }
  }
  ${UPSELL_PRODUCT_FRAGMENT}
`;

const FALLBACK_QUERY = `#graphql
  query CartUpsellFallback($handle: String!) {
    collection(handle: $handle) {
      products(first: 12, sortKey: BEST_SELLING) {
        nodes {
          ...UpsellProduct
        }
      }
    }
  }
  ${UPSELL_PRODUCT_FRAGMENT}
`;

const FALLBACK_COLLECTION_HANDLES = ['best-sellers', 'all', 'frontpage'];

export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const exclude = new Set(
    (url.searchParams.get('exclude') || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );

  let products = [];

  if (productId) {
    try {
      const result = await storefront.query(RECOMMENDATIONS_QUERY, {
        variables: {productId},
        cache: storefront.CacheShort(),
      });
      products = result?.productRecommendations ?? [];
    } catch (error) {
      console.error('Cart upsell recommendations failed', error);
    }
  }

  if (products.length < 2) {
    for (const handle of FALLBACK_COLLECTION_HANDLES) {
      try {
        const result = await storefront.query(FALLBACK_QUERY, {
          variables: {handle},
          cache: storefront.CacheShort(),
        });
        const nodes = result?.collection?.products?.nodes ?? [];
        if (nodes.length) {
          products = [...products, ...nodes];
          break;
        }
      } catch (error) {
        console.error(`Cart upsell collection "${handle}" failed`, error);
      }
    }
  }

  const seen = new Set();
  const filtered = products
    .filter((product) => {
      if (!product?.id || seen.has(product.id)) return false;
      if (exclude.has(product.id)) return false;
      if (!product.selectedOrFirstAvailableVariant?.availableForSale) {
        return false;
      }
      seen.add(product.id);
      return true;
    })
    .slice(0, 2);

  return data(
    {products: filtered},
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    },
  );
}

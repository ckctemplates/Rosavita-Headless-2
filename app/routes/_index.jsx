import {useLoaderData} from 'react-router';
import {Hero} from '~/components/home/Hero';
import {SplitFeature} from '~/components/home/SplitFeature';
import {TestedBox} from '~/components/home/TestedBox';
import {TrustBadges} from '~/components/home/TrustBadges';
import {ProductGrid} from '~/components/home/ProductGrid';
import {FeatureTabs} from '~/components/home/FeatureTabs';
import {CompareSection} from '~/components/home/CompareSection';
import {FaqAccordion} from '~/components/home/FaqAccordion';

const COLLECTION_HANDLE = 'best-sellers';

const PRODUCT_LINKS = [
  {
    key: 'moringa',
    match: [
      'rosavita-moringa-powder-capsules-np',
      'rosabella-moringa-powder-capsules-np',
      'moringa-powder',
    ],
    fallback: '/products/rosavita-moringa-powder-capsules-np',
  },
  {
    key: 'beetroot',
    match: ['organic-beetroot-capsules', 'beetroot'],
    fallback: '/products/beetroot',
  },
  {
    key: 'electrolyte',
    match: [
      'rosavita-electrolyte-drink-powder-b1',
      'rosabella-electrolyte-drink-powder-b1',
      'electrolyte-drink-powder',
      'electrolyte',
    ],
    fallback: '/products/rosavita-electrolyte-drink-powder-b1',
  },
  {
    key: 'gummies',
    match: [
      'rosavita-moringa-gummies-sub',
      'rosavita-moringa-gummies-bogo-np',
      'rosabella-moringa-gummies-bogo-np',
      'moringa-gummies',
      'gummies',
    ],
    fallback: '/products/rosavita-moringa-gummies-sub',
  },
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Rosavita | Organic Beetroot and Moringa'},
    {
      name: 'description',
      content:
        'Rosavita makes single-ingredient supplements from two time-tested plants: organic beetroot for circulation support and moringa for daily nutrition.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  const {storefront} = context;

  try {
    const [collectionResult, productsResult] = await Promise.allSettled([
      storefront.query(BEST_SELLERS_QUERY, {
        variables: {
          handle: COLLECTION_HANDLE,
          first: 12,
        },
      }),
      storefront.query(PRODUCTS_QUERY, {
        variables: {
          first: 24,
        },
      }),
    ]);

    const collectionProducts =
      collectionResult.status === 'fulfilled'
        ? collectionResult.value?.collection?.products?.nodes ?? []
        : [];

    const allProducts =
      productsResult.status === 'fulfilled'
        ? productsResult.value?.products?.nodes ?? []
        : [];

    const nodes = collectionProducts.length > 0 ? collectionProducts : allProducts;
    const productLinks = {};

    for (const link of PRODUCT_LINKS) {
      const product = nodes.find((node) =>
        link.match.some((term) => node.handle?.includes(term)),
      );
      productLinks[link.key] = product
        ? `/products/${product.handle}`
        : link.fallback;
    }

    return {
      products: {nodes},
      productLinks,
    };
  } catch (error) {
    console.error(error);

    return {
      products: {nodes: []},
      productLinks: Object.fromEntries(
        PRODUCT_LINKS.map((link) => [link.key, link.fallback]),
      ),
    };
  }
}

function loadDeferredData() {
  return {};
}

export default function Homepage() {
  const {products, productLinks} = useLoaderData();

  return (
    <div className="rv-home">
      <Hero />

      <div className="rv-splits">
        <SplitFeature
          title="Why people start with the beetroot"
          description="Beetroot's natural dietary nitrates convert to nitric oxide in your body, supporting normal blood flow. Two capsules make one serving, and that serving is 1,300 mg of organic beetroot powder. You'll find the same number on the label."
          image="https://cdn.shopify.com/s/files/1/0757/8822/2631/files/12.webp?v=1792938267"
          imageAlt="Rosavita Organic Beetroot Capsules bottle, 1,300 mg per serving"
        />
        <SplitFeature
          title="And why they stay for the moringa"
          description="Moringa leaf packs vitamin A, iron, calcium, and plant protein into a single plant. Choose capsules, gummies, or pure powder, whichever fits your routine best."
          image="https://cdn.shopify.com/s/files/1/0757/8822/2631/files/123.webp?v=1792938222"
          imageAlt="Rosavita Moringa Capsules bottle, organic moringa leaf powder"
          reversed
        />
        <TestedBox />
        <TrustBadges />
      </div>

      <ProductGrid products={products} />
      <FeatureTabs productLinks={productLinks} />
      <CompareSection />
      <FaqAccordion />
    </div>
  );
}

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    tags
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
    }
    variants(first: 1) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
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
    subtitle: metafield(namespace: "custom", key: "subtitle") {
      value
    }
    subtitle2: metafield(namespace: "custom", key: "short_description") {
      value
    }
  }
`;

const BEST_SELLERS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query BestSellers(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Products($country: CountryCode, $language: LanguageCode, $first: Int)
    @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductsQuery} ProductsQuery */

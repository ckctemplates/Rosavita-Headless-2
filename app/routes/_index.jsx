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
    match: ['rosabella-moringa-powder-capsules-np', 'moringa-powder'],
    fallback: '/products/rosabella-moringa-powder-capsules-np',
  },
  {
    key: 'beetroot',
    match: ['organic-beetroot-capsules', 'beetroot'],
    fallback:
      '/products/rosabella-organic-beetroot-capsules-1300mg-for-blood-flow-heart-health-bogo-sub',
  },
  {
    key: 'electrolyte',
    match: ['electrolyte-drink-powder', 'electrolyte'],
    fallback: '/products/rosabella-electrolyte-drink-powder-b1',
  },
  {
    key: 'gummies',
    match: ['moringa-gummies', 'gummies'],
    fallback: '/products/rosabella-moringa-gummies-bogo-np',
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
        'Rosabella makes single-ingredient supplements from two time-tested plants: organic beetroot for circulation support and moringa for daily nutrition.',
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
          title="WHY PEOPLE START WITH THE BEETROOT"
          description="Beetroot's natural dietary nitrates convert to nitric oxide in your body, supporting normal blood flow. Two capsules make one serving, and that serving is 1,300 mg of organic beetroot powder. You'll find the same number on the label."
          image="/images/beetroot-bottle.webp"
          imageAlt="Rosabella organic beetroot capsules bottle"
        />
        <SplitFeature
          title="AND WHY THEY STAY FOR THE MORINGA"
          description="Moringa leaf packs vitamin A, iron, calcium, and plant protein into a single plant. Choose capsules, gummies, or pure powder, whichever fits your routine best."
          image="/images/moringa-bottle.webp"
          imageAlt="Rosabella organic moringa capsules bottle"
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

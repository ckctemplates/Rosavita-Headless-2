import {useLoaderData, useLocation, useNavigate} from 'react-router';
import {useEffect, useRef, useState} from 'react';
import {
  Analytics,
  getSelectedProductOptions,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductBuyBox} from '~/components/product/ProductBuyBox';
import {ProductFaqBand} from '~/components/product/ProductFaqBand';
import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductStoryBand} from '~/components/product/ProductStoryBand';
import {ProductTestimonial} from '~/components/product/ProductTestimonial';
import {SuperfoodSection} from '~/components/product/SuperfoodSection';
import {
  FINAL_CTA_BEHAVIOR,
  SHIP_LEAD_DAYS,
} from '~/lib/product-page-constants';
import {
  findDefaultVariant,
  formatShipByDate,
  getPreferredPlanName,
  getShipByDate,
  getVariantPricing,
  hasSellingPlans,
  resolveProductContent,
  stripHtml,
} from '~/lib/product-page-content';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const product = data?.product;
  if (!product) return [{title: 'Product | Rosavita'}];

  const title = product.seo?.title || product.title || 'Product';
  const description = stripHtml(
    product.seo?.description || product.description || product.descriptionHtml,
  ).slice(0, 155);
  const image = product.featuredImage?.url;

  return [
    {title: `${title} | Rosavita`},
    ...(description ? [{name: 'description', content: description}] : []),
    {
      rel: 'canonical',
      href: `/products/${product.handle}`,
    },
    ...(image
      ? [
          {property: 'og:image', content: image},
          {property: 'og:title', content: `${title} | Rosavita`},
          ...(description
            ? [{property: 'og:description', content: description}]
            : []),
          {property: 'og:type', content: 'product'},
        ]
      : []),
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response(null, {status: 404});
  }

  const selectedOptions = getSelectedProductOptions(request);

  const [productResult, paymentResult] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: storefront.CacheShort(),
    }),
    storefront
      .query(PAYMENT_SETTINGS_QUERY, {
        cache: storefront.CacheLong(),
      })
      .catch(() => null),
  ]);

  const {product} = productResult || {};
  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle.
  redirectIfHandleIsLocalized(request, {handle, data: product});

  const initialVariant = selectedOptions.length
    ? product.selectedOrFirstAvailableVariant
    : findDefaultVariant(product);

  return {
    product,
    initialVariant:
      initialVariant ||
      product.selectedOrFirstAvailableVariant ||
      product.variants?.nodes?.[0] ||
      null,
    paymentSettings: paymentResult?.shop?.paymentSettings || null,
    shipByDate: formatShipByDate(getShipByDate(SHIP_LEAD_DAYS)),
  };
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, initialVariant, paymentSettings, shipByDate} =
    useLoaderData();

  const selectedVariant = useOptimisticVariant(initialVariant, product);
  const content = resolveProductContent(product);
  const hasPlans = hasSellingPlans(product);
  const preferredPlanName = getPreferredPlanName(product);

  const [purchaseMode, setPurchaseMode] = useState(
    hasPlans ? 'subscribe' : 'once',
  );

  useEffect(() => {
    if (!hasPlans) setPurchaseMode('once');
  }, [hasPlans]);

  // Keep the selected variant shareable in the URL. The hook merges with any
  // unrelated query params instead of deleting them.
  useSelectedOptionInUrlParam(selectedVariant?.selectedOptions || []);

  const navigate = useNavigate();
  const location = useLocation();
  const addToCartRef = useRef(null);
  const buySectionRef = useRef(null);

  const pricing = selectedVariant
    ? getVariantPricing(selectedVariant, purchaseMode, preferredPlanName)
    : null;

  const handleSelectVariant = (variant) => {
    if (!variant?.selectedOptions?.length) return;
    const params = new URLSearchParams(location.search);
    for (const option of variant.selectedOptions) {
      params.set(option.name, option.value);
    }
    navigate(
      {search: params.toString()},
      {replace: true, preventScrollReset: true},
    );
  };

  const handleFinalCta = () => {
    if (FINAL_CTA_BEHAVIOR === 'add-to-cart') {
      addToCartRef.current?.click();
      return;
    }

    buySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    window.setTimeout(() => {
      addToCartRef.current?.focus({preventScroll: true});
    }, 450);
  };

  const galleryImages = product.images?.nodes?.length
    ? product.images.nodes
    : product.featuredImage
      ? [product.featuredImage]
      : [];

  const jsonLd = buildProductJsonLd({
    product,
    selectedVariant,
    pricing,
    content,
  });

  return (
    <div
      className="rv-pdp"
      style={{
        '--rv-pdp-accent': content.theme.accent,
        '--rv-pdp-tint': content.theme.tint,
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
        type="application/ld+json"
      />

      <section className="rv-pdp__buy" ref={buySectionRef}>
        <div className="rv-pdp-container rv-pdp__buy-grid">
          <div className="rv-pdp__gallery-column">
            <ProductGallery
              images={galleryImages}
              title={product.title}
            />
            <ProductTestimonial review={content.featuredReview} />
          </div>

          <ProductBuyBox
            addToCartRef={addToCartRef}
            content={content}
            hasPlans={hasPlans}
            onSelectVariant={handleSelectVariant}
            onTogglePurchaseMode={() =>
              setPurchaseMode((mode) =>
                mode === 'subscribe' ? 'once' : 'subscribe',
              )
            }
            paymentSettings={paymentSettings}
            preferredPlanName={preferredPlanName}
            pricing={pricing}
            product={product}
            purchaseMode={purchaseMode}
            selectedVariant={selectedVariant}
            shipByDate={shipByDate}
          />
        </div>
      </section>

      <ProductStoryBand sections={content.storySections} />
      <SuperfoodSection section={content.superfood} />
      <ProductFaqBand faqs={content.faqs} onCtaClick={handleFinalCta} />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price:
                pricing?.price?.amount ||
                selectedVariant?.price?.amount ||
                '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function buildProductJsonLd({product, selectedVariant, pricing, content}) {
  const description = content.intro || stripHtml(product.description).slice(0, 400);
  const offerCurrency =
    pricing?.price?.currencyCode || selectedVariant?.price?.currencyCode;
  const offerPrice =
    pricing?.price?.amount || selectedVariant?.price?.amount;
  const offer =
    selectedVariant && offerPrice && offerCurrency
      ? {
          '@type': 'Offer',
          priceCurrency: offerCurrency,
          price: offerPrice,
          availability: selectedVariant.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `/products/${product.handle}`,
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: content.displayTitle || product.title,
    image: (product.images?.nodes || []).map((image) => image.url),
    description,
    ...(selectedVariant?.sku ? {sku: selectedVariant.sku} : {}),
    ...(product.vendor
      ? {brand: {'@type': 'Brand', name: product.vendor}}
      : {}),
    ...(offer ? {offers: offer} : {}),
    ...(content.rating && content.ratingCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: content.rating,
            reviewCount: content.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    sku
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
      title
      handle
    }
    metafields(identifiers: [
      {namespace: "custom", key: "bundle_title"}
      {namespace: "custom", key: "bundle_subtitle"}
      {namespace: "custom", key: "bundle_badge"}
      {namespace: "custom", key: "free_shipping"}
    ]) {
      namespace
      key
      type
      value
    }
    sellingPlanAllocations(first: 10) {
      nodes {
        sellingPlan {
          id
          name
          options {
            name
            value
          }
          recurringDeliveries
        }
        priceAdjustments {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          perDeliveryPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    availableForSale
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 20) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 100) {
      nodes {
        ...ProductVariant
      }
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        options {
          name
          values
        }
        sellingPlans(first: 10) {
          nodes {
            id
            name
            description
            options {
              name
              value
            }
            recurringDeliveries
            priceAdjustments {
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
                ... on SellingPlanFixedAmountPriceAdjustment {
                  adjustmentAmount {
                    amount
                    currencyCode
                  }
                }
                ... on SellingPlanFixedPriceAdjustment {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "display_title"}
      {namespace: "custom", key: "subheading"}
      {namespace: "custom", key: "short_description"}
      {namespace: "custom", key: "benefits"}
      {namespace: "custom", key: "featured_review"}
      {namespace: "custom", key: "accordions"}
      {namespace: "custom", key: "story_sections"}
      {namespace: "custom", key: "superfood_section"}
      {namespace: "custom", key: "faqs"}
      {namespace: "custom", key: "guarantee"}
      {namespace: "custom", key: "accent_color"}
      {namespace: "custom", key: "section_tint"}
      {namespace: "custom", key: "rating_value"}
      {namespace: "custom", key: "rating_count"}
      {namespace: "reviews", key: "rating"}
      {namespace: "reviews", key: "rating_count"}
    ]) {
      namespace
      key
      type
      value
    }
    seo {
      title
      description
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query ProductPage(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PAYMENT_SETTINGS_QUERY = `#graphql
  query ProductPagePaymentSettings {
    shop {
      paymentSettings {
        acceptedCardBrands
        supportedDigitalWallets
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

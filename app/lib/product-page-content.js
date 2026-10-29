import {
  AUTO_DELIVERS_TEMPLATE,
  BUNDLE_BADGES,
  DEFAULT_BUNDLE_INDEX,
  DEFAULT_PLAN_NAME,
  DEFAULT_THEME,
  FREE_SHIPPING_FROM_INDEX,
  PRODUCT_THEMES,
  RATING_SOURCE_LABEL,
} from './product-page-constants';

// Fallback for the second story row. The reference page uses this photo/video
// frame; override it from the custom.story_sections metafield when available.
export const STORY_ROW_2_IMAGE_URL = '/images/beetroot-story-2.jpg';

/**
 * Fallback content is kept in one editable place, keyed by product handle.
 * Metafields always win over this content; products with neither hide the section.
 * The copy below is used by the Beetroot product until its metafields are filled in.
 */
export const PRODUCT_PAGE_FALLBACKS = {
  beetroot: {
    rating: 4.4,
    displayTitle:
      'Rosavita Beetroot Capsules To Support Circulation And Vitality*',
    subheading: "Natural Support For Your Body's Circulation System",
    intro:
      'Modern stress, nutrient-poor diets, and inactivity can impact overall wellness. Rosavita Beetroot is formulated with 1300mg of beetroot powder, naturally containing nitrates.',
    benefits: [
      'Helps support healthy blood flow.',
      'Supports a healthy circulatory system',
      'Natural source of dietary nitrates',
      'A simple daily habit to feel more balanced and alert throughout the day',
    ],
    featuredReview: {
      quote:
        'Best customer support ever. My issue was resolved quickly and professionally. I so love how the beetroot capsules are helping manage my blood pressure.',
      author: 'Cathy',
      location: 'US',
      verified: true,
    },
    guarantee: {
      title: "Love it or it's free!",
      text: "If you don't notice a difference within 90 days of the product being delivered, return it within 90 days for a full refund*",
    },
    accordions: [
      {
        title: 'How does it work?',
        body: 'Rosavita Beetroot provides 1300mg of beetroot powder per serving. Beetroot is a natural source of dietary nitrates, which the body converts into nitric oxide, a compound that helps support healthy blood flow and circulation.*',
      },
      {
        title: 'Why Choose a Beetroot Supplement?',
        body: 'A supplement offers a consistent, convenient serving of beetroot without the prep work of juicing or cooking fresh beets. Rosavita Beetroot is made with premium beetroot powder and no artificial colors, flavors, or preservatives.',
      },
      {
        title: 'When Will I See Results?',
        body: 'Everyone is different. Some people notice a difference within a few weeks of consistent daily use, while others may take longer. We recommend taking it daily as part of a balanced routine.',
      },
      {
        title: 'What to Expect with Rosavita Beetroot',
        body: 'Rosavita Beetroot is designed to be a simple daily habit. Take it consistently alongside a balanced diet and active lifestyle to support your circulation and overall vitality.*',
      },
      {
        title: 'How Long Until I Get It?',
        body: 'Orders are typically processed within 1-2 business days. Standard delivery usually takes 3 to 6 business days after your order ships.',
      },
      {
        title: 'Who Can Use It?',
        body: 'Rosavita Beetroot is intended for adults. If you are pregnant, nursing, taking medication, or managing a medical condition, consult a healthcare provider before use.',
      },
      {
        title: 'Results or Full Refund Guarantee',
        body: "Every order is covered by our 90-day money-back guarantee. If you don't notice a difference, contact our support team within 90 days of delivery for a full refund.",
      },
    ],
    storySections: [
      {
        heading: 'The Hidden Cost of Modern Living',
        paragraphs: [
          "Today's world is busier than ever. Between work demands, family responsibilities, and packed schedules, many people are looking for ways to support their daily energy and wellness.",
          "You want to feel your best throughout the day - whether you're tackling a big project, keeping up with the kids, or just getting through your daily routine.",
          'Many people are rediscovering traditional foods that have been valued for generations. Beetroot is one of those time-tested ingredients that people have turned to for centuries as part of their nutrition.',
        ],
        bullets: [],
        imageUrl:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/pro22.jpg?v=1792940407',
        imageAlt: 'Woman holding Rosavita Beetroot bottle in a kitchen',
        imageWidth: 1024,
        imageHeight: 1024,
      },
      {
        heading: 'Rosavita Beetroot: Simple Daily Nutrition',
        paragraphs: [
          'For thousands of years, beetroot has been prized as a powerhouse vegetable - packed with natural compounds that made it a staple in traditional diets.',
          'Today, getting enough nutrient-dense whole foods can be challenging with busy schedules and processed food everywhere.',
          'Beetroot naturally contains dietary nitrates and has remained popular among health-conscious people who want to include more traditional superfoods in their routine.',
          'From fitness enthusiasts to busy professionals, people choose beetroot supplements for the convenience and consistency they provide.',
          'Rosavita Beetroot delivers 1300mg of premium beetroot powder in every serving - making it perfect for those who want to:',
        ],
        bullets: [
          'Support healthy blood flow*',
          'Support a healthy circulatory system*',
          'Promote overall vitality*',
        ],
        imageUrl: STORY_ROW_2_IMAGE_URL,
        imageAlt: 'Hand holding an open bottle of beetroot capsules over green grass',
        imageWidth: 720,
        imageHeight: 836,
      },
    ],
    superfood: {
      heading: 'Built Around One Superfood',
      paragraphs: [
        'Many supplements pack in dozens of ingredients - but Rosavita Beetroot takes a different approach.',
        'Our formula is built around one core ingredient:',
      ],
      highlight: 'Premium beetroot powder',
      afterHighlight:
        'Used for centuries in traditional cultures as a nutritious whole food, beetroot has remained popular in modern wellness routines. Each serving provides beetroot nutrition in a convenient daily format.',
      listHeading: "What You'll Find in Every 1300mg Serving:",
      features: [
        {
          title: 'Natural Beetroot Nutrition',
          text: 'Traditional whole food ingredient that has been valued for generations as part of healthy diets.',
        },
        {
          title: 'Simple Daily Convenience',
          text: 'Easy-to-take capsules that fit seamlessly into your wellness routine, without the prep time of fresh beetroot.',
        },
        {
          title: 'Quality You Can Trust',
          text: 'Premium beetroot powder with no artificial colors, flavors, or preservatives.',
        },
      ],
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/pro11.jpg?v=1792940076',
      imageAlt: 'Infographic of Rosavita Beetroot benefits',
    },
    faqs: [
      {
        question: 'Can I buy Rosavita Beetroot in stores?',
        answer:
          'Rosavita Beetroot is currently available online through our official store. Buying direct ensures you receive authentic product and access to our satisfaction guarantee.',
      },
      {
        question: 'What ingredients are in Rosavita Beetroot?',
        answer:
          'Rosavita Beetroot contains 1300mg of premium beetroot powder per serving in a vegetarian capsule. It is made without artificial colors, flavors, or preservatives.',
      },
      {
        question: 'Is Rosavita Beetroot safe to take with my current medications?',
        answer:
          'If you are taking prescription medication or managing a health condition, please consult your healthcare provider before starting any new supplement.',
      },
      {
        question: 'How should I store Rosavita Beetroot?',
        answer:
          'Store the bottle in a cool, dry place away from direct sunlight. Keep the lid tightly closed and out of reach of children.',
      },
      {
        question: 'What is Rosavita Beetroot intended for?',
        answer:
          'It is a daily beetroot supplement intended to support healthy blood flow, a healthy circulatory system, and overall vitality as part of a balanced lifestyle.*',
      },
      {
        question: 'How should I use Rosavita Beetroot?',
        answer:
          'Take the recommended serving with water, ideally with a meal. Follow the directions on the label and use consistently for best results.',
      },
      {
        question: 'How often should I take the supplement?',
        answer:
          'Take it once daily, or as directed on the label. If you have questions about the right routine for you, speak with your healthcare provider.',
      },
      {
        question: 'How many servings are in each container?',
        answer:
          'Each bottle contains a 30-day supply when taken as directed. Multi-bottle bundles provide a 60- or 90-day supply.',
      },
      {
        question: 'Are there any age or health restrictions?',
        answer:
          'This product is intended for adults. Consult a healthcare provider before use if you are pregnant, nursing, under 18, taking medication, or managing a medical condition.',
      },
      {
        question: "What if the supplement doesn't work for me?",
        answer:
          'Every order is covered by our 90-day money-back guarantee. If you are not satisfied, contact our support team within 90 days of delivery.',
      },
      {
        question: 'What is your return policy?',
        answer:
          "Every order is covered by our 90-day money-back guarantee. If you don't notice a difference within 90 days of the product being delivered, return it within 90 days for a full refund.*",
      },
    ],
  },
};

export const RATING_SOURCE_TEXT = RATING_SOURCE_LABEL;
export {AUTO_DELIVERS_TEMPLATE};

/**
 * @param {unknown} entity
 * @param {string} namespace
 * @param {string} key
 * @returns {string | null}
 */
export function getMetafieldValue(entity, namespace, key) {
  const metafields = entity?.metafields;
  if (!Array.isArray(metafields)) return null;
  const metafield = metafields.find(
    (item) => item && item.namespace === namespace && item.key === key,
  );
  if (!metafield || metafield.value == null || metafield.value === '') {
    return null;
  }
  return metafield.value;
}

/** @param {unknown} value */
export function safeJsonParse(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/** @param {unknown} value */
function toTrimmedString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/** @param {unknown} value */
function toDimension(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.round(number);
}

/** @param {unknown} value */
function toTextArray(value) {
  const parsed = safeJsonParse(value);
  if (Array.isArray(parsed)) {
    return parsed.map(toTrimmedString).filter(Boolean);
  }
  if (typeof parsed === 'string') {
    return parsed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

/** @param {unknown} value */
function toObject(value) {
  const parsed = safeJsonParse(value);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  return null;
}

/** @param {unknown} value */
function toObjectArray(value) {
  const parsed = safeJsonParse(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (item) => item && typeof item === 'object' && !Array.isArray(item),
  );
}

/** @param {unknown} value */
export function parseBoolean(value) {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return false;
}

/** @param {string | null | undefined} html */
export function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** @param {any} product */
function firstDescriptionParagraph(product) {
  const html = product?.descriptionHtml || '';
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (match) return stripHtml(match[1]);
  const text = stripHtml(product?.description || '');
  if (!text) return '';
  const firstSentence = text.split(/(?<=\.)\s/)[0];
  return (firstSentence || text).trim();
}

/** @param {unknown} value */
function normalizeRating(value) {
  const parsed = safeJsonParse(value);
  const raw =
    parsed && typeof parsed === 'object'
      ? parsed.value ?? parsed.rating ?? parsed.average ?? parsed.score
      : parsed ?? value;
  const number = Number(raw);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.min(number, 5);
}

/** @param {unknown} value */
function normalizeRatingCount(value) {
  const parsed = safeJsonParse(value);
  const raw =
    parsed && typeof parsed === 'object'
      ? parsed.value ?? parsed.count ?? parsed.ratingCount
      : parsed ?? value;
  const number = Number(raw);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.round(number);
}

/** @param {any} product */
function normalizeFeaturedReview(product, fallback) {
  const parsed = toObject(
    getMetafieldValue(product, 'custom', 'featured_review'),
  );
  const review = parsed || fallback?.featuredReview;
  if (!review || !toTrimmedString(review.quote)) return null;
  return {
    quote: toTrimmedString(review.quote),
    author: toTrimmedString(review.author) || 'Verified buyer',
    location: toTrimmedString(review.location),
    verified: parseBoolean(review.verified),
  };
}

/** @param {any} product */
function normalizeGuarantee(product, fallback) {
  const parsed = toObject(getMetafieldValue(product, 'custom', 'guarantee'));
  const guarantee = parsed || fallback?.guarantee;
  if (!guarantee) return null;
  const title = toTrimmedString(guarantee.title);
  const text = toTrimmedString(guarantee.text);
  if (!title && !text) return null;
  return {title, text};
}

/** @param {any} product */
function normalizeAccordions(product, fallback) {
  const metafield = toObjectArray(
    getMetafieldValue(product, 'custom', 'accordions'),
  );
  const items = metafield.length ? metafield : fallback?.accordions || [];
  return items
    .map((item) => ({
      title: toTrimmedString(item.title),
      body: toTrimmedString(item.body ?? item.answer ?? item.text),
    }))
    .filter((item) => item.title && item.body);
}

/** @param {any} product */
function normalizeFaqs(product, fallback) {
  const metafield = toObjectArray(getMetafieldValue(product, 'custom', 'faqs'));
  const items = metafield.length ? metafield : fallback?.faqs || [];
  return items
    .map((item) => ({
      question: toTrimmedString(item.question ?? item.title),
      answer: toTrimmedString(item.answer ?? item.body ?? item.text),
    }))
    .filter((item) => item.question && item.answer);
}

/** @param {any} product */
function normalizeStorySections(product, fallback) {
  const metafield = toObjectArray(
    getMetafieldValue(product, 'custom', 'story_sections'),
  );
  const items = metafield.length ? metafield : fallback?.storySections || [];
  return items
    .map((item) => ({
      heading: toTrimmedString(item.heading ?? item.title),
      paragraphs: toTextArray(item.paragraphs).length
        ? toTextArray(item.paragraphs)
        : Array.isArray(item.paragraphs)
          ? item.paragraphs.map(toTrimmedString).filter(Boolean)
          : [],
      bullets: toTextArray(item.bullets).length
        ? toTextArray(item.bullets)
        : Array.isArray(item.bullets)
          ? item.bullets.map(toTrimmedString).filter(Boolean)
          : [],
      imageUrl: toTrimmedString(
        item.image_url ?? item.imageUrl ?? item.image,
      ),
      imageAlt: toTrimmedString(item.image_alt ?? item.imageAlt),
      imageWidth: toDimension(item.image_width ?? item.imageWidth),
      imageHeight: toDimension(item.image_height ?? item.imageHeight),
      imageFit: toTrimmedString(item.image_fit ?? item.imageFit).toLowerCase(),
    }))
    .filter(
      (item) =>
        item.heading ||
        item.paragraphs.length ||
        item.bullets.length ||
        item.imageUrl,
    );
}

/** @param {any} product */
function normalizeSuperfood(product, fallback) {
  const parsed = toObject(
    getMetafieldValue(product, 'custom', 'superfood_section'),
  );
  const section = parsed || fallback?.superfood;
  if (!section) return null;
  const heading = toTrimmedString(section.heading ?? section.title);
  const paragraphs = toTextArray(section.paragraphs);
  const features = Array.isArray(section.features)
    ? section.features
        .map((feature) => ({
          title: toTrimmedString(feature?.title),
          text: toTrimmedString(feature?.text),
        }))
        .filter((feature) => feature.title || feature.text)
    : [];
  const imageUrl = toTrimmedString(
    section.image_url ?? section.imageUrl ?? section.image,
  );
  const imageAlt = toTrimmedString(section.image_alt ?? section.imageAlt);
  if (!heading && !paragraphs.length && !features.length && !imageUrl) {
    return null;
  }
  return {
    heading,
    paragraphs,
    highlight: toTrimmedString(section.highlight),
    afterHighlight: toTrimmedString(
      section.after_highlight ?? section.afterHighlight,
    ),
    listHeading: toTrimmedString(
      section.list_heading ?? section.listHeading,
    ),
    features,
    imageUrl,
    imageAlt,
  };
}

/** @param {any} product */
function resolveTheme(product) {
  const fallback = PRODUCT_THEMES[product?.handle] || DEFAULT_THEME;
  const accent = toTrimmedString(
    getMetafieldValue(product, 'custom', 'accent_color'),
  );
  const tint = toTrimmedString(
    getMetafieldValue(product, 'custom', 'section_tint'),
  );
  return {
    accent: accent || fallback.accent,
    tint: tint || fallback.tint,
  };
}

/**
 * Merge product metafields over the handle-based fallback content.
 * @param {any} product
 */
export function resolveProductContent(product) {
  const fallback = PRODUCT_PAGE_FALLBACKS[product?.handle] || {};
  const theme = resolveTheme(product);

  const metafieldBenefits = toTextArray(
    getMetafieldValue(product, 'custom', 'benefits'),
  );

  return {
    theme,
    rating:
      normalizeRating(getMetafieldValue(product, 'reviews', 'rating')) ??
      normalizeRating(getMetafieldValue(product, 'custom', 'rating_value')) ??
      normalizeRating(fallback.rating),
    ratingCount:
      normalizeRatingCount(
        getMetafieldValue(product, 'reviews', 'rating_count'),
      ) ??
      normalizeRatingCount(getMetafieldValue(product, 'custom', 'rating_count')) ??
      normalizeRatingCount(fallback.ratingCount),
    displayTitle:
      toTrimmedString(getMetafieldValue(product, 'custom', 'display_title')) ||
      fallback.displayTitle ||
      product?.title ||
      '',
    subheading:
      toTrimmedString(getMetafieldValue(product, 'custom', 'subheading')) ||
      fallback.subheading ||
      '',
    intro:
      toTrimmedString(
        getMetafieldValue(product, 'custom', 'short_description'),
      ) ||
      fallback.intro ||
      firstDescriptionParagraph(product),
    benefits: metafieldBenefits.length
      ? metafieldBenefits
      : fallback.benefits || [],
    featuredReview: normalizeFeaturedReview(product, fallback),
    guarantee: normalizeGuarantee(product, fallback),
    accordions: normalizeAccordions(product, fallback),
    storySections: normalizeStorySections(product, fallback),
    superfood: normalizeSuperfood(product, fallback),
    faqs: normalizeFaqs(product, fallback),
  };
}

/** @param {any} variant @param {string} key */
function getVariantMetafield(variant, key) {
  return getMetafieldValue(variant, 'custom', key);
}

/** @param {string} title */
function deriveBottleSubtitle(title) {
  const match = String(title || '').match(/(\d+)\s*bottle/i);
  if (!match) return '';
  const count = Number(match[1]);
  return `${count} Bottle${count === 1 ? '' : 's'} in Total`;
}

/**
 * Bundle display data for one variant card.
 * @param {any} variant
 * @param {number} index
 */
export function getBundleContent(variant, index) {
  const title = getVariantMetafield(variant, 'bundle_title') || variant.title;
  const subtitle =
    getVariantMetafield(variant, 'bundle_subtitle') ||
    deriveBottleSubtitle(variant.title) ||
    '';
  const badge =
    getVariantMetafield(variant, 'bundle_badge') ||
    BUNDLE_BADGES[index] ||
    '';
  const freeShippingMetafield = getVariantMetafield(
    variant,
    'free_shipping',
  );
  const freeShipping =
    parseBoolean(freeShippingMetafield) ||
    (typeof FREE_SHIPPING_FROM_INDEX === 'number' &&
      index >= FREE_SHIPPING_FROM_INDEX);

  return {title, subtitle, badge, freeShipping};
}

/**
 * Find a variant by its selected options.
 * @param {any} product
 * @param {Array<{name: string; value: string}>} options
 */
export function findVariantByOptions(product, options) {
  const variants = product?.variants?.nodes || [];
  return (
    variants.find((variant) =>
      options.every((option) =>
        (variant.selectedOptions || []).some(
          (selected) =>
            selected.name === option.name &&
            selected.value === option.value,
        ),
      ),
    ) || null
  );
}

/**
 * Choose the default bundle: badge = MOST POPULAR, then DEFAULT_BUNDLE_INDEX,
 * then the first available variant, then the first variant.
 * @param {any} product
 */
export function findDefaultVariant(product) {
  const variants = product?.variants?.nodes || [];
  if (!variants.length) return null;

  const popular = variants.find((variant) => {
    const badge = getVariantMetafield(variant, 'bundle_badge');
    return String(badge || '').toUpperCase() === 'MOST POPULAR';
  });
  if (popular) return popular;

  const configured = variants[DEFAULT_BUNDLE_INDEX];
  if (configured?.availableForSale) return configured;

  return variants.find((variant) => variant.availableForSale) || variants[0];
}

/** @param {any} product */
export function getBundleOptionName(product) {
  const options = product?.options || [];
  if (!options.length) return null;
  if (options.length === 1) return options[0].name;
  const preferred = options.find((option) =>
    /supply|size|bundle|pack|quantity/i.test(option.name || ''),
  );
  return (preferred || options[options.length - 1]).name;
}

/** @param {any} product */
export function getExtraOptions(product) {
  const bundleOptionName = getBundleOptionName(product);
  return (product?.options || []).filter(
    (option) => option.name !== bundleOptionName,
  );
}

/**
 * The variants that belong to the currently selected extra options.
 * @param {any} product
 * @param {any} selectedVariant
 */
export function getVisibleBundleVariants(product, selectedVariant) {
  const variants = product?.variants?.nodes || [];
  const extraOptions = getExtraOptions(product);
  if (!extraOptions.length || !selectedVariant) return variants;

  return variants.filter((variant) =>
    extraOptions.every((option) => {
      const expected = (selectedVariant.selectedOptions || []).find(
        (selected) => selected.name === option.name,
      )?.value;
      return (variant.selectedOptions || []).some(
        (selected) =>
          selected.name === option.name && selected.value === expected,
      );
    }),
  );
}

/** @param {any} variant @param {string} optionName */
export function getVariantOptionValue(variant, optionName) {
  return (variant?.selectedOptions || []).find(
    (option) => option.name === optionName,
  )?.value;
}

/**
 * Find a variant for an extra option change while keeping the other options.
 * @param {any} product
 * @param {any} selectedVariant
 * @param {string} optionName
 * @param {string} value
 */
export function findVariantForOptionChange(
  product,
  selectedVariant,
  optionName,
  value,
) {
  const variants = product?.variants?.nodes || [];
  const desired = (selectedVariant?.selectedOptions || []).map((option) =>
    option.name === optionName ? {...option, value} : option,
  );

  return (
    findVariantByOptions(product, desired) ||
    variants.find(
      (variant) =>
        variant.availableForSale &&
        getVariantOptionValue(variant, optionName) === value,
    ) ||
    variants.find(
      (variant) => getVariantOptionValue(variant, optionName) === value,
    ) ||
    null
  );
}

/**
 * Pick the allocation for a variant. Prefer the configured plan name, else the
 * first allocation (different variants can legitimately belong to different plans).
 * @param {any} variant
 * @param {string} preferredPlanName
 */
export function getVariantAllocation(variant, preferredPlanName = DEFAULT_PLAN_NAME) {
  const allocations = variant?.sellingPlanAllocations?.nodes || [];
  if (!allocations.length) return null;
  if (preferredPlanName) {
    const match = allocations.find(
      (allocation) =>
        allocation?.sellingPlan?.name === preferredPlanName,
    );
    if (match) return match;
  }
  return allocations[0];
}

/**
 * Price rules for the current purchase mode.
 * @param {any} variant
 * @param {'subscribe' | 'once'} purchaseMode
 * @param {string} preferredPlanName
 */
function getBundleCountForVariant(variant) {
  if (!variant) return 1;
  const source = `${variant.title || ''}`;
  const match = source.match(/(\d+)\s*bottle/i);
  if (match) {
    const count = Number(match[1]);
    if (Number.isFinite(count) && count > 0) {
      return count;
    }
  }
  return 1;
}

function getBundleCountForVariantStrict(variant) {
  if (!variant) return 1;
  const source = `${variant.title || ''}`;
  const match = source.match(/(\d+)\s*bottle/i);
  if (match) {
    const count = Number(match[1]);
    if (Number.isFinite(count) && count > 0) {
      return count;
    }
  }
  return 1;
}

export function getVariantPricing(
  variant,
  purchaseMode,
  preferredPlanName = DEFAULT_PLAN_NAME,
) {
  const allocation = getVariantAllocation(variant, preferredPlanName);
  const adjustment = allocation?.priceAdjustments?.[0];
  // Always use the currency Shopify returned for this variant; never assume USD.
  const currencyCode =
    variant?.price?.currencyCode ||
    adjustment?.price?.currencyCode ||
    adjustment?.compareAtPrice?.currencyCode ||
    variant?.compareAtPrice?.currencyCode ||
    'USD';

  const productHandle = variant?.product?.handle || '';
  const isBeetroot = productHandle === 'beetroot' || /beetroot/i.test(productHandle);

  if (isBeetroot) {
    const count = getBundleCountForVariantStrict(variant);
    const oneTimeTotals = {
      1: 20.9,
      2: 41.8,
      3: 62.7,
    };
    const subTotals = {
      1: 18.81,
      2: 33.44,
      3: 43.89,
    };
    const subStrikes = {
      1: 20.9,
      2: 41.8,
      3: 62.7,
    };

    if (purchaseMode === 'subscribe') {
      const strike = subStrikes[count] ?? null;
      const current = subTotals[count] ?? Number(adjustment?.price?.amount || oneTimeTotals[count] || 0);
      const savingAmount = strike ? strike - current : 0;
      const savingPercent = strike ? Math.round((savingAmount / strike) * 100) : 0;
      return {
        price: {amount: current.toFixed(2), currencyCode},
        compareAt: strike ? {amount: strike.toFixed(2), currencyCode} : null,
        savingAmount,
        savingPercent,
        allocation,
        sellingPlan: allocation?.sellingPlan || null,
      };
    } else {
      const current = oneTimeTotals[count] ?? Number(variant?.price?.amount || 0);
      return {
        price: {amount: current.toFixed(2), currencyCode},
        compareAt: null,
        savingAmount: 0,
        savingPercent: 0,
        allocation,
        sellingPlan: allocation?.sellingPlan || null,
      };
    }
  }

  const oneTime = Number(variant?.price?.amount || 0);
  const subscriptionPrice = Number(adjustment?.price?.amount);
  const compareAtVariant = Number(variant?.compareAtPrice?.amount || 0);
  const compareAtAdjustment = Number(adjustment?.compareAtPrice?.amount || 0);

  const current =
    purchaseMode === 'subscribe' && Number.isFinite(subscriptionPrice)
      ? subscriptionPrice
      : oneTime;

  const strikeCandidates = [oneTime, compareAtVariant, compareAtAdjustment].filter(
    (value) => Number.isFinite(value) && value > current,
  );
  const strike = strikeCandidates.length
    ? Math.max(...strikeCandidates)
    : null;
  const savingAmount = strike ? strike - current : 0;
  const savingPercent = strike
    ? Math.round((savingAmount / strike) * 100)
    : 0;

  return {
    price: {amount: current.toFixed(2), currencyCode},
    compareAt: strike
      ? {amount: strike.toFixed(2), currencyCode}
      : null,
    savingAmount,
    savingPercent,
    allocation,
    sellingPlan: allocation?.sellingPlan || null,
  };
}

/** @param {any} plan */
export function formatFrequency(plan) {
  if (!plan) return '';
  const frequencyOption = (plan.options || []).find((option) =>
    /frequency|interval|delivery/i.test(option?.name || ''),
  );
  let raw = toTrimmedString(frequencyOption?.value);
  if (!raw) {
    const match = String(plan.name || '').match(/every\s+([^,]+)/i);
    raw = match ? match[1] : '';
  }
  return raw
    .replace(/^deliver\s+/i, '')
    .replace(/^every\s+/i, '')
    .trim();
}

/** @param {number} count @param {string} unit */
function pluralize(count, unit) {
  return `${count} ${unit}${count === 1 ? '' : 's'}`;
}

/** @param {any} plan */
export function humanizeInterval(plan) {
  const raw = formatFrequency(plan).toLowerCase();
  if (!raw) return 'month';

  const days = raw.match(/(\d+)\s*day/);
  if (days) {
    const count = Number(days[1]);
    if (count > 0 && count % 28 === 0) {
      return pluralize(count / 28, 'month');
    }
    if (count > 0 && count % 30 === 0) {
      return pluralize(count / 30, 'month');
    }
    if (count > 0 && count % 7 === 0) {
      return pluralize(count / 7, 'week');
    }
    return pluralize(count, 'day');
  }

  const months = raw.match(/(\d+)?\s*month/);
  if (months) return pluralize(Number(months[1] || 1), 'month');

  const weeks = raw.match(/(\d+)?\s*week/);
  if (weeks) return pluralize(Number(weeks[1] || 1), 'week');

  const years = raw.match(/(\d+)?\s*year/);
  if (years) return pluralize(Number(years[1] || 1), 'year');

  return raw;
}

/**
 * Today plus N business days (weekends skipped), computed in UTC so the loader
 * and the browser agree.
 * @param {number} leadDays
 * @param {Date} [from]
 */
export function getShipByDate(leadDays, from = new Date()) {
  const date = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );
  let added = 0;
  while (added < Math.max(0, leadDays)) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
}

/** @param {Date} date */
export function formatShipByDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** @param {any} product */
export function getPreferredPlanName(product) {
  if (DEFAULT_PLAN_NAME) return DEFAULT_PLAN_NAME;
  const groups = product?.sellingPlanGroups?.nodes || [];
  const firstPlan = groups[0]?.sellingPlans?.nodes?.[0];
  return firstPlan?.name || '';
}

/** @param {any} product */
export function hasSellingPlans(product) {
  const groups = product?.sellingPlanGroups?.nodes || [];
  return groups.some((group) => (group?.sellingPlans?.nodes || []).length > 0);
}

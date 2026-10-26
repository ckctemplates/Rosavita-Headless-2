/**
 * Editable product-page configuration.
 * Every value here is safe to change without touching component markup.
 */

export const PRODUCT_THEMES = {
  beetroot: {
    accent: '#C2188F',
    tint: '#F3E6EA',
  },
};

export const DEFAULT_THEME = {
  accent: '#2A5A4D',
  tint: '#E9EFEB',
};

// Badges are keyed by the zero-based variant position.
export const BUNDLE_BADGES = {
  1: 'MOST POPULAR',
  2: 'BEST DEAL',
};

export const DEFAULT_BUNDLE_INDEX = 1;
export const FREE_SHIPPING_FROM_INDEX = 1;

export const SHIP_LEAD_DAYS = 2;
export const SHIPS_BY_TEMPLATE = 'Ships by {date} from our Ohio warehouse';
export const DELIVERY_ESTIMATE_TEXT = 'Expected delivery in 3 to 6 business days';

export const RATING_SOURCE_LABEL = 'on Amazon';

export const PAYMENT_BADGES = [
  {
    key: 'american-express',
    label: 'American Express',
    short: 'AMEX',
    color: '#2E77BC',
    background: '#2E77BC',
    text: '#FFFFFF',
  },
  {
    key: 'apple-pay',
    label: 'Apple Pay',
    short: 'Apple Pay',
    color: '#111111',
    background: '#FFFFFF',
    text: '#111111',
  },
  {
    key: 'diners-club',
    label: 'Diners Club',
    short: 'DINERS',
    color: '#0079BE',
    background: '#0079BE',
    text: '#FFFFFF',
  },
  {
    key: 'discover',
    label: 'Discover',
    short: 'DISCOVER',
    color: '#E55C20',
    background: '#FFFFFF',
    text: '#1A1A1A',
  },
  {
    key: 'mastercard',
    label: 'Mastercard',
    short: 'MC',
    color: '#EB001B',
    background: '#FFFFFF',
    text: '#1A1A1A',
  },
  {
    key: 'maestro',
    label: 'Maestro',
    short: 'MAESTRO',
    color: '#00A1DF',
    background: '#FFFFFF',
    text: '#1A1A1A',
  },
  {
    key: 'shop-pay',
    label: 'Shop Pay',
    short: 'Shop Pay',
    color: '#5A31F4',
    background: '#5A31F4',
    text: '#FFFFFF',
  },
  {
    key: 'visa',
    label: 'Visa',
    short: 'VISA',
    color: '#1A1F71',
    background: '#FFFFFF',
    text: '#1A1F71',
  },
];

export const PAYMENT_BRAND_MAP = {
  AMERICAN_EXPRESS: 'american-express',
  APPLE_PAY: 'apple-pay',
  DINERS_CLUB: 'diners-club',
  DISCOVER: 'discover',
  MASTERCARD: 'mastercard',
  MAESTRO: 'maestro',
  SHOPIFY_PAY: 'shop-pay',
  SHOP_PAY: 'shop-pay',
  VISA: 'visa',
};

export const FINAL_CTA_BEHAVIOR = 'scroll'; // 'scroll' | 'add-to-cart'
export const FINAL_CTA_TEXT = 'BUY NOW & SAVE';
export const FINAL_CTA_GUARANTEE = '90-Day Money Back Guarantee';

export const AUTO_DELIVERS_TEMPLATE = 'Auto-delivers every {frequency}';
export const REFILL_TEMPLATE = '{price} - refill ships every {interval}';
export const DEFAULT_PLAN_NAME = '';
export const CANCEL_ANYTIME_TEXT = 'Cancel anytime';

export const SUBSCRIBE_LABEL = 'SUBSCRIBE & SAVE (AUTO-DELIVERY)';
export const ONE_TIME_LABEL = 'ONE-TIME PURCHASE';
export const BUY_ONCE_TEXT = 'BUY ONCE - NO SAVINGS \u2192';
export const SWITCH_BACK_TEXT = 'SWITCH BACK TO SUBSCRIBE & SAVE \u2192';
export const SUBSCRIPTION_RECOMMENDATION =
  'We recommend a subscription so that you can keep taking advantage of the huge savings!';

export const ADD_TO_CART_TEXT = 'Add To Cart';
export const ADDING_TEXT = 'Adding...';
export const SOLD_OUT_TEXT = 'Sold Out';

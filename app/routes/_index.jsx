import {Await, useLoaderData, useRouteLoaderData, Link} from 'react-router';
import {Suspense, useRef, useState} from 'react';
import {CartForm, Image, Money} from '@shopify/hydrogen';

/* ==========================================================================
   EDITABLE CONFIG + COPY
   ========================================================================== */

// Collection whose products fill the "Shop" grid. If it doesn't exist (or is
// empty) the first products of the store are used instead.
const SHOP_COLLECTION_HANDLE = 'frontpage';

const ANNOUNCEMENT_TEXT = 'Free US Shipping';

const BRAND_NAME = 'Rosavita';

const NAV_LINKS = [
  {label: 'Shop Rosavita', to: '/#shop'},
  {label: 'FAQ', to: '/#faq'},
];

const HERO_COPY = {
  rating: '1 Million + Happy Customers',
  title: 'ORGANIC BEETROOT AND MORINGA, MADE FOR EVERY DAY',
  text: 'Rosabella makes single-ingredient supplements from two time-tested plants: organic beetroot for circulation support and moringa for daily nutrition. Clearly labeled doses, third-party testing on every batch, and more than 4,000 verified customer reviews.',
  cta: 'SHOP OUR BEST SELLERS',
  ctaHref: '#shop',
  guarantee: '90-Day Satisfaction Guarantee',
  image:
    'https://tryrosabella.com/cdn/shop/files/img-banner.webp?v=1775670475',
  imageAlt:
    'Rosabella beetroot, moringa, electrolyte and gummies supplement bottles',
};

const SPLIT_FEATURES = [
  {
    id: 'beetroot',
    title: 'WHY PEOPLE START WITH THE BEETROOT',
    text: "Beetroot's natural dietary nitrates convert to nitric oxide in your body, supporting normal blood flow. Two capsules make one serving, and that serving is 1,300 mg of organic beetroot powder. You'll find the same number on the label.",
    image:
      'https://tryrosabella.com/cdn/shop/files/Beetroot_Bottle_Buy_1_5ae7b1b2-5c99-4c4a-b6b1-eb9b8022fd8f.webp?v=1791138840&width=1000',
    imageAlt: 'Rosabella Organic Beetroot capsules bottle',
    reversed: false,
  },
  {
    id: 'moringa',
    title: 'AND WHY THEY STAY FOR THE MORINGA',
    text: 'Moringa leaf packs vitamin A, iron, calcium, and plant protein into a single plant. Choose capsules, gummies, or pure powder, whichever fits your routine best.',
    image:
      'https://tryrosabella.com/cdn/shop/files/1789882871353_1._Main_Image_Moringa.webp?v=1791132732&width=1000',
    imageAlt: 'Rosabella Moringa capsules bottle',
    reversed: true,
  },
];

const TESTED_COPY = {
  title: 'TESTED, VERIFIED, AND GUARANTEED',
  text: 'Every batch is third-party tested, with a Certificate of Analysis available on request. Every order is covered by our 90-day money-back guarantee. And every bottle you buy donates a meal to a child in need through our Feeding America partnership.',
  primary: {label: 'SEE THE REVIEWS', to: '/pages/reviews'},
  secondary: {
    label: 'HOW OUR INGREDIENTS ARE TESTED',
    to: '/pages/how-rosavita-works',
  },
};

const TRUST_BADGES = [
  {
    label: 'Non-GMO',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-non-gmo.png?v=1791144888&width=180',
  },
  {
    label: 'Gluten Free',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-gluten-free.png?v=1791145675&width=180',
  },
  {
    label: 'No Additives',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-no-additives.png?v=1791145724&width=180',
  },
  {
    label: 'Freshly Harvested',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-freshly-harvested.png?v=1791145737&width=180',
  },
  {
    label: 'Pure & Potent',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-pure-and-potent.png?v=1791145776&width=180',
  },
  {
    label: 'Made In A USA FDA-Registered Facility',
    src: 'https://tryrosabella.com/cdn/shop/files/badge-made-in-usa-fda.png?v=1791145790&width=180',
  },
];

const SHOP_TITLE = 'SHOP ROSABELLA WELLNESS PRODUCTS';

// Fallbacks keyed by product "kind" (derived from handle/title, see getProductKind)
const PRODUCT_TAG_FALLBACKS = {
  moringa: ['30 DAY SUPPLY', '60 CAPSULES'],
  beetroot: ['30 DAY SUPPLY', '60 CAPSULES'],
  electrolyte: ['30 DAY SUPPLY', '30 SERVINGS'],
  gummies: ['30 DAY SUPPLY', '30 GUMMIES'],
};
const PRODUCT_SUBTITLE_FALLBACKS = {
  moringa: 'Ultimate Green Superfood',
  beetroot: "Nature's Circulation Support",
  electrolyte: 'Clean Everyday Hydration',
  gummies: 'Your Daily Green Superfood',
};
// Display order of the product grid
const PRODUCT_KIND_ORDER = ['moringa', 'beetroot', 'electrolyte', 'gummies'];

const TABS_TITLE = 'WHOLE-FOOD NUTRITION FROM ONE POWERFUL PLANT';

// cards order: [left 1, left 2, right 1, right 2]
const TAB_DATA = [
  {
    id: 'moringa',
    label: 'MORINGA',
    color: '#2A5A4D',
    image:
      'https://tryrosabella.com/cdn/shop/files/moringa_deskt.webp?v=1775672550',
    imageAlt: 'Rosabella Moringa 100% Pure capsules bottle',
    cta: {label: 'TRY ROSABELLA MORINGA', to: '/products/moringa-powder-capsules'},
    cards: [
      {
        icon: 'drop',
        title: 'Traditional Whole-Food Nutrition',
        text: "Moringa oleifera has been used for centuries as a nutrient-dense plant, naturally containing vitamins, minerals, and antioxidants. It's one of the most well-known whole-food supplements in traditional wellness practices.*",
      },
      {
        icon: 'arm',
        title: 'Quality You Can Trust',
        text: 'Made with 800mg of moringa leaf powder per serving with just one other ingredient — a vegetable cellulose capsule. Third-party tested for quality and manufactured in a GMP-certified facility.',
      },
      {
        icon: 'hands',
        title: 'Convenient Daily Format',
        text: 'Two capsules a day with food — simple, clean, and easy to add to your morning routine. No powders, no mixing, no taste.',
      },
      {
        icon: 'leaf',
        title: 'Clean, Minimal Formula',
        text: 'No artificial fillers, no synthetic additives — just moringa leaf powder in a vegetable capsule. Vegan, gluten-free, and non-GMO.',
      },
    ],
  },
  {
    id: 'beetroot',
    label: 'BEETROOT',
    color: '#E24FA8',
    image:
      'https://tryrosabella.com/cdn/shop/files/beet_deskt.png?v=1750870507',
    imageAlt: 'Rosabella Beetroot capsules bottle',
    cta: {label: 'TRY BEETROOT', to: '/products/organic-beetroot-capsules'},
    cards: [
      {
        icon: 'drop',
        title: 'Traditional Whole Food',
        text: 'Beetroot has been valued for centuries as a nutritious vegetable, naturally containing dietary nitrates and other plant compounds.',
      },
      {
        icon: 'arm',
        title: 'Quality You Can Trust',
        text: 'Made with 1300mg of beetroot powder per serving, third-party tested for quality and manufactured in certified facilities.',
      },
      {
        icon: 'hands',
        title: 'Convenient Daily Format',
        text: 'Easy-to-take capsules provide consistent beetroot nutrition without the mess of powders or time-consuming juicing preparation.',
      },
      {
        icon: 'head',
        title: 'Natural Plant Nutrition',
        text: 'Beetroot with no artificial colors or synthetic binders - just quality plant-based nutrition.',
      },
    ],
  },
  {
    id: 'electrolyte',
    label: 'ELECTROLYTE POWDER',
    color: '#C8505C',
    image:
      'https://tryrosabella.com/cdn/shop/files/Electrolight_1.webp?v=1775674601',
    imageAlt: 'Rosabella Fast Hydration watermelon electrolyte drink powder',
    cta: {
      label: 'TRY ELECTROLYTE POWDER',
      to: '/products/electrolyte-drink-powder',
    },
    cards: [
      {
        icon: 'drop',
        title: 'Everyday Hydration Support',
        text: 'Staying hydrated is about more than just water. Electrolytes play a key role in how your body absorbs and retains fluids throughout the day.*',
      },
      {
        icon: 'arm',
        title: 'Quality You Can Trust',
        text: 'Made with 8 key nutrients including Himalayan Pink Salt, Magnesium, Potassium, and Vitamin B12 — third-party tested for quality and manufactured in certified facilities.',
      },
      {
        icon: 'hands',
        title: 'Convenient Daily Format',
        text: 'One scoop mixes into water in seconds. Simple daily hydration support without the sugar or calories of traditional sports drinks.',
      },
      {
        icon: 'sun',
        title: 'Balanced Mineral Nutrition',
        text: "A thoughtful blend of essential electrolytes and vitamins including Vitamin C, Zinc, and Chromium — designed to support your body's daily hydration and energy needs.*",
      },
    ],
  },
  {
    id: 'gummies',
    label: 'MORINGA GUMMIES',
    color: '#2A5A4D',
    image:
      'https://tryrosabella.com/cdn/shop/files/Untitled_design_-_2026-02-20T122708.574.png?v=1771551037',
    imageAlt: 'Rosabella Moringa Gummies bottle',
    cta: {label: 'TRY ROSABELLA GUMMIES', to: '/products/moringa-gummies'},
    cards: [
      {
        icon: 'leaf',
        title: 'Support Natural Energy',
        text: "Packed with magnesium, B vitamins, and iron, Moringa Gummies provide daily nutritional support for your body's natural energy needs — helping you feel more alert and energised throughout the day.*",
      },
      {
        icon: 'meditate',
        title: 'Support Focus & Mental Clarity',
        text: 'Moringa is rich in antioxidants and nutrients that support cognitive function and a positive mood throughout the day.*',
      },
      {
        icon: 'target',
        title: 'Support Calm & Restful Sleep',
        text: "Moringa contains natural compounds that support your body's stress response - helping promote relaxation and healthy sleep patterns over time.*",
      },
      {
        icon: 'stomach',
        title: 'Support Overall Balance',
        text: 'Packed with essential nutrients in whole-food form, our gummies support emotional balance and overall resilience - helping you feel more grounded day to day.*',
      },
    ],
  },
];

const COMPARE_DATA = {
  title: 'WHY OVER 1,000,000 CUSTOMERS CHOOSE ROSABELLA',
  brandName: 'Rosabella',
  brandImage:
    'https://tryrosabella.com/cdn/shop/files/Rosabella_097466cd-20ee-4743-b231-957e1b004670.webp?v=1775665487',
  brandImageAlt: 'Rosabella supplement bottle',
  brandItems: [
    'Made with moringa, a nutrient-dense whole-food plant traditionally valued for its rich nutritional profile*',
    'Supports energy, calm, and overall wellness in one simple daily supplement*',
    'Clean, caffeine-free formula with B vitamins and iron to support natural energy*',
    'Minimal ingredients — moringa leaf powder in a vegetable capsule, nothing unnecessary',
    'Backed by 1,000,000+ customers and a 90-day satisfaction guarantee',
  ],
  otherTitle: 'OTHER SUPPLEMENTS',
  otherImage: 'https://tryrosabella.com/cdn/shop/files/others.png?v=1750870507',
  otherImageAlt: 'Generic supplement bottles',
  otherItems: [
    "May rely on proprietary blends that don't disclose individual ingredient amounts",
    'May require multiple products to cover the same nutritional ground',
    'Often contain caffeine, artificial fillers, or synthetic additives',
    'Often contain unnecessary fillers, binders, or synthetic additives in their capsules',
    'May not offer a satisfaction guarantee',
  ],
};

// Placeholder answers: edit freely.
const FAQ_ITEMS = [
  {
    q: 'What products does Rosabella offer?',
    a: 'Rosabella offers single-ingredient supplements including organic beetroot capsules, moringa capsules, moringa gummies, and electrolyte drink powder.',
  },
  {
    q: 'What ingredients are in Rosabella products?',
    a: 'Each product is made with a short, clearly labeled ingredient list. Please see the Supplement Facts panel on each product page for the full list of ingredients and amounts.',
  },
  {
    q: 'Where can I buy Rosabella?',
    a: 'Rosabella products are available directly on this website. Visit the shop section above to see our full range.',
  },
  {
    q: 'Is Rosabella safe to take with my current medications?',
    a: 'Please consult your healthcare provider before taking any supplement if you are on medication.',
  },
  {
    q: 'How should I store Rosabella products?',
    a: 'Store in a cool, dry place away from direct sunlight and keep the container tightly closed.',
  },
  {
    q: 'How often should I take Rosabella supplements?',
    a: 'Please follow the suggested use on the label of each product, and consult your healthcare provider if you have questions.',
  },
  {
    q: 'How many servings are in each container?',
    a: 'Serving counts vary by product. The number of servings per container is listed on each product page and on the label.',
  },
  {
    q: "What if I'm not satisfied?",
    a: 'Every order is covered by our 90-day money-back guarantee.',
  },
];

const FOOTER_LINKS = {
  support: {
    title: 'SUPPORT',
    links: [
      {label: 'Search', to: '/search'},
      {label: 'Contact Us', to: '/pages/contact'},
      {label: 'Privacy Policy', to: '/policies/privacy-policy'},
      {label: 'Terms of Service', to: '/policies/terms-of-service'},
      {label: 'Refund Policy', to: '/policies/refund-policy'},
      {label: 'Manage Subscription', to: '/pages/manage-subscription'},
      {
        label: 'Do Not Sell or Share My Personal Information',
        to: '/pages/do-not-sell-or-share-my-personal-information',
      },
      {label: 'Track Your Order', to: '/pages/track-your-order'},
    ],
  },
  explore: {
    title: 'EXPLORE ROSAVITA',
    links: [
      {label: 'Reviews', to: '/pages/reviews'},
      {label: 'Our Story', to: '/pages/our-story'},
      {label: 'How Rosavita Works', to: '/pages/how-rosavita-works'},
      {label: 'Beetroot Benefits', to: '/pages/beetroot-benefits'},
      {label: 'Moringa Benefits', to: '/pages/moringa-benefits'},
      {label: 'Beetroot', to: '/products/organic-beetroot-capsules'},
      {label: 'Moringa', to: '/products/moringa-powder-capsules'},
      {label: 'Where to Buy', to: '/pages/where-to-buy'},
      {label: 'The Rosavita Journal', to: '/blogs/news'},
    ],
  },
};

const SIGNUP_COPY =
  'Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.';

const SOCIAL_LINKS = [
  {label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram'},
  {label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook'},
  {label: 'TikTok', href: 'https://www.tiktok.com/', icon: 'tiktok'},
];

const COPYRIGHT = '© 2026, Rosavita';
const DISCLAIMER =
  '* These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Please always consult your health care provider if you are taking any medications or have any medical conditions. Individual results may vary.';

/* ==========================================================================
   STYLES
   ========================================================================== */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

.rv-page{
  --rv-sage:#E9EFEB;
  --rv-green:#2A5A4D;
  --rv-green-dark:#214a3f;
  --rv-text:#1A1A1A;
  --rv-muted:#6f7572;
  --rv-price:#C8602B;
  --rv-star:#E8A33D;
  --rv-line:#dbe3de;
  --rv-red:#D3302F;
  --rv-check:#2E9E55;
  font-family:'Montserrat',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  color:var(--rv-text);
  background:#fff;
  -webkit-font-smoothing:antialiased;
  line-height:1.5;
  overflow-x:hidden;
}
.rv-page *,.rv-page *::before,.rv-page *::after{box-sizing:border-box}
.rv-page img{max-width:100%;height:auto;display:block}
.rv-page a{color:inherit;text-decoration:none}
.rv-page h1,.rv-page h2,.rv-page h3,.rv-page p,.rv-page ul{margin:0}
.rv-page ul{padding:0;list-style:none}
.rv-page button{font-family:inherit}
.rv-page :focus-visible{outline:2px solid var(--rv-green);outline-offset:2px}

.rv-container{width:100%;max-width:1100px;margin:0 auto;padding:0 24px}
.rv-narrow{max-width:1000px}

.rv-h2{font-size:clamp(20px,2.1vw,28px);font-weight:700;text-transform:uppercase;letter-spacing:.04em;line-height:1.25}
.rv-body{font-size:15px;letter-spacing:.03em;line-height:1.7;font-weight:400}

/* Buttons */
.rv-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:14px 32px;border-radius:5px;border:1px solid var(--rv-green);background:var(--rv-green);color:#fff !important;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s,transform .2s;text-align:center}
.rv-btn:hover{background:var(--rv-green-dark);border-color:var(--rv-green-dark)}
.rv-btn svg{flex:none}
.rv-btn--outline{background:transparent;color:var(--rv-green) !important}
.rv-btn--outline:hover{background:var(--rv-green);color:#fff !important}
.rv-btn[disabled]{opacity:.55;cursor:not-allowed}

/* Announcement */
.rv-announce{background:#fff;text-align:center;font-size:10px;letter-spacing:.05em;padding:6px 12px;line-height:1.4}

/* Header */
.rv-header{background:#fff;border-bottom:1px solid var(--rv-line)}
.rv-header-inner{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:52px;padding:0 24px;max-width:1440px;margin:0 auto}
.rv-logo{font-weight:700;font-size:14px;letter-spacing:.02em}
.rv-nav{display:flex;gap:28px;font-size:12px;letter-spacing:.04em;color:#444}
.rv-nav a:hover{color:var(--rv-green)}
.rv-icons{display:flex;justify-content:flex-end;align-items:center;gap:14px}
.rv-icon-link{position:relative;display:inline-flex;width:20px;height:20px;align-items:center;justify-content:center;color:var(--rv-text)}
.rv-badge{position:absolute;top:-6px;right:-8px;min-width:15px;height:15px;padding:0 4px;border-radius:999px;background:var(--rv-green);color:#fff;font-size:9px;font-weight:700;line-height:15px;text-align:center}
.rv-only-mobile{display:none !important}

/* Hero */
.rv-hero{background:var(--rv-sage);padding:44px 0 56px}
.rv-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.rv-stars{display:flex;align-items:center;gap:8px;font-size:11px;color:#555;margin-bottom:18px}
.rv-stars-row{display:flex;gap:2px;color:var(--rv-star)}
.rv-hero h1{font-size:clamp(24px,2.5vw,34px);font-weight:700;line-height:1.25;letter-spacing:.03em;margin-bottom:18px}
.rv-hero-text{font-size:14px;margin-bottom:26px;max-width:480px}
.rv-guarantee{display:flex;align-items:center;gap:8px;margin-top:16px;font-size:12px;color:#444;letter-spacing:.03em}
.rv-hero-img{width:100%;max-width:520px;margin-left:auto}

/* Split features */
.rv-split{background:#fff;padding:64px 0 24px}
.rv-split + .rv-split{padding-top:24px}
.rv-split-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.rv-split-img{width:100%;max-width:420px;margin:0 auto}
.rv-split-copy{max-width:380px}
.rv-split-copy .rv-h2{margin-bottom:14px;font-size:clamp(18px,1.8vw,24px)}
.rv-split-copy .rv-body{font-size:14px}
.rv-split--rev .rv-split-copy{margin-left:auto;order:-1}
.rv-divider{border:0;border-top:1px solid var(--rv-line);margin:48px 0 0}

/* Tested box */
.rv-tested{background:#fff;padding:48px 0 32px}
.rv-tested-box{background:var(--rv-sage);border-radius:14px;padding:44px 40px;text-align:center}
.rv-tested-box h3{font-size:clamp(18px,1.8vw,24px);font-weight:700;letter-spacing:.04em;margin-bottom:16px;text-transform:uppercase}
.rv-tested-box p{font-size:14px;max-width:760px;margin:0 auto 28px}
.rv-tested-btns{display:flex;justify-content:center;gap:16px;flex-wrap:wrap}
.rv-tested-btns .rv-btn{min-width:240px}

/* Trust badges */
.rv-trust{background:#fff;padding:24px 0 64px}
.rv-trust-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:20px;align-items:start}
.rv-trust-item{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
.rv-trust-item img{width:64px;height:64px;object-fit:contain}
.rv-trust-item span{font-size:11px;line-height:1.35;color:#333;letter-spacing:.02em}

/* Shop */
.rv-shop{background:var(--rv-sage);padding:64px 0 40px}
.rv-shop .rv-h2{margin-bottom:26px}
.rv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.rv-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--rv-line);border-radius:10px;padding:12px}
.rv-card-img{display:block;border-radius:6px;overflow:hidden;margin-bottom:10px;background:#fff}
.rv-card-img img{width:100%;aspect-ratio:1/1;object-fit:contain}
.rv-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
.rv-tag{border:1px solid var(--rv-green);color:var(--rv-green);border-radius:3px;font-size:8px;font-weight:600;letter-spacing:.04em;padding:2px 5px;line-height:1.3;white-space:nowrap}
.rv-card-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;line-height:1.3;margin-bottom:3px}
.rv-card-sub{font-size:11px;color:var(--rv-muted);letter-spacing:.02em;margin-bottom:6px}
.rv-price{font-size:12px;font-weight:600;color:var(--rv-price);margin-bottom:10px}
.rv-card form{margin-top:auto}
.rv-card .rv-btn{width:100%;min-height:38px;padding:8px 10px;font-size:11px}

/* Tabs */
.rv-tabs{background:var(--rv-sage);padding:56px 0 64px}
.rv-tabs .rv-h2{text-align:center;max-width:720px;margin:0 auto 32px}
.rv-tablist{display:flex;gap:16px;margin-bottom:28px}
.rv-tab{flex:1 1 0;min-width:0;background:transparent;border:1.5px solid #b9c3be;border-radius:8px;padding:16px 10px;font-size:14px;letter-spacing:.06em;color:var(--rv-text);cursor:pointer;transition:border-color .2s,background .2s}
.rv-tab:hover{border-color:var(--rv-green)}
.rv-tab[aria-selected='true']{border-color:var(--rv-green);background:#f3f7f5}
.rv-panel-grid{display:grid;grid-template-columns:1fr 340px 1fr;gap:0 24px;align-items:start}
.rv-col{display:flex;flex-direction:column;gap:20px}
.rv-col--l{grid-column:1;grid-row:1}
.rv-stage{grid-column:2;grid-row:1}
.rv-col--r{grid-column:3;grid-row:1}
.rv-tcard{border:1px solid var(--rv-line);background:rgba(255,255,255,.25);border-radius:8px;padding:14px 16px 18px}
.rv-tcard-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rv-tcard-head h3{font-size:16px;font-weight:700;color:var(--rv-green);text-decoration:underline;text-underline-offset:3px;line-height:1.35}
.rv-tcard-icon{flex:none;width:34px;height:34px}
.rv-tcard p{font-size:14px;line-height:1.7;letter-spacing:.04em}
.rv-stage{position:relative;align-self:center;display:flex;justify-content:center;align-items:center;min-height:320px}
.rv-stage-img{width:100%;max-width:230px;position:relative;z-index:1}
.rv-arrow{position:absolute;width:112px;height:64px;color:var(--rv-arrow);z-index:2;pointer-events:none}
.rv-arrow--tl{left:-8px;top:18%}
.rv-arrow--bl{left:-8px;top:58%}
.rv-arrow--tr{right:-8px;top:24%;transform:scaleX(-1)}
.rv-arrow--br{right:-8px;top:60%;transform:scaleX(-1)}
.rv-tabs-cta{display:flex;justify-content:center;margin-top:56px}
.rv-tabs-cta .rv-btn{min-width:340px;min-height:62px;font-size:16px}

/* Compare */
.rv-compare{background:var(--rv-sage);padding:24px 0 80px}
.rv-compare .rv-h2{text-align:center;max-width:620px;margin:0 auto 32px}
.rv-compare-grid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:820px;margin:0 auto}
.rv-ccard{border-radius:14px;padding:18px 20px 22px;display:flex;flex-direction:column;align-items:center}
.rv-ccard--brand{background:#fff;border:3px solid var(--rv-green)}
.rv-ccard--other{background:rgba(255,255,255,.35);border:1px solid #cfd8d3}
.rv-ccard-head{display:flex;align-items:center;gap:6px;font-weight:700;font-size:15px;margin-bottom:8px;min-height:24px;text-align:center}
.rv-ccard--other .rv-ccard-head{font-size:13px;letter-spacing:.05em}
.rv-ccard img.rv-cimg{width:130px;height:130px;object-fit:contain;margin-bottom:12px}
.rv-clist{display:flex;flex-direction:column;gap:12px;width:100%}
.rv-clist li{display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.45;letter-spacing:.02em}
.rv-ccard--brand .rv-clist li{font-weight:700}
.rv-clist svg{flex:none;margin-top:1px}
.rv-vs{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;z-index:3;border:3px solid var(--rv-sage)}

/* FAQ */
.rv-faq{background:#fff;padding:72px 0 80px}
.rv-faq h2{text-align:center;font-size:clamp(26px,2.6vw,34px);font-weight:700;margin-bottom:28px}
.rv-faq-list{max-width:600px;margin:0 auto;border-top:1px solid var(--rv-line)}
.rv-faq-item{border-bottom:1px solid var(--rv-line)}
.rv-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 4px;background:none;border:0;cursor:pointer;text-align:left;font-size:13px;font-weight:500;letter-spacing:.03em;color:var(--rv-text)}
.rv-faq-q svg{flex:none;transition:transform .3s}
.rv-faq-item.is-open .rv-faq-q svg{transform:rotate(180deg)}
.rv-faq-panel{display:grid;grid-template-rows:0fr;visibility:hidden;transition:grid-template-rows .3s ease,visibility .3s}
.rv-faq-item.is-open .rv-faq-panel{grid-template-rows:1fr;visibility:visible}
.rv-faq-panel > div{overflow:hidden}
.rv-faq-panel p{padding:0 4px 18px;font-size:13px;line-height:1.7;color:#444;letter-spacing:.02em}

/* Footer */
.rv-footer{background:var(--rv-sage);padding:56px 0 40px}
.rv-footer-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px}
.rv-footer h3{font-size:12px;font-weight:700;letter-spacing:.14em;margin-bottom:20px;text-transform:uppercase}
.rv-footer li{margin-bottom:10px;font-size:12px;letter-spacing:.03em}
.rv-footer li a:hover{text-decoration:underline}
.rv-footer-sign p{font-size:12px;line-height:1.7;margin-bottom:18px;max-width:320px;letter-spacing:.03em}
.rv-sign-form{display:flex;align-items:center;border-bottom:1px solid var(--rv-text);max-width:320px;margin-bottom:20px}
.rv-sign-form input{flex:1;min-width:0;border:0;background:transparent;padding:10px 0;font-family:inherit;font-size:12px;color:var(--rv-text)}
.rv-sign-form input:focus-visible{outline:none}
.rv-sign-form:focus-within{border-bottom-color:var(--rv-green);box-shadow:0 1px 0 var(--rv-green)}
.rv-sign-form button{border:0;background:none;cursor:pointer;padding:4px;display:flex;color:var(--rv-text)}
.rv-social{display:flex;gap:14px}
.rv-social a{display:inline-flex;color:var(--rv-text)}
.rv-footer-bottom{margin-top:48px}
.rv-copy{font-size:11px;color:#555;margin-bottom:10px}
.rv-disclaimer{font-size:10px;line-height:1.6;color:#8a8f8c;max-width:900px}

/* Tablet */
@media (max-width:1023px){
  .rv-panel-grid{grid-template-columns:1fr 260px 1fr;gap:0 16px}
  .rv-arrow{width:84px;height:48px}
  .rv-grid{gap:12px}
  .rv-trust-grid{gap:12px}
  .rv-split-grid{gap:36px}
}

/* Mobile */
@media (max-width:767px){
  .rv-container{padding:0 20px}
  .rv-only-desktop{display:none !important}
  .rv-only-mobile{display:flex !important}
  .rv-header-inner{height:46px;padding:0 16px}
  .rv-icons{gap:12px}
  .rv-hero{padding:32px 0 40px}
  .rv-hero-grid{grid-template-columns:1fr}
  .rv-hero-img-wrap{display:none}
  .rv-hero h1{font-size:24px}
  .rv-hero .rv-btn{width:100%}
  .rv-split{padding:36px 0 8px}
  .rv-split-grid{grid-template-columns:1fr;gap:20px}
  .rv-split-img{max-width:280px}
  .rv-split-copy,.rv-split--rev .rv-split-copy{order:2;max-width:none;margin:0}
  .rv-split--rev .rv-split-img{order:1}
  .rv-divider{margin-top:28px}
  .rv-tested{padding:28px 0 24px}
  .rv-tested-box{padding:28px 20px}
  .rv-tested-btns{flex-direction:column;gap:12px}
  .rv-tested-btns .rv-btn{width:100%;min-width:0}
  .rv-trust{padding:16px 0 40px}
  .rv-trust-grid{grid-template-columns:repeat(3,1fr);row-gap:24px}
  .rv-shop{padding:40px 0 24px}
  .rv-grid{grid-template-columns:repeat(2,1fr)}
  .rv-tabs{padding:36px 0 48px}
  .rv-tablist{overflow-x:auto;gap:10px;padding-bottom:6px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .rv-tablist::-webkit-scrollbar{display:none}
  .rv-tab{flex:0 0 auto;min-width:140px;padding:12px 14px;font-size:12px}
  .rv-panel-grid{grid-template-columns:1fr;gap:16px}
  .rv-stage{grid-column:1;grid-row:1;min-height:0}
  .rv-col--l{grid-column:1;grid-row:2}
  .rv-col--r{grid-column:1;grid-row:3}
  .rv-stage-img{max-width:220px}
  .rv-arrow{display:none}
  .rv-col{gap:16px}
  .rv-tabs-cta{margin-top:28px}
  .rv-tabs-cta .rv-btn{min-width:0;width:100%;min-height:54px;font-size:14px}
  .rv-compare{padding:16px 0 56px}
  .rv-compare-grid{gap:12px}
  .rv-ccard{padding:10px 10px 14px;border-radius:10px}
  .rv-ccard--brand{border-width:2px}
  .rv-ccard img.rv-cimg{width:84px;height:84px}
  .rv-ccard-head{font-size:12px}
  .rv-ccard--other .rv-ccard-head{font-size:10px}
  .rv-clist{gap:8px}
  .rv-clist li{font-size:9px;gap:5px}
  .rv-clist svg{width:12px;height:12px}
  .rv-vs{width:42px;height:42px;font-size:15px;border-width:2px}
  .rv-faq{padding:48px 0 56px}
  .rv-footer-grid{grid-template-columns:1fr;gap:32px}
}

@media (prefers-reduced-motion:reduce){
  .rv-page *{transition:none !important;animation:none !important}
}
`;

/* ==========================================================================
   ROUTE EXPORTS
   ========================================================================== */

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Rosabella | Organic Beetroot & Moringa Supplements'},
    {
      name: 'description',
      content:
        'Single-ingredient organic beetroot and moringa supplements with clearly labeled doses, third-party testing on every batch, and a 90-day satisfaction guarantee.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Critical data needed to render above the fold. The homepage design is static
 * above the fold, so nothing needs to block here. Add queries to the
 * Promise.all below if you need them.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  await Promise.all([
    // Add critical queries here, so that they are loaded in parallel
  ]);

  return {};
}

/**
 * Data for content below the fold (the product grid). Deferred and never throws.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  const shopProducts = context.storefront
    .query(SHOP_PRODUCTS_QUERY, {
      variables: {handle: SHOP_COLLECTION_HANDLE},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    shopProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="rv-page">
      <style dangerouslySetInnerHTML={{__html: styles}} />
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <SplitFeature feature={SPLIT_FEATURES[0]} />
        <SplitFeature feature={SPLIT_FEATURES[1]} withDivider={false} />
        <TestedBox />
        <TrustBadges />
        <ProductGrid products={data.shopProducts} />
        <FeatureTabs />
        <CompareSection />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}

/* ==========================================================================
   ICONS (inline SVG)
   ========================================================================== */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}
function ChevronRight({size = 18}) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2l7 7-7 7" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="18" height="12" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 8h21M16 2l6 6-6 6" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6L12 2z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--rv-check)" />
      <path d="M7 12.5l3.2 3.2L17 8.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="var(--rv-red)" />
      <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rv-green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  );
}
function BrandMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rv-green)" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 11c.8-1 1.8-1 2.6 0M13.4 11c.8-1 1.8-1 2.6 0M8.5 15c2 1.6 5 1.6 7 0" />
    </svg>
  );
}
function SocialIcon({name}) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };
  if (name === 'instagram') {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'facebook') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v2.9c-1.4.1-2.6-.3-3.8-1.1v6.2c0 3.9-3.2 6.1-6.3 5.5-2.7-.5-4.5-3.1-4-5.8.5-2.8 3.1-4.4 5.7-3.9v3c-1.3-.4-2.8.3-2.9 1.8-.1 1.5 1.2 2.6 2.6 2.3 1-.2 1.6-1 1.6-2.1V3h3.2z" />
    </svg>
  );
}

/** Tab card line icons (reused across tabs by meaning) */
function TabIcon({name}) {
  const tan = '#C9A57A';
  const ink = '#1A1A1A';
  const common = {
    className: 'rv-tcard-icon',
    viewBox: '0 0 40 40',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'drop':
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="15" stroke={tan} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M20 10c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" stroke={ink} strokeWidth="1.8" />
        </svg>
      );
    case 'hands':
      return (
        <svg {...common}>
          <path d="M20 17s-5-3-5-7a3 3 0 015-1.5A3 3 0 0125 10c0 4-5 7-5 7z" stroke={tan} strokeWidth="1.5" />
          <path d="M5 21l5 3v11l-5-3V21zM35 21l-5 3v11l5-3V21z" stroke={ink} strokeWidth="1.8" />
          <path d="M10 26c4 0 6 1 9 4h5c2 0 3 1 3 2s-1 2-3 2h-6M30 26c-4 0-6 1-9 4" stroke={ink} strokeWidth="1.8" />
        </svg>
      );
    case 'arm':
      return (
        <svg {...common}>
          <path d="M8 4M14 5l2 4M19 3l-1 4M24 4l-2 4" stroke={tan} strokeWidth="1.6" />
          <path d="M6 24c3-6 8-12 14-12 3 0 4 2 3 4-1 2-3 3-3 3s6-1 10 2c3 3 1 9-3 12-5 3-14 1-19-3-2-2-3-4-2-6z" stroke={ink} strokeWidth="1.8" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M12 12c0-5 4-8 11-8-1 7-4 11-9 11l-2-3z" fill={ink} stroke={ink} strokeWidth="1.4" />
          <path d="M22 8c3 0 6 1 8 3-3 0-6-1-8-3z" fill={ink} stroke={ink} strokeWidth="1.2" />
          <circle cx="21" cy="25" r="11" stroke={ink} strokeWidth="1.8" />
          <path d="M22 19l-4 7h4l-2 6 5-8h-4l1-5z" fill={tan} stroke={tan} strokeWidth="1" />
        </svg>
      );
    case 'head':
      return (
        <svg {...common}>
          <path d="M20 3v4M10 7l2 3M30 7l-2 3M5 15h3M32 15h3" stroke={tan} strokeWidth="1.6" />
          <path d="M12 33V27c-3-2-5-5-5-9 0-6 5-10 12-10s11 4 11 9c0 2-1 3-1 4l2 3-3 1v3c0 2-1 3-3 3h-3v3" stroke={ink} strokeWidth="1.8" />
          <path d="M19 15c2-2 5-1 5 1.5s-3 3.5-5 6c-2-2.500-5-3.500-5-6s3-3.500 5-1.500z" stroke={tan} strokeWidth="1.5" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.500 3.500M29 29l3 3M8 32l3.500-3.500M29 11l3-3" stroke={tan} strokeWidth="1.6" />
          <circle cx="20" cy="20" r="9" stroke={ink} strokeWidth="1.8" />
          <path d="M21 13l-5 8h4l-1 6 6-9h-4l1-5z" fill={ink} stroke={ink} strokeWidth="1" />
        </svg>
      );
    case 'stomach':
      return (
        <svg {...common}>
          <path d="M16 4v8c0 3-5 4-8 7-3 4-1 12 6 14 7 2 14 0 17-5 2-4 0-9-5-10-4-1-6-3-6-6V4" stroke={ink} strokeWidth="1.8" />
          <path d="M22 4v6M13 4h9" stroke={ink} strokeWidth="1.8" />
          <circle cx="24" cy="24" r="4" stroke={tan} strokeWidth="1.5" />
        </svg>
      );
    case 'meditate':
      return (
        <svg {...common}>
          <circle cx="20" cy="9" r="4.500" fill={tan} stroke={ink} strokeWidth="1.6" />
          <path d="M20 14c-4 0-6 3-6 7l-6 8c-1 2 0 4 3 4h18c3 0 4-2 3-4l-6-8c0-4-2-7-6-7z" stroke={ink} strokeWidth="1.8" />
          <path d="M12 29c4-2 12-2 16 0" stroke={ink} strokeWidth="1.6" />
        </svg>
      );
    case 'target':
    default:
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="12" stroke={ink} strokeWidth="1.8" />
          <circle cx="20" cy="20" r="7" fill={tan} stroke={ink} strokeWidth="1.6" />
          <circle cx="20" cy="20" r="2.500" fill={ink} />
          <path d="M20 3v8M20 29v8M3 20h8M29 20h8" stroke={ink} strokeWidth="1.8" />
        </svg>
      );
  }
}

/** Hand-drawn curly arrows. Variant "loop" has a loop, "swoosh" is an S-curve. */
function CurlyArrow({variant, className}) {
  return (
    <svg className={`rv-arrow ${className}`} viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {variant === 'loop' ? (
        <>
          <path d="M3 14c24 26 52 34 70 22 12-8 8-26-5-26-12 0-14 18 4 26 12 5 26 3 36-1" />
          <path d="M101 27l12 8-13 7" />
        </>
      ) : (
        <>
          <path d="M3 60c26 2 44-8 40-28C40 16 50 6 68 8c16 2 30 8 42 14" />
          <path d="M97 12l13 10-14 5" />
        </>
      )}
    </svg>
  );
}

/* ==========================================================================
   ANNOUNCEMENT BAR
   ========================================================================== */

function AnnouncementBar() {
  return <div className="rv-announce">{ANNOUNCEMENT_TEXT}</div>;
}

/* ==========================================================================
   HEADER
   ========================================================================== */

/** Cart item count badge, read from the root loader's cart promise */
function CartCount() {
  const rootData = useRouteLoaderData('root');
  const cart = rootData?.cart;
  if (!cart) return null;
  return (
    <Suspense fallback={null}>
      <Await resolve={cart} errorElement={null}>
        {(resolved) =>
          resolved?.totalQuantity > 0 ? (
            <span className="rv-badge">{resolved.totalQuantity}</span>
          ) : null
        }
      </Await>
    </Suspense>
  );
}

function Header() {
  return (
    <header className="rv-header">
      <div className="rv-header-inner">
        {/* left */}
        <div>
          <Link to="/" className="rv-logo rv-only-desktop">
            {BRAND_NAME}
          </Link>
          <Link to="/search" className="rv-icon-link rv-only-mobile" aria-label="Search">
            <SearchIcon />
          </Link>
        </div>
        {/* center */}
        <div>
          <nav className="rv-nav rv-only-desktop" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Link to="/" className="rv-logo rv-only-mobile">
            {BRAND_NAME}
          </Link>
        </div>
        {/* right */}
        <div className="rv-icons">
          <Link to="/search" className="rv-icon-link rv-only-desktop" aria-label="Search">
            <SearchIcon />
          </Link>
          <Link to="/account" className="rv-icon-link" aria-label="Account">
            <UserIcon />
          </Link>
          <Link to="/cart" className="rv-icon-link" aria-label="Cart">
            <BagIcon />
            <CartCount />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   HERO
   ========================================================================== */

function Hero() {
  return (
    <section className="rv-hero" aria-labelledby="rv-hero-title">
      <div className="rv-container">
        <div className="rv-hero-grid">
          <div>
            <div className="rv-stars">
              <span className="rv-stars-row" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} />
                ))}
              </span>
              <span>{HERO_COPY.rating}</span>
            </div>
            <h1 id="rv-hero-title">{HERO_COPY.title}</h1>
            <p className="rv-body rv-hero-text">{HERO_COPY.text}</p>
            <a href={HERO_COPY.ctaHref} className="rv-btn">
              {HERO_COPY.cta}
              <ChevronRight size={12} />
            </a>
            <div className="rv-guarantee">
              <ShieldIcon />
              <span>{HERO_COPY.guarantee}</span>
            </div>
          </div>
          <div className="rv-hero-img-wrap">
            <img
              className="rv-hero-img"
              src={HERO_COPY.image}
              alt={HERO_COPY.imageAlt}
              width="1000"
              height="800"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SPLIT FEATURE (image + text)
   ========================================================================== */

function SplitFeature({feature, withDivider = true}) {
  return (
    <section
      className={`rv-split${feature.reversed ? ' rv-split--rev' : ''}`}
      aria-labelledby={`rv-split-${feature.id}`}
    >
      <div className="rv-container rv-narrow">
        <div className="rv-split-grid">
          <img
            className="rv-split-img"
            src={feature.image}
            alt={feature.imageAlt}
            width="1000"
            height="1000"
            loading="lazy"
          />
          <div className="rv-split-copy">
            <h2 className="rv-h2" id={`rv-split-${feature.id}`}>
              {feature.title}
            </h2>
            <p className="rv-body">{feature.text}</p>
          </div>
        </div>
        {withDivider ? <hr className="rv-divider" /> : null}
      </div>
    </section>
  );
}

/* ==========================================================================
   TESTED / VERIFIED / GUARANTEED BOX
   ========================================================================== */

function TestedBox() {
  return (
    <section className="rv-tested" aria-labelledby="rv-tested-title">
      <div className="rv-container rv-narrow">
        <div className="rv-tested-box">
          <h3 id="rv-tested-title">{TESTED_COPY.title}</h3>
          <p className="rv-body">{TESTED_COPY.text}</p>
          <div className="rv-tested-btns">
            <Link to={TESTED_COPY.primary.to} className="rv-btn">
              {TESTED_COPY.primary.label}
              <ChevronRight size={12} />
            </Link>
            <Link to={TESTED_COPY.secondary.to} className="rv-btn rv-btn--outline">
              {TESTED_COPY.secondary.label}
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   TRUST BADGES
   ========================================================================== */

function TrustBadges() {
  return (
    <section className="rv-trust" aria-label="Quality commitments">
      <div className="rv-container rv-narrow">
        <ul className="rv-trust-grid">
          {TRUST_BADGES.map((badge) => (
            <li key={badge.label} className="rv-trust-item">
              <img src={badge.src} alt="" width="64" height="64" loading="lazy" />
              <span>{badge.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==========================================================================
   PRODUCT GRID (dynamic Storefront API products)
   ========================================================================== */

/** Maps a product to one of the known "kinds" used for fallbacks and ordering */
function getProductKind(product) {
  const haystack = `${product?.handle || ''} ${product?.title || ''}`.toLowerCase();
  if (haystack.includes('gumm')) return 'gummies';
  if (haystack.includes('electrolyte')) return 'electrolyte';
  if (haystack.includes('beet')) return 'beetroot';
  if (haystack.includes('moringa')) return 'moringa';
  return null;
}

/** Picks products from the query result and orders them as in the design */
function pickProducts(response) {
  const fromCollection = response?.collection?.products?.nodes;
  const nodes =
    fromCollection && fromCollection.length
      ? fromCollection
      : response?.products?.nodes || [];
  const rank = (product) => {
    const kind = getProductKind(product);
    const index = PRODUCT_KIND_ORDER.indexOf(kind);
    return index === -1 ? 99 : index;
  };
  return nodes
    .map((product, position) => ({product, position}))
    .sort((a, b) => rank(a.product) - rank(b.product) || a.position - b.position)
    .slice(0, 4)
    .map(({product}) => product);
}

function ProductGrid({products}) {
  return (
    <section className="rv-shop" id="shop" aria-labelledby="rv-shop-title">
      <div className="rv-container rv-narrow">
        <h2 className="rv-h2" id="rv-shop-title">
          {SHOP_TITLE}
        </h2>
        <Suspense fallback={<div className="rv-grid" aria-busy="true" />}>
          <Await resolve={products}>
            {(response) => {
              const items = pickProducts(response);
              if (!items.length) return null;
              return (
                <div className="rv-grid">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function ProductCard({product}) {
  const kind = getProductKind(product);
  const variant = product.variants?.nodes?.[0];
  const tags = (kind && PRODUCT_TAG_FALLBACKS[kind]) || [];
  const subtitle =
    product.subtitle?.value || (kind && PRODUCT_SUBTITLE_FALLBACKS[kind]) || '';
  const url = `/products/${product.handle}`;
  const image = product.featuredImage;

  return (
    <article className="rv-card">
      <Link to={url} className="rv-card-img" prefetch="intent" aria-label={product.title}>
        {image ? (
          <Image
            data={image}
            alt={image.altText || product.title}
            aspectRatio="1/1"
            sizes="(min-width: 1024px) 240px, 45vw"
          />
        ) : null}
      </Link>
      {tags.length ? (
        <div className="rv-tags">
          {tags.map((tag) => (
            <span className="rv-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <h3 className="rv-card-title">
        <Link to={url} prefetch="intent">
          {product.title}
        </Link>
      </h3>
      {subtitle ? <p className="rv-card-sub">{subtitle}</p> : null}
      {variant?.price ? (
        <p className="rv-price">
          <Money data={variant.price} />
        </p>
      ) : null}
      {variant ? (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{lines: [{merchandiseId: variant.id, quantity: 1}]}}
        >
          {(fetcher) => (
            <button
              type="submit"
              className="rv-btn"
              disabled={!variant.availableForSale || fetcher.state !== 'idle'}
            >
              {variant.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
            </button>
          )}
        </CartForm>
      ) : null}
    </article>
  );
}

/* ==========================================================================
   FEATURE TABS
   ========================================================================== */

function FeatureTabs() {
  const [activeId, setActiveId] = useState(TAB_DATA[0].id);
  const tabRefs = useRef([]);
  const activeIndex = TAB_DATA.findIndex((tab) => tab.id === activeId);
  const active = TAB_DATA[activeIndex] || TAB_DATA[0];

  const focusTab = (index) => {
    const next = (index + TAB_DATA.length) % TAB_DATA.length;
    setActiveId(TAB_DATA[next].id);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(TAB_DATA.length - 1);
    }
  };

  const [left1, left2, right1, right2] = active.cards;

  return (
    <section className="rv-tabs" aria-labelledby="rv-tabs-title">
      <div className="rv-container rv-narrow">
        <h2 className="rv-h2" id="rv-tabs-title">
          {TABS_TITLE}
        </h2>

        <div className="rv-tablist" role="tablist" aria-label="Product benefits">
          {TAB_DATA.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`rv-tab-${tab.id}`}
              aria-selected={tab.id === active.id}
              aria-controls={`rv-panel-${tab.id}`}
              tabIndex={tab.id === active.id ? 0 : -1}
              className="rv-tab"
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`rv-panel-${active.id}`}
          aria-labelledby={`rv-tab-${active.id}`}
          tabIndex={0}
        >
          <div className="rv-panel-grid">
            <div className="rv-col rv-col--l">
              <TabCard card={left1} />
              <TabCard card={left2} />
            </div>

            <div className="rv-stage" style={{'--rv-arrow': active.color}}>
              <CurlyArrow variant="loop" className="rv-arrow--tl" />
              <CurlyArrow variant="swoosh" className="rv-arrow--bl" />
              <CurlyArrow variant="swoosh" className="rv-arrow--tr" />
              <CurlyArrow variant="loop" className="rv-arrow--br" />
              <img
                className="rv-stage-img"
                src={active.image}
                alt={active.imageAlt}
                width="460"
                height="460"
                loading="lazy"
              />
            </div>

            <div className="rv-col rv-col--r">
              <TabCard card={right1} />
              <TabCard card={right2} />
            </div>
          </div>

          <div className="rv-tabs-cta">
            <Link to={active.cta.to} className="rv-btn">
              {active.cta.label}
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabCard({card}) {
  return (
    <div className="rv-tcard">
      <div className="rv-tcard-head">
        <TabIcon name={card.icon} />
        <h3>{card.title}</h3>
      </div>
      <p>{card.text}</p>
    </div>
  );
}

/* ==========================================================================
   COMPARISON
   ========================================================================== */

function CompareSection() {
  return (
    <section className="rv-compare" aria-labelledby="rv-compare-title">
      <div className="rv-container rv-narrow">
        <h2 className="rv-h2" id="rv-compare-title">
          {COMPARE_DATA.title}
        </h2>
        <div className="rv-compare-grid">
          <div className="rv-ccard rv-ccard--brand">
            <div className="rv-ccard-head">
              <BrandMark />
              <span>{COMPARE_DATA.brandName}</span>
            </div>
            <img
              className="rv-cimg"
              src={COMPARE_DATA.brandImage}
              alt={COMPARE_DATA.brandImageAlt}
              width="260"
              height="260"
              loading="lazy"
            />
            <ul className="rv-clist">
              {COMPARE_DATA.brandItems.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rv-ccard rv-ccard--other">
            <div className="rv-ccard-head">{COMPARE_DATA.otherTitle}</div>
            <img
              className="rv-cimg"
              src={COMPARE_DATA.otherImage}
              alt={COMPARE_DATA.otherImageAlt}
              width="260"
              height="260"
              loading="lazy"
            />
            <ul className="rv-clist">
              {COMPARE_DATA.otherItems.map((item) => (
                <li key={item}>
                  <XIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rv-vs" aria-hidden="true">
            VS
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="rv-faq" id="faq" aria-labelledby="rv-faq-title">
      <div className="rv-container">
        <h2 id="rv-faq-title">FAQs</h2>
        <div className="rv-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className={`rv-faq-item${isOpen ? ' is-open' : ''}`}>
                <h3 style={{margin: 0}}>
                  <button
                    type="button"
                    className="rv-faq-q"
                    id={`rv-faq-btn-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`rv-faq-panel-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown />
                  </button>
                </h3>
                <div
                  className="rv-faq-panel"
                  id={`rv-faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`rv-faq-btn-${index}`}
                >
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

function FooterColumn({column}) {
  return (
    <div>
      <h3>{column.title}</h3>
      <ul>
        {column.links.map((link) => (
          <li key={link.label}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="rv-footer">
      <div className="rv-container">
        <div className="rv-footer-grid">
          <FooterColumn column={FOOTER_LINKS.support} />
          <FooterColumn column={FOOTER_LINKS.explore} />
          <div className="rv-footer-sign">
            <h3>SIGN UP AND SAVE</h3>
            <p>{SIGNUP_COPY}</p>
            {/* Placeholder form: connect to your email provider / Shopify customer endpoint */}
            <form
              className="rv-sign-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                aria-label="Email"
                required
              />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight />
              </button>
            </form>
            <div className="rv-social">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="rv-footer-bottom">
          <p className="rv-copy">{COPYRIGHT}</p>
          <p className="rv-disclaimer">{DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   GRAPHQL
   ========================================================================== */

const SHOP_PRODUCT_FRAGMENT = `#graphql
  fragment ShopProduct on Product {
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
    subtitle: metafield(namespace: "custom", key: "subtitle") {
      value
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

const SHOP_PRODUCTS_QUERY = `#graphql
  query ShopProducts($country: CountryCode, $language: LanguageCode, $handle: String!)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 12) {
        nodes {
          ...ShopProduct
        }
      }
    }
    products(first: 12, sortKey: CREATED_AT) {
      nodes {
        ...ShopProduct
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

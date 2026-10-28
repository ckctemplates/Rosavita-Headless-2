import {useId, useRef, useState} from 'react';
import {Link} from 'react-router';

const tabs = [
  {id: 'moringa', label: 'MORINGA'},
  {id: 'beetroot', label: 'BEETROOT'},
  {id: 'electrolyte', label: 'ELECTROLYTE POWDER'},
  {id: 'gummies', label: 'MORINGA GUMMIES'},
];

const TAB_HEADINGS = {
  moringa: 'WHOLE-FOOD NUTRITION FROM ONE POWERFUL PLANT',
  beetroot: 'WHOLE-FOOD SUPPORT FOR CIRCULATION, ENERGY & STAMINA',
  electrolyte: 'DAILY ELECTROLYTE SUPPORT FOR HYDRATION, ENERGY & BALANCE',
  gummies: 'WHOLE-FOOD SUPPORT FOR DAILY ENERGY, CALM & OVERALL WELLNESS',
};

const DEFAULT_LINKS = {
  moringa: '/products/rosavita-moringa-powder-capsules-np',
  beetroot: '/products/beetroot',
  electrolyte: '/products/rosavita-electrolyte-drink-powder-b1',
  gummies: '/products/rosavita-moringa-gummies-sub',
};

const tabData = {
  moringa: {
    image: '/images/tab-moringa.webp',
    imageAlt: 'Rosavita Moringa capsules',
    arrowColor: '#1f5c46',
    ctaText: 'Try Rosavita Moringa',
    cards: [
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg1.webp?v=1792945165',
        title: 'Traditional Whole-Food Nutrition',
        text: "Moringa oleifera has been used for centuries as a nutrient-dense plant, naturally containing vitamins, minerals, and antioxidants. It's one of the most well-known whole-food supplements in traditional wellness practices.*",
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg2.webp?v=1792945171',
        title: 'Quality You Can Trust',
        text: 'Made with 800mg of moringa leaf powder per serving with just one other ingredient — a vegetable cellulose capsule. Third-party tested for quality and manufactured in a GMP-certified facility.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg3.webp?v=1792945178',
        title: 'Convenient Daily Format',
        text: 'Two capsules a day with food — simple, clean, and easy to add to your morning routine. No powders, no mixing, no taste.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg4.webp?v=1792945184',
        title: 'Clean, Minimal Formula',
        text: 'No artificial fillers, no synthetic additives — just moringa leaf powder in a vegetable capsule. Vegan, gluten-free, and non-GMO.',
      },
    ],
  },
  beetroot: {
    image: '/images/tab-beetroot.png',
    imageAlt: 'Rosavita Beetroot capsules',
    arrowColor: '#1f5c46',
    ctaText: 'Try Beetroot',
    cards: [
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg5.png?v=1792945190',
        title: 'Traditional Whole Food',
        text: 'Beetroot has been valued for centuries as a nutritious vegetable, naturally containing dietary nitrates and other plant compounds.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg6.png?v=1792945197',
        title: 'Quality You Can Trust',
        text: 'Made with 1300mg of beetroot powder per serving, third-party tested for quality and manufactured in certified facilities.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg7.png?v=1792945204',
        title: 'Convenient Daily Format',
        text: 'Easy-to-take capsules provide consistent beetroot nutrition without the mess of powders or time-consuming juicing preparation.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg8.avif?v=1792945210',
        title: 'Natural Plant Nutrition',
        text: 'Beetroot with no artificial colors or synthetic binders - just quality plant-based nutrition.',
      },
    ],
  },
  electrolyte: {
    image: '/images/tab-electrolyte.webp',
    imageAlt: 'Rosavita Electrolyte drink powder',
    arrowColor: '#1f5c46',
    ctaText: 'Try ELECTROLYTE POWDER',
    cards: [
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg9.webp?v=1792945216',
        title: 'Everyday Hydration Support',
        text: 'Staying hydrated is about more than just water. Electrolytes play a key role in how your body absorbs and retains fluids throughout the day.*',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg10.webp?v=1792945222',
        title: 'Quality You Can Trust',
        text: 'Made with 8 key nutrients including Himalayan Pink Salt, Magnesium, Potassium, and Vitamin B12 — third-party tested for quality and manufactured in certified facilities.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg11.webp?v=1792945230',
        title: 'Convenient Daily Format',
        text: 'One scoop mixes into water in seconds. Simple daily hydration support without the sugar or calories of traditional sports drinks.',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg12.png?v=1792945237',
        title: 'Balanced Mineral Nutrition',
        text: "A thoughtful blend of essential electrolytes and vitamins including Vitamin C, Zinc, and Chromium — designed to support your body's daily hydration and energy needs.*",
      },
    ],
  },
  gummies: {
    image: '/images/tab-gummies.png',
    imageAlt: 'Rosavita Moringa Gummies',
    arrowColor: '#1f5c46',
    ctaText: 'Try Rosavita Gummies',
    cards: [
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg13.png?v=1792945242',
        title: 'Support Natural Energy',
        text: "Packed with magnesium, B vitamins, and iron, Moringa Gummies provide daily nutritional support for your body's natural energy needs — helping you feel more alert and energised throughout the day.*",
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg14.png?v=1792945248',
        title: 'Support Focus & Mental Clarity',
        text: 'Moringa is rich in antioxidants and nutrients that support cognitive function and a positive mood throughout the day.*',
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg15.jxl?v=1792945517',
        title: 'Support Calm & Restful Sleep',
        text: "Moringa contains natural compounds that support your body's stress response - helping promote relaxation and healthy sleep patterns over time.*",
      },
      {
        icon: 'image',
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg16.jxl?v=1792945522',
        title: 'Support Overall Balance',
        text: 'Packed with essential nutrients in whole-food form, our gummies support emotional balance and overall resilience - helping you feel more grounded day to day.*',
      },
    ],
  },
};

function Icon({type, src}) {
  if (type === 'image' && src) {
    return (
      <span className="rv-tab-card__icon" aria-hidden="true">
        <img src={src} alt="" width="35" height="35" loading="lazy" />
      </span>
    );
  }

  const paths = {
    leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 16 14" />
      </>
    ),
    sparkle: (
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    ),
    drop: (
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    ),
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    brain: (
      <>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </>
    ),
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    balance: <path d="M6 20h12M12 4v16M3 6h18" />,
  };

  return (
    <span className="rv-tab-card__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[type] || paths.leaf}
      </svg>
    </span>
  );
}

function Arrow({variant, color}) {
  const reactId = useId();
  const markerId = `rv-arrowhead-${reactId.replace(/:/g, '')}`;

  return (
    <span
      className={`rv-arrow rv-arrow--${variant}`}
      style={{'--rv-arrow-color': color}}
      aria-hidden="true"
    >
      <svg
        className="rv-arrow__svg"
        viewBox="0 0 90 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <path d="M0 0L7 3.5L0 7Z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d="M6 54C20 50 30 40 26 28C23 18 9 16 6 26C3 36 18 40 32 34C48 27 56 12 72 12C79 12 84 17 84 25"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
        />
      </svg>
    </span>
  );
}

function TabCard({card}) {
  return (
    <div className="rv-tab-card">
      <div className="rv-tab-card__head">
        <Icon type={card.icon} src={card.iconSrc} />
        <h3 className="rv-tab-card__title">{card.title}</h3>
      </div>
      <p className="rv-tab-card__body">{card.text}</p>
    </div>
  );
}

export function FeatureTabs({productLinks = {}}) {
export function FeatureTabs({productLinks = {}}) {
  const [activeTab, setActiveTab] = useState('moringa');
  const tabRefs = useRef([]);
  const heading = TAB_HEADINGS[activeTab] || TAB_HEADINGS.moringa;

  const onTabKeyDown = (event, currentIndex) => {
    let nextIndex = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveTab(tabs[currentIndex].id);
        tabRefs.current[currentIndex]?.focus();
      }
      return;
    }

    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
    // Scroll active tab into view on mobile
    const container = tabRefs.current[nextIndex]?.parentElement;
    if (container) {
      tabRefs.current[nextIndex]?.scrollIntoView?.({
        behavior: 'auto',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <section className="rv-tabs">
      <div className="rv-container">
        <h2 className="rv-tabs__title">{heading}</h2>

        <div className="rv-tabs__nav-wrap">
          <div
            className="rv-tabs__nav"
            role="tablist"
            aria-label="Rosavita products"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`rv-tab-${tab.id}`}
                className="rv-tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`rv-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => {
                  setActiveTab(tab.id);
                  tabRefs.current[index]?.scrollIntoView?.({
                    behavior: 'auto',
                    inline: 'center',
                    block: 'nearest',
                  });
                }}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const data = tabData[tab.id];
          const ctaLink = productLinks[tab.id] || DEFAULT_LINKS[tab.id];

          return (
            <div
              key={tab.id}
              className="rv-tabs__panel"
              id={`rv-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`rv-tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              hidden={!isActive}
            >
              <div className="rv-tabs__row">
                <div className="rv-tabs__col">
                  {data.cards.slice(0, 2).map((card) => (
                    <TabCard card={card} key={`${tab.id}-${card.title}`} />
                  ))}
                </div>

                <div className="rv-tabs__center">
                  <Arrow variant="tl" color={data.arrowColor} />
                  <Arrow variant="bl" color={data.arrowColor} />
                  <Arrow variant="tr" color={data.arrowColor} />
                  <Arrow variant="br" color={data.arrowColor} />
                  <img
                    className={`rv-tabs__image${
                      tab.id === 'electrolyte' ? ' rv-tabs__image--boxed' : ''
                    }`}
                    src={data.image}
                    alt={data.imageAlt}
                    width="1183"
                    height="740"
                    loading="lazy"
                  />
                </div>

                <div className="rv-tabs__col">
                  {data.cards.slice(2, 4).map((card) => (
                    <TabCard card={card} key={`${tab.id}-${card.title}`} />
                  ))}
                </div>
              </div>

              <div className="rv-tabs__cta">
                <Link to={ctaLink} className="rv-btn rv-btn--large" prefetch="intent">
                  {data.ctaText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

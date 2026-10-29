import {useRef, useState} from 'react';
import {Link} from 'react-router';

const TABS = [
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

const TAB_DATA = {
  moringa: {
    image:
      'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/line11_ac9ef3f3-6b4d-4d6f-817e-145c68790435.jpg?v=1792935996',
    imageAlt: 'Rosavita Moringa Pure capsules bottle with benefit arrows',
    ctaText: 'TRY ROSAVITA MORINGA',
    cards: [
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg1.webp?v=1792945165',
        title: 'Traditional Whole-Food Nutrition',
        text: "Moringa oleifera has been used for centuries as a nutrient-dense plant, naturally containing vitamins, minerals, and antioxidants. It's one of the most well-known whole-food supplements in traditional wellness practices.*",
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg2.webp?v=1792945171',
        title: 'Quality You Can Trust',
        text: 'Made with 800mg of moringa leaf powder per serving with just one other ingredient — a vegetable cellulose capsule. Third-party tested for quality and manufactured in a GMP-certified facility.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg3.webp?v=1792945178',
        title: 'Convenient Daily Format',
        text: 'Two capsules a day with food — simple, clean, and easy to add to your morning routine. No powders, no mixing, no taste.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg4.webp?v=1792945184',
        title: 'Clean, Minimal Formula',
        text: 'No artificial fillers, no synthetic additives — just moringa leaf powder in a vegetable capsule. Vegan, gluten-free, and non-GMO.',
      },
    ],
  },
  beetroot: {
    image:
      'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/line22.jpg?v=1792936453',
    imageAlt: 'Rosavita Beetroot capsules bottle with benefit arrows',
    ctaText: 'TRY BEETROOT',
    cards: [
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg5.png?v=1792945190',
        title: 'Traditional Whole Food',
        text: 'Beetroot has been valued for centuries as a nutritious vegetable, naturally containing dietary nitrates and other plant compounds.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg6.png?v=1792945197',
        title: 'Quality You Can Trust',
        text: 'Made with 1300mg of beetroot powder per serving, third-party tested for quality and manufactured in certified facilities.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg7.png?v=1792945204',
        title: 'Convenient Daily Format',
        text: 'Easy-to-take capsules provide consistent beetroot nutrition without the mess of powders or time-consuming juicing preparation.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg8.avif?v=1792945210',
        title: 'Natural Plant Nutrition',
        text: 'Beetroot with no artificial colors or synthetic binders - just quality plant-based nutrition.',
      },
    ],
  },
  electrolyte: {
    image:
      'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/line33.jpg?v=1792936929',
    imageAlt: 'Rosavita Electrolyte Powder bottle with benefit arrows',
    ctaText: 'TRY ELECTROLYTE POWDER',
    cards: [
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg9.webp?v=1792945216',
        title: 'Everyday Hydration Support',
        text: 'Staying hydrated is about more than just water. Electrolytes play a key role in how your body absorbs and retains fluids throughout the day.*',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg10.webp?v=1792945222',
        title: 'Quality You Can Trust',
        text: 'Made with 8 key nutrients including Himalayan Pink Salt, Magnesium, Potassium, and Vitamin B12 — third-party tested for quality and manufactured in certified facilities.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg11.webp?v=1792945230',
        title: 'Convenient Daily Format',
        text: 'One scoop mixes into water in seconds. Simple daily hydration support without the sugar or calories of traditional sports drinks.',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg12.png?v=1792945237',
        title: 'Balanced Mineral Nutrition',
        text: "A thoughtful blend of essential electrolytes and vitamins including Vitamin C, Zinc, and Chromium — designed to support your body's daily hydration and energy needs.*",
      },
    ],
  },
  gummies: {
    image:
      'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/line44.jpg?v=1792936964',
    imageAlt: 'Rosavita Moringa Gummies bottle with benefit arrows',
    ctaText: 'TRY ROSAVITA GUMMIES',
    cards: [
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg13.png?v=1792945242',
        title: 'Support Natural Energy',
        text: "Packed with magnesium, B vitamins, and iron, Moringa Gummies provide daily nutritional support for your body's natural energy needs — helping you feel more alert and energised throughout the day.*",
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg14.png?v=1792945248',
        title: 'Support Focus & Mental Clarity',
        text: 'Moringa is rich in antioxidants and nutrients that support cognitive function and a positive mood throughout the day.*',
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg15.jxl?v=1792945517',
        title: 'Support Calm & Restful Sleep',
        text: "Moringa contains natural compounds that support your body's stress response - helping promote relaxation and healthy sleep patterns over time.*",
      },
      {
        iconSrc:
          'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/lg16.jxl?v=1792945522',
        title: 'Support Overall Balance',
        text: 'Packed with essential nutrients in whole-food form, our gummies support emotional balance and overall resilience - helping you feel more grounded day to day.*',
      },
    ],
  },
};

function TabCard({card}) {
  return (
    <div className="rv-tab-card">
      <div className="rv-tab-card__head">
        {card.iconSrc ? (
          <span className="rv-tab-card__icon" aria-hidden="true">
            <img src={card.iconSrc} alt="" width="35" height="35" loading="lazy" />
          </span>
        ) : null}
        <h3 className="rv-tab-card__title">{card.title}</h3>
      </div>
      <p className="rv-tab-card__body">{card.text}</p>
    </div>
  );
}

export function FeatureTabs({productLinks = {}}) {
  const [activeTab, setActiveTab] = useState('moringa');
  const tabRefs = useRef([]);
  const heading = TAB_HEADINGS[activeTab] || TAB_HEADINGS.moringa;

  const onTabKeyDown = (event, currentIndex) => {
    let nextIndex = null;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex === null) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveTab(TABS[currentIndex].id);
        tabRefs.current[currentIndex]?.focus();
      }
      return;
    }

    event.preventDefault();
    setActiveTab(TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
    tabRefs.current[nextIndex]?.scrollIntoView?.({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    });
  };

  const handleTabClick = (tabId, index) => {
    setActiveTab(tabId);
    tabRefs.current[index]?.scrollIntoView?.({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <section className="rv-tabs">
      <div className="rv-container">
        <h2 className="rv-tabs__title">{heading}</h2>

        <div className="rv-tabs__nav-wrap">
          <div className="rv-tabs__nav" role="tablist" aria-label="Rosavita products">
            {TABS.map((tab, index) => (
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
                onClick={() => handleTabClick(tab.id, index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const data = TAB_DATA[tab.id];
          const ctaLink = productLinks?.[tab.id] || DEFAULT_LINKS[tab.id];

          return (
            <div
              key={tab.id}
              className="rv-tabpanel"
              id={`rv-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`rv-tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              hidden={!isActive}
            >
              <div className="rv-tabs__row">
                <div className="rv-tabs__col">
                  {(data.cards || []).slice(0, 2).map((card, idx) => (
                    <TabCard card={card} key={`${tab.id}-left-${idx}`} />
                  ))}
                </div>

                <div className="rv-tabs__center">
                  <img
                    className="rv-tabs__image rv-tabs__image--center"
                    src={data.image}
                    alt={data.imageAlt}
                    width="1183"
                    height="740"
                    loading="lazy"
                  />
                </div>

                <div className="rv-tabs__col">
                  {(data.cards || []).slice(2, 4).map((card, idx) => (
                    <TabCard card={card} key={`${tab.id}-right-${idx}`} />
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

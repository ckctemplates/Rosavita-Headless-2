function CheckIcon() {
  return (
    <svg
      className="rv-compare__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2c5c4c"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="rv-compare__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d9342b"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const rosavitaPoints = [
  'Made with moringa, a nutrient-dense whole-food plant traditionally valued for its rich nutritional profile*',
  'Supports energy, calm, and overall wellness in one simple daily supplement*',
  'Clean, caffeine-free formula with B vitamins and iron to support natural energy*',
  'Minimal ingredients — moringa leaf powder in a vegetable capsule, nothing unnecessary',
  'Backed by 1,000,000+ customers and a 90-day satisfaction guarantee',
];

const otherPoints = [
  "May rely on proprietary blends that don't disclose individual ingredient amounts",
  'May require multiple products to cover the same nutritional ground',
  'Often contain caffeine, artificial fillers, or synthetic additives',
  'Often contain unnecessary fillers, binders, or synthetic additives in their capsules',
  'May not offer a satisfaction guarantee',
];

export function CompareSection() {
  return (
    <section className="rv-compare">
      <div className="rv-container rv-container--narrow">
        <h2 className="rv-compare__title">
          WHY OVER 1,000,000 CUSTOMERS CHOOSE ROSAVITA
        </h2>

        <div className="rv-compare__wrapper">
          <div className="rv-compare__card rv-compare__card--rosabella">
            <div className="rv-compare__inner">
              <img
                className="rv-compare__logo"
                src="https://cdn.shopify.com/s/files/1/0757/8822/2631/files/part2.jpg?v=1792937753"
                alt="Rosavita"
                width="428"
                height="456"
                loading="lazy"
              />
              <ul className="rv-compare__list">
                {rosavitaPoints.map((point) => (
                  <li className="rv-compare__item" key={point}>
                    <CheckIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rv-compare__vs" aria-hidden="true">
            VS
          </div>

          <div className="rv-compare__card">
            <div className="rv-compare__inner">
              <img
                className="rv-compare__logo"
                src="https://cdn.shopify.com/s/files/1/0757/8822/2631/files/suplements.webp?v=1792946008"
                alt=""
                width="360"
                height="456"
                loading="lazy"
              />
              <ul className="rv-compare__list">
                {otherPoints.map((point) => (
                  <li className="rv-compare__item" key={point}>
                    <XIcon />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

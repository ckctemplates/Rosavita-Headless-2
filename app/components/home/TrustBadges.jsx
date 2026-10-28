const badges = [
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo1.avif?v=1792944504',
    label: 'Non-GMO',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo2.avif?v=1792944514',
    label: 'Gluten Free',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo3.avif?v=1792944523',
    label: 'No Additives',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo4.avif?v=1792944532',
    label: 'Freshly Harvested',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo5.avif?v=1792944542',
    label: 'Pure & Potent',
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0757/8822/2631/files/logo6.avif?v=1792944549',
    label: 'Made In A USA FDA-Registered Facility',
  },
];

export function TrustBadges() {
  return (
    <section className="rv-badges" aria-label="Product certifications">
      <div className="rv-container">
        <div className="rv-badges__grid">
          {badges.map((badge) => (
            <div className="rv-badge" key={badge.src}>
              <img
                src={badge.src}
                alt=""
                width="180"
                height="180"
                loading="lazy"
              />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

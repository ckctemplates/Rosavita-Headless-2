const badges = [
  {src: '/images/badge-non-gmo.png', label: 'Non-GMO'},
  {src: '/images/badge-gluten-free.png', label: 'Gluten Free'},
  {src: '/images/badge-no-additives.png', label: 'No Additives'},
  {src: '/images/badge-freshly-harvested.png', label: 'Freshly Harvested'},
  {src: '/images/badge-pure-potent.png', label: 'Pure & Potent'},
  {
    src: '/images/badge-made-in-usa.png',
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

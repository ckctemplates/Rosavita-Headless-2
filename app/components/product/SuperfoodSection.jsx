/**
 * White "Built Around One Superfood" section.
 * @param {{section: any}} props
 */
export function SuperfoodSection({section}) {
  if (!section) return null;

  const hasImage = Boolean(section.imageUrl);

  return (
    <section className="rv-pdp-superfood">
      <div className="rv-pdp-container">
        <div
          className={`rv-pdp-superfood__grid ${
            hasImage ? '' : 'is-text-only'
          }`.trim()}
        >
          <div className="rv-pdp-superfood__text">
            {section.heading ? <h2>{section.heading}</h2> : null}

            {(section.paragraphs || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {section.highlight ? (
              <p className="rv-pdp-superfood__highlight">
                <span
                  className="rv-pdp-superfood__dot"
                  aria-hidden="true"
                />
                <strong>{section.highlight}</strong>
              </p>
            ) : null}

            {section.afterHighlight ? (
              <p>{section.afterHighlight}</p>
            ) : null}

            {section.listHeading ? (
              <p className="rv-pdp-superfood__list-heading">
                {section.listHeading}
              </p>
            ) : null}

            {(section.features || []).map((feature) => (
              <p
                className="rv-pdp-superfood__feature"
                key={feature.title || feature.text}
              >
                {feature.title ? <strong>{feature.title}</strong> : null}
                {feature.title && feature.text ? ' ' : null}
                {feature.text || ''}
              </p>
            ))}
          </div>

          {hasImage ? (
            <figure className="rv-pdp-superfood__card">
              <img
                alt={section.imageAlt || 'Rosavita product benefits'}
                decoding="async"
                height={460}
                loading="lazy"
                src={section.imageUrl}
                width={460}
              />
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

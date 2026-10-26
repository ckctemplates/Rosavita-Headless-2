// Keep photography cropped to its frame, but never crop text-heavy artwork.
// Story images with unknown natural dimensions fall back to `contain` below.
export const STORY_IMAGE_FIT = 'cover';

/**
 * Full-width tinted story band with alternating text/image rows.
 * @param {{sections: Array<any>}} props
 */
export function ProductStoryBand({sections = []}) {
  if (!sections.length) return null;

  return (
    <section className="rv-pdp-story-band">
      <div className="rv-pdp-container">
        {sections.map((section, index) => {
          const hasImage = Boolean(section.imageUrl);
          const isPortrait = index % 2 === 1;
          const hasNaturalRatio = Boolean(
            section.imageWidth && section.imageHeight,
          );
          const imageFit =
            section.imageFit ||
            (hasNaturalRatio ? STORY_IMAGE_FIT : 'contain');
          return (
            <article
              className={`rv-pdp-story ${index % 2 === 1 ? 'is-reversed' : ''} ${
                hasImage ? '' : 'is-text-only'
              }`.trim()}
              key={section.heading || section.imageUrl || 'story'}
            >
              <div className="rv-pdp-story__text">
                {section.heading ? <h2>{section.heading}</h2> : null}
                {(section.paragraphs || []).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="rv-pdp-story__bullets">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>
                        <span
                          className="rv-pdp-story__bullet-dot"
                          aria-hidden="true"
                        />
                        <strong>{bullet}</strong>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {hasImage ? (
                <div
                  className={`rv-pdp-story__media ${
                    isPortrait
                      ? 'rv-pdp-story__media--portrait'
                      : 'rv-pdp-story__media--square'
                  }`}
                  style={
                    hasNaturalRatio
                      ? {
                          aspectRatio: `${section.imageWidth} / ${section.imageHeight}`,
                        }
                      : undefined
                  }
                >
                  <img
                    alt={section.imageAlt || `${section.heading} image`}
                    decoding="async"
                    height={section.imageHeight || (isPortrait ? 548 : 470)}
                    loading="lazy"
                    src={section.imageUrl}
                    style={{objectFit: imageFit}}
                    width={section.imageWidth || 470}
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SplitFeature({
  title,
  description,
  image,
  imageAlt,
  reversed = false,
  imageWidth = 1000,
  imageHeight = 1000,
}) {
  return (
    <section className={`rv-split${reversed ? ' rv-split--reverse' : ''}`}>
      <div className="rv-container">
        <div className="rv-split__row">
          <div className="rv-split__media">
            <img
              src={image}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              loading="lazy"
            />
          </div>
          <div className="rv-split__content">
            <h2>{title}</h2>
            <p className="rv-copy">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

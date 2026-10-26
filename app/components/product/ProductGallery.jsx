import {Image} from '@shopify/hydrogen';
import {useRef, useState} from 'react';
import {
  ChevronLeftIcon,
  ChevronRightLargeIcon,
} from '~/components/product/ProductIcons';

/**
 * @param {{
 *   images: Array<any>;
 *   title: string;
 * }}
 */
export function ProductGallery({images = [], title}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const safeImages = images.filter(Boolean);
  const activeImage = safeImages[activeIndex] || null;
  const count = safeImages.length;
  const hasMultiple = count > 1;

  const show = (index) => {
    if (!count) return;
    setActiveIndex(((index % count) + count) % count);
  };

  const handleKeyDown = (event) => {
    if (!hasMultiple) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(activeIndex + 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches?.[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (!hasMultiple || touchStartX.current == null) return;
    const endX = event.changedTouches?.[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    show(activeIndex + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      aria-label="Product images"
      aria-roledescription="carousel"
      className="rv-pdp-gallery"
      role="group"
    >
      <div
        className="rv-pdp-gallery__frame"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        {activeImage ? (
          <Image
            alt={
              activeImage.altText ||
              `${title} image ${activeIndex + 1} of ${count}`
            }
            aspectRatio="1/1"
            className="rv-pdp-gallery__main"
            data={activeImage}
            key={activeImage.id || activeImage.url || activeIndex}
            loading={activeIndex === 0 ? 'eager' : 'lazy'}
            sizes="(min-width: 1024px) 500px, (min-width: 768px) 48vw, 100vw"
          />
        ) : (
          <div className="rv-pdp-gallery__placeholder" aria-hidden="true">
            <span>Rosavita</span>
          </div>
        )}

        {hasMultiple ? (
          <>
            <button
              aria-label="Previous image"
              className="rv-pdp-gallery__arrow rv-pdp-gallery__arrow--prev"
              onClick={() => show(activeIndex - 1)}
              onKeyDown={handleKeyDown}
              type="button"
            >
              <ChevronLeftIcon />
            </button>
            <button
              aria-label="Next image"
              className="rv-pdp-gallery__arrow rv-pdp-gallery__arrow--next"
              onClick={() => show(activeIndex + 1)}
              onKeyDown={handleKeyDown}
              type="button"
            >
              <ChevronRightLargeIcon />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <ul className="rv-pdp-gallery__thumbs">
          {safeImages.map((image, index) => (
            <li key={image.id || image.url || index}>
              <button
                aria-current={index === activeIndex ? 'true' : undefined}
                aria-label={`Show image ${index + 1} of ${count}`}
                className={`rv-pdp-gallery__thumb ${
                  index === activeIndex ? 'is-active' : ''
                }`}
                onClick={() => show(index)}
                onKeyDown={handleKeyDown}
                type="button"
              >
                <Image
                  alt=""
                  aspectRatio="1/1"
                  className="rv-pdp-gallery__thumb-image"
                  data={image}
                  loading="lazy"
                  sizes="70px"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

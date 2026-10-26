import {useId} from 'react';

const STAR_PATH =
  'M12 2.2l3.05 6.18 6.82.99-4.94 4.81 1.17 6.8L12 17.77l-6.1 3.21 1.17-6.8-4.94-4.81 6.82-.99z';

/**
 * Five stars with fractional fills (4.4 => four full stars and one 40% star).
 * Purely decorative; the parent supplies the readable rating text.
 */
export function StarRating({className = '', rating = 0, size = 14}) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const value = Number.isFinite(Number(rating)) ? Number(rating) : 0;

  return (
    <span
      aria-hidden="true"
      className={`rv-pdp-stars ${className}`.trim()}
      style={{'--rv-star-size': `${size}px`}}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        const gradientId = `rv-star-${reactId}-${index}`;
        return (
          <svg
            className="rv-pdp-star"
            height={size}
            key={index}
            viewBox="0 0 24 24"
            width={size}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fill * 100}%`} stopColor="#E8A33D" />
                <stop offset={`${fill * 100}%`} stopColor="#D9D9D9" />
              </linearGradient>
            </defs>
            <path d={STAR_PATH} fill={`url(#${gradientId})`} />
          </svg>
        );
      })}
    </span>
  );
}

import {CheckCircleIcon} from '~/components/product/ProductIcons';
import {StarRating} from '~/components/product/StarRating';

/**
 * @param {{
 *   review: {
 *     quote: string;
 *     author: string;
 *     location?: string;
 *     verified?: boolean;
 *   } | null;
 * }}
 */
export function ProductTestimonial({review}) {
  if (!review?.quote) return null;

  const attribution = review.location
    ? `\u2014 ${review.author}, ${review.location}`
    : `\u2014 ${review.author}`;

  return (
    <blockquote className="rv-pdp-review">
      <StarRating rating={5} size={13} />
      <p className="rv-pdp-review__quote">
        &ldquo;{review.quote}&rdquo;
      </p>
      <footer className="rv-pdp-review__footer">
        <span className="rv-pdp-review__author">{attribution}</span>
        {review.verified ? (
          <span className="rv-pdp-review__verified">
            <CheckCircleIcon size={14} />
            Verified Customer
          </span>
        ) : null}
      </footer>
    </blockquote>
  );
}

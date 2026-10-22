import {Link} from 'react-router';

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.41 6.2 20.46l1.11-6.46-4.7-4.58 6.49-.94L12 2.6z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="rv-hero">
      <div className="rv-container rv-hero__grid">
        <div className="rv-hero__content">
          <div className="rv-hero__rating">
            <span className="rv-hero__stars" aria-hidden="true">
              {['one', 'two', 'three', 'four', 'five'].map((star) => (
                <StarIcon key={star} />
              ))}
            </span>
            <span className="rv-hero__rating-text">
              1 Million + Happy Customers
            </span>
          </div>

          <h1>ORGANIC BEETROOT AND MORINGA, MADE FOR EVERY DAY</h1>

          <div className="rv-hero__copy">
            <p>
              Rosabella makes single-ingredient supplements from two
              time-tested plants: organic beetroot for circulation support and
              moringa for daily nutrition. Clearly labeled doses, third-party
              testing on every batch, and more than 4,000 verified customer
              reviews.
            </p>
          </div>

          <div className="rv-hero__cta">
            <Link
              to="/collections/all"
              className="rv-btn rv-btn--large rv-btn--block"
              prefetch="intent"
            >
              SHOP OUR BEST SELLERS &gt;
            </Link>
            <div className="rv-hero__guarantee">
              <ShieldCheckIcon />
              <span>90-Day Satisfaction Guarantee</span>
            </div>
          </div>
        </div>

        <div className="rv-hero__media">
          <img
            src="/images/hero-banner.webp"
            alt="Rosabella organic beetroot and moringa bottles"
            width="765"
            height="788"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

import {Link} from 'react-router';

export function TestedBox() {
  return (
    <section className="rv-tested">
      <div className="rv-container">
        <div className="rv-tested__box">
          <h3>TESTED, VERIFIED, AND GUARANTEED</h3>
          <p>
            Every batch is third-party tested, with a Certificate of Analysis
            available on request. Every order is covered by our 90-day
            money-back guarantee. And every bottle you buy donates a meal to a
            child in need through our Feeding America partnership.
          </p>
          <div className="rv-tested__actions">
            <Link
              to="/pages/reviews"
              className="rv-btn rv-btn--reviews"
              prefetch="intent"
            >
              SEE THE REVIEWS &gt;
            </Link>
            <Link
              to="/pages/how-our-ingredients-are-tested"
              className="rv-btn rv-btn--outline rv-btn--science"
              prefetch="intent"
            >
              HOW OUR INGREDIENTS ARE TESTED &gt;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

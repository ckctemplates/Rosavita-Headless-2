import {Link} from 'react-router';

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {href: 'https://www.instagram.com/', label: 'Instagram', Icon: InstagramIcon},
  {href: 'https://www.facebook.com/', label: 'Facebook', Icon: FacebookIcon},
  {href: 'https://www.tiktok.com/', label: 'TikTok', Icon: TikTokIcon},
];

const SUPPORT_LINKS = [
  {label: 'Search', to: '/search'},
  {label: 'Contact Us', to: '/pages/contact'},
  {label: 'Privacy Policy', to: '/pages/privacy-policy'},
  {label: 'Terms of Service', to: '/pages/terms-of-service'},
  {label: 'Refund Policy', to: '/pages/refund-policy'},
  {label: 'Manage Subscription', to: '/account'},
];

const EXPLORE_LINKS = [
  {label: 'Best Sellers', to: '/collections/best-sellers'},
  {label: 'Beetroot', to: '/products/beetroot'},
  {label: 'Contact', to: '/pages/contact'},
];

export function RosavitaFooter() {
  return (
    <footer className="rv-footer">
      <div className="rv-footer__grid rv-footer__grid--narrow">
        <div>
          <h4 className="rv-footer__heading">SUPPORT</h4>
          <ul className="rv-footer__list">
            {SUPPORT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} prefetch="intent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="rv-footer__heading">EXPLORE ROSAVITA</h4>
          <ul className="rv-footer__list">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} prefetch="intent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="rv-footer__heading">SIGN UP AND SAVE</h4>
          <p className="rv-footer__text">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime
            deals.
          </p>
          <form
            className="rv-footer__form"
            action="/contact#RvFooterForm"
            method="post"
            acceptCharset="UTF-8"
          >
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="utf8" value="✓" />
            <input type="hidden" name="contact[tags]" value="newsletter" />
            <label htmlFor="RvFooterEmail" className="rv-sr-only">
              Email
            </label>
            <input
              id="RvFooterEmail"
              type="email"
              name="contact[email]"
              placeholder="Email"
              autoComplete="email"
              required
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowRightIcon />
            </button>
          </form>

          <ul className="rv-footer__social">
            {SOCIAL_LINKS.map(({href, label, Icon}) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rv-bottom">
        <span className="rv-bottom__copy">
          &copy; 2026, <Link to="/">Rosavita</Link>
        </span>
        <p className="rv-bottom__disclaimer">
          * These statements have not been evaluated by the Food and Drug
          Administration. This product is not intended to diagnose, treat, cure,
          or prevent any disease. Please always consult your health care
          provider if you are taking any medications or have any medical
          conditions. Individual results may vary.
        </p>
      </div>
    </footer>
  );
}

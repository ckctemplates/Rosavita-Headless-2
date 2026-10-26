import {
  PAYMENT_BADGES,
  PAYMENT_BRAND_MAP,
} from '~/lib/product-page-constants';

const FONT = 'Montserrat, Arial, sans-serif';

/**
 * Logo artwork sized for the 38 x 24 badge. The badge background and border are
 * drawn by CSS so every mark has the same white card treatment.
 * @param {{key: string; label: string}} badge
 */
function PaymentMark({badge}) {
  switch (badge.key) {
    case 'american-express':
      return (
        <text
          fill="#2E77BC"
          fontFamily={FONT}
          fontSize="6.6"
          fontWeight="800"
          letterSpacing="0.2"
          textAnchor="middle"
          x="19"
          y="15.5"
        >
          AMEX
        </text>
      );
    case 'apple-pay':
      return (
        <text
          fill="#111111"
          fontFamily={FONT}
          fontSize="6.4"
          fontWeight="600"
          textAnchor="middle"
          x="19"
          y="15.3"
        >
          Apple Pay
        </text>
      );
    case 'diners-club':
      return (
        <>
          <circle cx="11" cy="8.5" fill="#0079BE" r="4.6" />
          <circle cx="11" cy="8.5" fill="#FFFFFF" r="2.1" />
          <text
            fill="#0079BE"
            fontFamily={FONT}
            fontSize="4.4"
            fontWeight="800"
            textAnchor="middle"
            x="23"
            y="10.4"
          >
            DINERS
          </text>
          <text
            fill="#0079BE"
            fontFamily={FONT}
            fontSize="4.4"
            fontWeight="800"
            textAnchor="middle"
            x="23"
            y="15.8"
          >
            CLUB
          </text>
        </>
      );
    case 'discover':
      return (
        <>
          <circle cx="30.5" cy="7" fill="#F58220" r="3.4" />
          <text
            fill="#1A1A1A"
            fontFamily={FONT}
            fontSize="4.8"
            fontWeight="800"
            textAnchor="middle"
            x="17"
            y="15.4"
          >
            DISCOVER
          </text>
          <text
            fill="#555555"
            fontFamily={FONT}
            fontSize="3.6"
            fontWeight="600"
            textAnchor="middle"
            x="17"
            y="19.4"
          >
            NETWORK
          </text>
        </>
      );
    case 'mastercard':
      return (
        <>
          <circle cx="14.5" cy="9" fill="#EB001B" r="5.6" />
          <circle cx="23.5" cy="9" fill="#F79E1B" r="5.6" />
          <path
            d="M19 4.7a5.6 5.6 0 0 0 0 8.6 5.6 5.6 0 0 0 0-8.6z"
            fill="#FF5F00"
          />
          <text
            fill="#1A1A1A"
            fontFamily={FONT}
            fontSize="4.2"
            fontWeight="700"
            textAnchor="middle"
            x="19"
            y="21"
          >
            mastercard
          </text>
        </>
      );
    case 'maestro':
      return (
        <>
          <circle cx="14" cy="9" fill="#0099DF" r="5.6" />
          <circle cx="24" cy="9" fill="#ED0006" r="5.6" />
          <path
            d="M19 4.7a5.6 5.6 0 0 0 0 8.6 5.6 5.6 0 0 0 0-8.6z"
            fill="#6C6BBD"
          />
          <text
            fill="#1A1A1A"
            fontFamily={FONT}
            fontSize="4.4"
            fontWeight="700"
            textAnchor="middle"
            x="19"
            y="21"
          >
            maestro
          </text>
        </>
      );
    case 'shop-pay':
      return (
        <text
          fill="#5A31F4"
          fontFamily={FONT}
          fontSize="6.2"
          fontWeight="700"
          textAnchor="middle"
          x="19"
          y="15.4"
        >
          Shop Pay
        </text>
      );
    case 'visa':
      return (
        <text
          fill="#1A1F71"
          fontFamily={FONT}
          fontSize="8.2"
          fontStyle="italic"
          fontWeight="800"
          letterSpacing="0.2"
          textAnchor="middle"
          x="19"
          y="16"
        >
          VISA
        </text>
      );
    default:
      return (
        <text
          fill="#1A1A1A"
          fontFamily={FONT}
          fontSize="6"
          fontWeight="700"
          textAnchor="middle"
          x="19"
          y="15.5"
        >
          {badge.label}
        </text>
      );
  }
}

/**
 * Small inline SVG payment marks. Uses storefront payment settings when they are
 * available, otherwise the editable PAYMENT_BADGES constant.
 * @param {{
 *   paymentSettings?: {
 *     acceptedCardBrands?: string[];
 *     supportedDigitalWallets?: string[];
 *   } | null;
 * }} props
 */
export function PaymentBadges({paymentSettings}) {
  const apiBrands = [
    ...(paymentSettings?.acceptedCardBrands || []),
    ...(paymentSettings?.supportedDigitalWallets || []),
  ]
    .map((brand) => PAYMENT_BRAND_MAP[String(brand).toUpperCase()])
    .filter(Boolean);

  const badges = apiBrands.length
    ? PAYMENT_BADGES.filter((badge) => apiBrands.includes(badge.key))
    : PAYMENT_BADGES;

  if (!badges.length) return null;

  return (
    <ul className="rv-pdp-payments" aria-label="Accepted payment methods">
      {badges.map((badge) => (
        <li key={badge.key}>
          <svg
            aria-label={badge.label}
            className="rv-pdp-payment"
            height="24"
            role="img"
            viewBox="0 0 38 24"
            width="38"
          >
            <PaymentMark badge={badge} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

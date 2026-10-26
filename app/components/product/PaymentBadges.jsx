import {
  PAYMENT_BADGES,
  PAYMENT_BRAND_MAP,
} from '~/lib/product-page-constants';

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
            <rect
              fill={badge.background}
              height="22"
              rx="3"
              stroke={badge.background === '#FFFFFF' ? '#DDDDDD' : 'none'}
              width="36"
              x="1"
              y="1"
            />
            {badge.key === 'mastercard' ? (
              <>
                <circle cx="15" cy="9" fill="#EB001B" r="5" />
                <circle cx="22" cy="9" fill="#F79E1B" r="5" />
                <text
                  fill="#1A1A1A"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="5.4"
                  fontWeight="700"
                  textAnchor="middle"
                  x="19"
                  y="20"
                >
                  mastercard
                </text>
              </>
            ) : badge.key === 'maestro' ? (
              <>
                <circle cx="14" cy="9" fill="#0099DF" r="5" />
                <circle cx="23" cy="9" fill="#ED0006" r="5" />
                <text
                  fill="#1A1A1A"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="5.2"
                  fontWeight="700"
                  textAnchor="middle"
                  x="19"
                  y="20"
                >
                  maestro
                </text>
              </>
            ) : badge.key === 'discover' ? (
              <>
                <circle cx="27" cy="9" fill="#F58220" r="4" />
                <text
                  fill="#1A1A1A"
                  fontFamily="Montserrat, sans-serif"
                  fontSize="4.7"
                  fontWeight="700"
                  textAnchor="middle"
                  x="17"
                  y="18"
                >
                  DISCOVER
                </text>
              </>
            ) : (
              <text
                fill={badge.text}
                fontFamily="Montserrat, sans-serif"
                fontSize={
                  badge.key === 'american-express'
                    ? 6.6
                    : badge.key === 'diners-club'
                      ? 5.2
                      : badge.key === 'visa'
                        ? 7.4
                        : 6
                }
                fontWeight="700"
                textAnchor="middle"
                x="19"
                y="15.5"
              >
                {badge.short}
              </text>
            )}
          </svg>
        </li>
      ))}
    </ul>
  );
}

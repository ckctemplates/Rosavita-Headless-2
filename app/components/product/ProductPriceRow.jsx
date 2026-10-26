import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: {amount: string; currencyCode: string} | null;
 *   compareAt?: {amount: string; currencyCode: string} | null;
 *   savingPercent?: number;
 *   className?: string;
 * }}
 */
export function ProductPriceRow({
  price,
  compareAt,
  savingPercent = 0,
  className = '',
}) {
  if (!price) return null;

  return (
    <div className={`rv-pdp-price ${className}`.trim()}>
      {compareAt ? (
        <s className="rv-pdp-price__compare">
          <Money as="span" data={compareAt} />
        </s>
      ) : null}
      <span className="rv-pdp-price__current">
        <Money as="span" data={price} />
      </span>
      {compareAt && savingPercent > 0 ? (
        <span className="rv-pdp-price__save">SAVE {savingPercent}%</span>
      ) : null}
    </div>
  );
}

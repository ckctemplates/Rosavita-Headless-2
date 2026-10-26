import {Money} from '@shopify/hydrogen';
import {ProductPriceRow} from '~/components/product/ProductPriceRow';
import {PurchaseBox} from '~/components/product/PurchaseBox';
import {StarRating} from '~/components/product/StarRating';
import {CheckIcon} from '~/components/product/ProductIcons';
import {RATING_SOURCE_LABEL} from '~/lib/product-page-constants';

/**
 * The complete right-hand product information column.
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 *   pricing: any;
 *   content: any;
 *   purchaseMode: 'subscribe' | 'once';
 *   onTogglePurchaseMode: () => void;
 *   onSelectVariant: (variant: any) => void;
 *   hasPlans: boolean;
 *   paymentSettings?: any;
 *   shipByDate: string;
 *   preferredPlanName?: string;
 *   addToCartRef?: React.RefObject<HTMLButtonElement>;
 * }} props
 */
export function ProductBuyBox({
  product,
  selectedVariant,
  pricing,
  content,
  purchaseMode,
  onTogglePurchaseMode,
  onSelectVariant,
  hasPlans,
  paymentSettings,
  shipByDate,
  preferredPlanName,
  addToCartRef,
}) {
  return (
    <div className="rv-pdp-buybox">
      {content.rating ? (
        <div className="rv-pdp-rating">
          <StarRating rating={content.rating} size={14} />
          <span>
            Rated <strong>{content.rating.toFixed(1)}/5</strong>{' '}
            {RATING_SOURCE_LABEL}
          </span>
        </div>
      ) : null}

      <h1 className="rv-pdp-title">
        {content.displayTitle || product.title}
      </h1>

      <ProductPriceRow
        compareAt={pricing?.compareAt}
        price={pricing?.price}
        savingPercent={pricing?.savingPercent}
      />

      <p aria-atomic="true" aria-live="polite" className="rv-sr-only">
        {pricing?.price ? (
          <>
            <Money as="span" data={pricing.price} />.{' '}
            {selectedVariant?.availableForSale ? 'In stock' : 'Out of stock'}.{' '}
            {purchaseMode === 'subscribe'
              ? 'Subscription'
              : 'One-time purchase'}
            .
          </>
        ) : (
          'This product is currently unavailable.'
        )}
      </p>

      {content.subheading ? (
        <p className="rv-pdp-subheading">{content.subheading}</p>
      ) : null}

      {content.intro ? (
        <p className="rv-pdp-intro">{content.intro}</p>
      ) : null}

      {content.benefits?.length ? (
        <ul className="rv-pdp-benefits">
          {content.benefits.map((benefit) => (
            <li key={benefit}>
              <CheckIcon size={16} strokeWidth={1.8} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <PurchaseBox
        addToCartRef={addToCartRef}
        content={content}
        hasPlans={hasPlans}
        onSelectVariant={onSelectVariant}
        onTogglePurchaseMode={onTogglePurchaseMode}
        paymentSettings={paymentSettings}
        preferredPlanName={preferredPlanName}
        pricing={pricing}
        product={product}
        purchaseMode={purchaseMode}
        selectedVariant={selectedVariant}
        shipByDate={shipByDate}
      />
    </div>
  );
}

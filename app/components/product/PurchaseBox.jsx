import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useAside} from '~/components/Aside';
import {BundleSelector} from '~/components/product/BundleSelector';
import {PaymentBadges} from '~/components/product/PaymentBadges';
import {ProductAccordion} from '~/components/product/ProductAccordion';
import {
  CheckIcon,
  SealIcon,
  TruckIcon,
} from '~/components/product/ProductIcons';
import {
  ADD_TO_CART_TEXT,
  ADDING_TEXT,
  AUTO_DELIVERS_TEMPLATE,
  BUY_ONCE_TEXT,
  CANCEL_ANYTIME_TEXT,
  DELIVERY_ESTIMATE_TEXT,
  ONE_TIME_LABEL,
  REFILL_TEMPLATE,
  SHIPS_BY_TEMPLATE,
  SOLD_OUT_TEXT,
  SUBSCRIBE_LABEL,
  SUBSCRIPTION_RECOMMENDATION,
  SWITCH_BACK_TEXT,
} from '~/lib/product-page-constants';
import {
  formatFrequency,
  humanizeInterval,
} from '~/lib/product-page-content';

/**
 * The purchase controls under the product information.
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 *   pricing: any;
 *   purchaseMode: 'subscribe' | 'once';
 *   onTogglePurchaseMode: () => void;
 *   onSelectVariant: (variant: any) => void;
 *   hasPlans: boolean;
 *   content: any;
 *   paymentSettings?: any;
 *   shipByDate: string;
 *   preferredPlanName?: string;
 *   addToCartRef?: React.RefObject<HTMLButtonElement>;
 * }} props
 */
export function PurchaseBox({
  product,
  selectedVariant,
  pricing,
  purchaseMode,
  onTogglePurchaseMode,
  onSelectVariant,
  hasPlans,
  content,
  paymentSettings,
  shipByDate,
  preferredPlanName = '',
  addToCartRef,
}) {
  const isAvailable = Boolean(selectedVariant?.availableForSale);
  const isSubscribe =
    purchaseMode === 'subscribe' && hasPlans && Boolean(pricing?.sellingPlan);
  const fallbackPlan =
    product?.sellingPlanGroups?.nodes?.[0]?.sellingPlans?.nodes?.[0] || null;
  const plan = pricing?.sellingPlan || fallbackPlan;
  const frequency = formatFrequency(plan) || 'month';
  const interval = humanizeInterval(plan);
  const refillParts = REFILL_TEMPLATE.split('{price}');
  const refillBeforePrice = refillParts[0] || '';
  const refillAfterPrice = (refillParts[1] || '').replace(
    '{interval}',
    interval,
  );

  const bundleSelector = (
    <BundleSelector
      onSelectVariant={onSelectVariant}
      preferredPlanName={preferredPlanName}
      product={product}
      purchaseMode={purchaseMode}
      selectedVariant={selectedVariant}
    />
  );

  return (
    <div className="rv-pdp-purchase">
      {hasPlans ? (
        <p className="rv-pdp-purchase__label">
          {isSubscribe ? SUBSCRIBE_LABEL : ONE_TIME_LABEL}
        </p>
      ) : null}

      {bundleSelector}

      <p className="rv-pdp-ships">
        <span className="rv-pdp-dot" aria-hidden="true" />
        {SHIPS_BY_TEMPLATE.replace('{date}', shipByDate)}
      </p>

      {selectedVariant ? (
        <AddToCart
          addToCartRef={addToCartRef}
          isAvailable={isAvailable}
          pricing={pricing}
          product={product}
          purchaseMode={purchaseMode}
          selectedVariant={selectedVariant}
        />
      ) : null}

      {isSubscribe ? (
        <ul className="rv-pdp-sub-list">
          <li>
            <CheckIcon size={14} />
            <span>
              {AUTO_DELIVERS_TEMPLATE.replace('{frequency}', frequency)}
            </span>
          </li>
          <li>
            <CheckIcon size={14} />
            <span>
              {refillBeforePrice}
              <Money as="span" data={pricing.price} />
              {refillAfterPrice}
            </span>
          </li>
          <li>
            <CheckIcon size={14} />
            <span>{CANCEL_ANYTIME_TEXT}</span>
          </li>
        </ul>
      ) : null}

      {hasPlans ? (
        <>
          <hr className="rv-pdp-divider" />
          <button
            aria-pressed={purchaseMode === 'once'}
            className="rv-pdp-buy-once"
            onClick={onTogglePurchaseMode}
            type="button"
          >
            {purchaseMode === 'once' ? SWITCH_BACK_TEXT : BUY_ONCE_TEXT}
          </button>
          <p className="rv-pdp-purchase__recommendation">
            {SUBSCRIPTION_RECOMMENDATION}
          </p>
        </>
      ) : null}

      {selectedVariant ? (
        <div className="rv-pdp-stock-row">
          <span
            className={`rv-pdp-stock ${
              isAvailable ? 'is-in-stock' : 'is-out-of-stock'
            }`}
          >
            <span
              className={`rv-pdp-stock__dot ${
                isAvailable ? 'is-green' : 'is-red'
              }`}
              aria-hidden="true"
            />
            {isAvailable ? 'In stock' : 'Out of stock'}
          </span>
          <span className="rv-pdp-stock__delivery">
            <TruckIcon size={15} />
            {DELIVERY_ESTIMATE_TEXT}
          </span>
        </div>
      ) : null}

      <PaymentBadges paymentSettings={paymentSettings} />

      {content.guarantee ? (
        <div className="rv-pdp-guarantee">
          <SealIcon className="rv-pdp-guarantee__seal" />
          <div>
            {content.guarantee.title ? (
              <p className="rv-pdp-guarantee__title">
                {content.guarantee.title}
              </p>
            ) : null}
            {content.guarantee.text ? (
              <p className="rv-pdp-guarantee__text">
                {content.guarantee.text}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {content.accordions?.length ? (
        <div className="rv-pdp-info-accordions">
          <h2 className="rv-sr-only">Product details</h2>
          <ProductAccordion
            idPrefix="rv-pdp-info"
            items={content.accordions}
            variant="info"
          />
        </div>
      ) : null}
    </div>
  );
}

function AddToCart({
  product,
  selectedVariant,
  pricing,
  purchaseMode,
  isAvailable,
  addToCartRef,
}) {
  const lines = [
    {
      merchandiseId: selectedVariant.id,
      quantity: 1,
      ...(purchaseMode === 'subscribe' && pricing?.sellingPlan?.id
        ? {sellingPlanId: pricing.sellingPlan.id}
        : {}),
      selectedVariant,
    },
  ];
  const analytics = {
    products: [
      {
        id: product.id,
        title: product.title,
        price: pricing?.price?.amount || '0',
        vendor: product.vendor,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        quantity: 1,
      },
    ],
  };

  return (
    <CartForm
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{lines}}
      route="/cart"
    >
      {(fetcher) => (
        <AddToCartContent
          addToCartRef={addToCartRef}
          analytics={analytics}
          fetcher={fetcher}
          isAvailable={isAvailable}
        />
      )}
    </CartForm>
  );
}

function AddToCartContent({analytics, fetcher, isAvailable, addToCartRef}) {
  const {open} = useAside();
  const lastHandled = useRef(null);
  const errors = fetcher.data?.errors || [];
  const errorMessage =
    errors[0]?.message ||
    (typeof errors[0] === 'string' ? errors[0] : '') ||
    '';
  const isPending = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    if (fetcher.data.errors?.length) return;
    if (lastHandled.current === fetcher.data) return;
    lastHandled.current = fetcher.data;
    open('cart');
  }, [fetcher.data, fetcher.state, open]);

  const label = !isAvailable
    ? SOLD_OUT_TEXT
    : isPending
      ? ADDING_TEXT
      : ADD_TO_CART_TEXT;

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        aria-busy={isPending}
        aria-disabled={!isAvailable || isPending}
        className="rv-pdp-add"
        disabled={!isAvailable || isPending}
        id="rv-add-to-cart"
        ref={addToCartRef}
        type="submit"
      >
        {label}
      </button>
      {errorMessage ? (
        <p className="rv-pdp-add__error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}

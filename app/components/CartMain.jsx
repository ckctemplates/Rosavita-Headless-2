import {useOptimisticCart, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartUpsell} from '~/components/CartUpsell';
import {CartSummary} from './CartSummary';

const FREE_SHIPPING_THRESHOLD = null;
const SHOW_CART_UPSELL = true;

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <path
        d="M3 3l12 12M15 3L3 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="46"
      viewBox="0 0 46 46"
      width="46"
    >
      <path
        d="M12 15h22l2 24H10l2-24Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M17.5 15v-1.5a5.5 5.5 0 0 1 11 0V15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Returns a map of all line items and their children.
 * @param {CartLine[]} lines
 * @return {LineItemChildrenMap}
 */
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childLines] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childLines);
      }
    }
  }
  return children;
}

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const rootLines = (cart?.lines?.nodes ?? []).filter((line) => {
    return !('parentRelationship' in line && line.parentRelationship?.parent);
  });
  const cartHasItems = rootLines.length > 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  const itemCount = cart?.totalQuantity ?? 0;

  if (layout === 'aside') {
    return (
      <div className="rv-cart">
        <CartDrawerHeader itemCount={itemCount} />
        {FREE_SHIPPING_THRESHOLD ? (
          <CartShippingProgress cart={cart} />
        ) : null}
        <div className="rv-cart__scroll">
          {cartHasItems ? (
            <>
              <p className="sr-only" id="cart-lines">
                Line items
              </p>
              <ul aria-labelledby="cart-lines" className="rv-cart__lines">
                {rootLines.map((line) => (
                  <CartLineItem
                    childrenMap={childrenMap}
                    key={line.id}
                    layout={layout}
                    line={line}
                  />
                ))}
              </ul>
              {SHOW_CART_UPSELL ? <CartUpsell cart={cart} /> : null}
            </>
          ) : (
            <CartEmpty layout={layout} />
          )}
        </div>
        {cartHasItems ? (
          <CartSummary cart={cart} layout={layout} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="rv-cart-page">
      {cartHasItems ? (
        <div className="rv-cart-page__grid">
          <section className="rv-cart-page__items">
            <p className="sr-only" id="cart-lines">
              Line items
            </p>
            <ul aria-labelledby="cart-lines" className="rv-cart__lines">
              {rootLines.map((line) => (
                <CartLineItem
                  childrenMap={childrenMap}
                  key={line.id}
                  layout={layout}
                  line={line}
                />
              ))}
            </ul>
            {SHOW_CART_UPSELL ? <CartUpsell cart={cart} /> : null}
          </section>
          <CartSummary cart={cart} layout={layout} />
        </div>
      ) : (
        <CartEmpty layout={layout} />
      )}
    </div>
  );
}

function CartDrawerHeader({itemCount}) {
  const {type, close} = useAside();
  const closeRef = useRef(null);

  useEffect(() => {
    if (type !== 'cart') return;
    const timeout = setTimeout(() => closeRef.current?.focus(), 30);
    return () => clearTimeout(timeout);
  }, [type]);

  return (
    <header className="rv-cart__header">
      <h2 className="rv-cart__title" id="rv-cart-title">
        Your cart <span>({itemCount})</span>
      </h2>
      <button
        aria-label="Close cart"
        className="rv-cart__close"
        data-autofocus
        onClick={close}
        ref={closeRef}
        type="button"
      >
        <CloseIcon />
      </button>
    </header>
  );
}

function CartShippingProgress({cart}) {
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount || 0);
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="rv-cart__shipping">
      <p>
        {remaining > 0 ? (
          <>
            You&rsquo;re{' '}
            <strong>
              <Money data={{amount: remaining.toFixed(2), currencyCode}} />
            </strong>{' '}
            away from free shipping
          </>
        ) : (
          <strong>You qualify for free shipping</strong>
        )}
      </p>
      <div
        aria-hidden="true"
        className="rv-cart__shipping-track"
        role="presentation"
      >
        <span style={{width: `${progress}%`}} />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({layout = 'aside'}) {
  const {close} = useAside();
  const isAside = layout === 'aside';

  return (
    <div className="rv-cart-empty">
      <span className="rv-cart-empty__icon">
        <BagIcon />
      </span>
      <h2 className="rv-cart-empty__title">Your cart is empty</h2>
      <p className="rv-cart-empty__copy">
        Not sure where to start? Explore our best-selling wellness essentials.
      </p>
      <Link
        className="rv-btn rv-cart-empty__cta"
        onClick={isAside ? close : undefined}
        prefetch="viewport"
        to="/collections/all"
      >
        Shop best sellers
      </Link>
      {isAside ? (
        <button
          className="rv-cart-empty__continue"
          onClick={close}
          type="button"
        >
          Continue shopping
        </button>
      ) : null}
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {import('~/components/CartLineItem').CartLine} CartLine */
/** @typedef {{[parentId: string]: CartLine[]}} LineItemChildrenMap */

/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

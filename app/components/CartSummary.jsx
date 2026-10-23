import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useId, useRef} from 'react';
import {Link, useFetcher} from 'react-router';
import {useAside} from '~/components/Aside';

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="15"
      viewBox="0 0 15 15"
      width="15"
    >
      <rect
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        width="10"
        x="2.5"
        y="6.5"
      />
      <path
        d="M4.75 6.5V4.75a2.75 2.75 0 0 1 5.5 0V6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
    >
      <path
        d="M1.5 1.5l7 7M8.5 1.5l-7 7"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const {close} = useAside();
  const isAside = layout === 'aside';
  const discountCodes =
    cart?.discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];
  const discountTotal = (cart?.lines?.nodes ?? []).reduce(
    (total, line) =>
      total +
      (line.discountAllocations ?? []).reduce(
        (sum, allocation) =>
          sum + Number(allocation?.discountedAmount?.amount || 0),
        0,
      ),
    0,
  );
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode;

  return (
    <div
      aria-labelledby="cart-summary-title"
      className={`rv-cart-summary rv-cart-summary--${layout}`}
    >
      <h2 className="sr-only" id="cart-summary-title">
        Order summary
      </h2>

      <div className="rv-cart-summary__forms">
        <details className="rv-cart-disclosure">
          <summary>Discount code</summary>
          <div className="rv-cart-disclosure__body">
            <CartDiscounts discountCodes={discountCodes} />
          </div>
        </details>
        <details className="rv-cart-disclosure">
          <summary>Add order note</summary>
          <div className="rv-cart-disclosure__body">
            <CartNote note={cart?.note} />
          </div>
        </details>
        {!isAside ? (
          <details className="rv-cart-disclosure">
            <summary>Gift card</summary>
            <div className="rv-cart-disclosure__body">
              <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
            </div>
          </details>
        ) : null}
      </div>

      <dl className="rv-cart-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        {discountTotal > 0 && currencyCode ? (
          <div className="rv-cart-totals__discount">
            <dt>Discount</dt>
            <dd>
              &minus;
              <Money
                data={{
                  amount: discountTotal.toFixed(2),
                  currencyCode,
                }}
              />
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="rv-cart-summary__tax">
        Taxes and shipping calculated at checkout.
      </p>

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      <Link
        className="rv-cart-summary__continue"
        onClick={close}
        prefetch="intent"
        to="/collections/all"
      >
        Continue shopping
      </Link>

      <p className="rv-cart-summary__trust">
        <LockIcon /> Secure checkout &middot; Free US shipping
      </p>
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <a className="rv-cart-checkout" href={checkoutUrl} target="_self">
      Checkout <LockIcon />
    </a>
  );
}

/**
 * @param {{
 *   discountCodes: string[];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const inputId = useId();

  return (
    <div className="rv-cart-discount">
      {discountCodes.length ? (
        <ul className="rv-cart-discount__codes">
          {discountCodes.map((code) => (
            <li key={code}>
              <span>{code}</span>
              <UpdateDiscountForm
                discountCodes={discountCodes.filter((item) => item !== code)}
              >
                <button
                  aria-label={`Remove discount ${code}`}
                  className="rv-cart-discount__remove"
                  type="submit"
                >
                  <CloseIcon />
                </button>
              </UpdateDiscountForm>
            </li>
          ))}
        </ul>
      ) : null}

      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.DiscountCodesUpdate}
        inputs={{discountCodes}}
      >
        {(fetcher) => (
          <>
            <div className="rv-cart-discount__row">
              <label className="sr-only" htmlFor={inputId}>
                Discount code
              </label>
              <input
                id={inputId}
                name="discountCode"
                placeholder="Enter discount code"
                type="text"
              />
              <button
                className="rv-cart-discount__apply"
                disabled={fetcher.state !== 'idle'}
                type="submit"
              >
                Apply
              </button>
            </div>
            <CartActionError fetcher={fetcher} />
          </>
        )}
      </CartForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{note?: string | null}}
 */
function CartNote({note}) {
  const inputId = useId();

  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.NoteUpdate} inputs={{}}>
      {(fetcher) => (
        <>
          <label className="sr-only" htmlFor={inputId}>
            Order note
          </label>
          <textarea
            defaultValue={note || ''}
            id={inputId}
            name="note"
            placeholder="Add a note to your order"
            rows={3}
          />
          <button
            className="rv-cart-note__save"
            disabled={fetcher.state !== 'idle'}
            type="submit"
          >
            Save note
          </button>
          <CartActionError fetcher={fetcher} />
        </>
      )}
    </CartForm>
  );
}

/**
 * @param {{fetcher: import('react-router').Fetcher}} fetcher
 */
function CartActionError({fetcher}) {
  const messages = [
    ...(fetcher.data?.errors ?? []),
    ...(fetcher.data?.warnings ?? []),
  ]
    .map((item) => item?.message)
    .filter(Boolean);

  if (!messages.length) return null;

  return (
    <p className="rv-cart-action-error" role="alert">
      {[...new Set(messages)].join(' ')}
    </p>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const inputId = useId();

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div className="rv-cart-giftcard">
      {giftCardCodes && giftCardCodes.length > 0 ? (
        <ul className="rv-cart-discount__codes">
          {giftCardCodes.map((giftCard) => (
            <li key={giftCard.id}>
              <span>
                &bull;&bull;&bull;{giftCard.lastCharacters} &middot;{' '}
                <Money data={giftCard.amountUsed} />
              </span>
              <RemoveGiftCardForm giftCardId={giftCard.id}>
                <button
                  aria-label="Remove gift card"
                  className="rv-cart-discount__remove"
                  type="submit"
                >
                  <CloseIcon />
                </button>
              </RemoveGiftCardForm>
            </li>
          ))}
        </ul>
      ) : null}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="rv-cart-discount__row">
          <label className="sr-only" htmlFor={inputId}>
            Gift card code
          </label>
          <input
            id={inputId}
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            type="text"
          />
          <button
            className="rv-cart-discount__apply"
            disabled={giftCardAddFetcher.state !== 'idle'}
            type="submit"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */

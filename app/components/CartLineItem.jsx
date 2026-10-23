import {CartForm, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useFetchers} from 'react-router';
import {useAside} from './Aside';

function MinusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
    >
      <path d="M2 6h8" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
    >
      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 *   childrenMap: LineItemChildrenMap;
 * }}
 */
export function CartLineItem({layout, line, childrenMap}) {
  const {id, merchandise} = line;
  const {product, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap?.[id];
  const childrenLabelId = `cart-line-children-${id}`;
  const fetchers = useFetchers();
  const errors = getLineActionErrors(fetchers, id);

  const options = selectedOptions.filter(
    (option) => option.value && option.value !== 'Default Title',
  );
  const variantLabel =
    merchandise.title && merchandise.title !== 'Default Title'
      ? merchandise.title
      : options.map((option) => option.value).join(' / ');

  const compareAt = line.cost?.compareAtAmountPerQuantity;
  const total = line.cost?.totalAmount;
  const compareAtTotal =
    compareAt && total && Number(compareAt.amount) > Number(total.amount)
      ? {
          amount: (Number(compareAt.amount) * line.quantity).toFixed(2),
          currencyCode: compareAt.currencyCode,
        }
      : null;

  const discountTotal = (line.discountAllocations ?? []).reduce(
    (sum, allocation) => sum + Number(allocation?.discountedAmount?.amount || 0),
    0,
  );
  const discountCurrency =
    line.discountAllocations?.[0]?.discountedAmount?.currencyCode ||
    total?.currencyCode;

  const handleNavigate = () => {
    if (layout === 'aside') close();
  };

  return (
    <li
      className={`rv-cart-line ${line.isOptimistic ? 'is-pending' : ''}`}
      data-cart-line
    >
      <div className="rv-cart-line__media">
        {image ? (
          <Link
            aria-hidden="true"
            onClick={handleNavigate}
            prefetch="intent"
            tabIndex={-1}
            to={lineItemUrl}
          >
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              height={112}
              loading="lazy"
              width={112}
            />
          </Link>
        ) : (
          <span aria-hidden="true" className="rv-cart-line__placeholder" />
        )}
      </div>

      <div className="rv-cart-line__body">
        <div className="rv-cart-line__top">
          <div className="rv-cart-line__heading">
            <Link
              className="rv-cart-line__title"
              onClick={handleNavigate}
              prefetch="intent"
              to={lineItemUrl}
            >
              {product.title}
            </Link>
            {variantLabel ? (
              <p className="rv-cart-line__variant">{variantLabel}</p>
            ) : null}
          </div>
          <CartLineRemoveButton
            disabled={!!line.isOptimistic}
            lineIds={[id]}
          >
            <CloseIcon />
          </CartLineRemoveButton>
        </div>

        <div className="rv-cart-line__prices">
          {total ? (
            <span className="rv-cart-line__price">
              <Money data={total} />
            </span>
          ) : null}
          {compareAtTotal ? (
            <s className="rv-cart-line__compare">
              <Money data={compareAtTotal} />
            </s>
          ) : null}
          {discountTotal > 0 && discountCurrency ? (
            <span className="rv-cart-line__discount">
              &minus;
              <Money
                data={{
                  amount: discountTotal.toFixed(2),
                  currencyCode: discountCurrency,
                }}
              />
            </span>
          ) : null}
        </div>

        <CartLineQuantity line={line} />

        {errors.length ? (
          <p className="rv-cart-line__error" role="alert">
            {errors[0]}
          </p>
        ) : null}
      </div>

      {lineItemChildren ? (
        <div className="rv-cart-line__children">
          <p className="sr-only" id={childrenLabelId}>
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId}>
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const maxQuantity = line.merchandise?.quantityAvailable;
  const atLimit =
    typeof maxQuantity === 'number' && quantity >= maxQuantity;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="rv-cart-qty">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
          className="rv-cart-qty__btn"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          type="submit"
          value={prevQuantity}
        >
          <MinusIcon />
        </button>
      </CartLineUpdateButton>
      <span aria-label="Quantity" className="rv-cart-qty__value">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label={`Increase quantity of ${line.merchandise.product.title}`}
          className="rv-cart-qty__btn"
          disabled={!!isOptimistic || atLimit}
          name="increase-quantity"
          type="submit"
          value={nextQuantity}
        >
          <PlusIcon />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 *   children: React.ReactNode;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled, children}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        aria-label="Remove item"
        className="rv-cart-line__remove"
        disabled={disabled}
        type="submit"
      >
        {children}
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @returns
 * @param {string[]} lineIds - line ids affected by the update
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/**
 * @param {ReturnType<typeof useFetchers>} fetchers
 * @param {string} lineId
 */
function getLineActionErrors(fetchers, lineId) {
  const messages = [];

  for (const fetcher of fetchers) {
    const raw = fetcher.formData?.get('cartFormInput');
    if (!raw) continue;

    try {
      const payload = JSON.parse(String(raw));
      const ids = [
        ...(payload?.inputs?.lineIds || []),
        ...(payload?.inputs?.lines || []).map((line) => line.id),
      ];
      if (!ids.includes(lineId)) continue;

      for (const item of [
        ...(fetcher.data?.errors || []),
        ...(fetcher.data?.warnings || []),
      ]) {
        if (item?.message) messages.push(item.message);
      }
    } catch {
      // Ignore non-cart forms.
    }
  }

  return [...new Set(messages)];
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('~/components/CartMain').LineItemChildrenMap} LineItemChildrenMap */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').CartLineFragment} CartLineFragment */

import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useAside} from '~/components/Aside';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   className?: string;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *   openCartOnSuccess?: boolean;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  className,
  disabled,
  lines,
  onClick,
  openCartOnSuccess = true,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <AddToCartButtonContent
          analytics={analytics}
          className={className}
          disabled={disabled}
          fetcher={fetcher}
          onClick={onClick}
          openCartOnSuccess={openCartOnSuccess}
        >
          {children}
        </AddToCartButtonContent>
      )}
    </CartForm>
  );
}

function AddToCartButtonContent({
  analytics,
  children,
  className,
  disabled,
  fetcher,
  onClick,
  openCartOnSuccess,
}) {
  const {open} = useAside();
  const lastOpened = useRef(null);

  useEffect(() => {
    if (!openCartOnSuccess) return;
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    if (fetcher.data.errors?.length) return;
    if (lastOpened.current === fetcher.data) return;

    lastOpened.current = fetcher.data;
    open('cart');
  }, [fetcher.data, fetcher.state, open, openCartOnSuccess]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        type="submit"
        className={className}
        onClick={onClick}
        disabled={disabled ?? fetcher.state !== 'idle'}
      >
        {children}
      </button>
    </>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */

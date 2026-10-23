import {Image, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {Link, useFetcher} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * @param {{cart: CartApiQueryFragment | null}} props
 */
export function CartUpsell({cart}) {
  const fetcher = useFetcher({key: 'cart-upsell'});
  const {close} = useAside();
  const lastKey = useRef('');

  const lines = cart?.lines?.nodes ?? [];
  const productIds = [
    ...new Set(
      lines
        .map((line) => line?.merchandise?.product?.id)
        .filter((id) => Boolean(id)),
    ),
  ];
  const productId = productIds[0] || '';
  const exclude = productIds.join(',');
  const key = `${productId}|${exclude}`;

  useEffect(() => {
    if (lastKey.current === key) return;
    lastKey.current = key;

    const params = new URLSearchParams();
    if (productId) params.set('productId', productId);
    if (exclude) params.set('exclude', exclude);
    void fetcher.load(`/api/cart-upsell?${params.toString()}`);
  }, [exclude, fetcher, key, productId]);

  const products = fetcher.data?.products ?? [];

  if (!products.length) return null;

  return (
    <section aria-labelledby="rv-cart-upsell-title" className="rv-cart-upsell">
      <h3 className="rv-cart-upsell__title" id="rv-cart-upsell-title">
        You may also like
      </h3>
      <ul className="rv-cart-upsell__list">
        {products.map((product) => {
          const variant = product.selectedOrFirstAvailableVariant;
          if (!variant) return null;

          return (
            <li className="rv-cart-upsell__item" key={product.id}>
              <Link
                aria-hidden="true"
                className="rv-cart-upsell__media"
                onClick={close}
                prefetch="intent"
                tabIndex={-1}
                to={`/products/${product.handle}`}
              >
                {product.featuredImage ? (
                  <Image
                    alt={product.featuredImage.altText || product.title}
                    aspectRatio="1/1"
                    data={product.featuredImage}
                    height={80}
                    loading="lazy"
                    width={80}
                  />
                ) : null}
              </Link>
              <div className="rv-cart-upsell__body">
                <Link
                  className="rv-cart-upsell__name"
                  onClick={close}
                  prefetch="intent"
                  to={`/products/${product.handle}`}
                >
                  {product.title}
                </Link>
                <span className="rv-cart-upsell__price">
                  <Money data={variant.price} />
                </span>
              </div>
              <AddToCartButton
                className="rv-cart-upsell__add"
                lines={[
                  {
                    merchandiseId: variant.id,
                    quantity: 1,
                    selectedVariant: variant,
                  },
                ]}
                openCartOnSuccess={false}
              >
                Add
              </AddToCartButton>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

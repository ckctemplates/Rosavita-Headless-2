import {CartForm, Image, Money} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';

export const BUY_NOW_BEHAVIOR = 'cart';

function getCardVariant(product) {
  return (
    product.selectedOrFirstAvailableVariant ||
    product.variants?.nodes?.[0] ||
    null
  );
}

function BuyNowButton({product, variant}) {
  const lines = [
    {
      merchandiseId: variant.id,
      quantity: 1,
      selectedVariant: variant,
    },
  ];
  const analytics = {
    products: [
      {
        id: product.id,
        variantId: variant.id,
        quantity: 1,
      },
    ],
  };

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <BuyNowButtonContent
          analytics={analytics}
          fetcher={fetcher}
          product={product}
        />
      )}
    </CartForm>
  );
}

function BuyNowButtonContent({analytics, fetcher, product}) {
  const {open} = useAside();
  const lastHandled = useRef(null);
  const [redirecting, setRedirecting] = useState(false);
  const errors = fetcher.data?.errors ?? [];
  const errorMessage = errors[0]?.message;
  const isPending = fetcher.state !== 'idle' || redirecting;

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    if (lastHandled.current === fetcher.data) return;
    lastHandled.current = fetcher.data;

    if (fetcher.data.errors?.length) return;

    if (BUY_NOW_BEHAVIOR === 'checkout') {
      const checkoutUrl = fetcher.data.cart?.checkoutUrl;
      if (checkoutUrl) {
        setRedirecting(true);
        window.location.assign(checkoutUrl);
      }
      return;
    }

    open('cart');
  }, [fetcher.data, fetcher.state, open]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <button
        type="submit"
        className="rv-pcard__btn"
        disabled={isPending}
        aria-label={`Buy now - ${product.title}`}
        aria-busy={isPending}
      >
        {isPending ? 'ADDING...' : 'BUY NOW'}
      </button>
      {errorMessage ? (
        <p className="rv-pcard__error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}

export function CollectionProductCard({product, loading = 'lazy'}) {
  const variant = getCardVariant(product);
  const image = product.featuredImage;
  const price = variant?.price || product.priceRange?.minVariantPrice;
  const compareAt =
    variant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice;
  const hasCompareAt =
    compareAt && price && Number(compareAt.amount) > Number(price.amount);

  return (
    <article className="rv-pcard">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="rv-pcard__media-link"
        aria-label={product.title}
      >
        {image ? (
          <Image
            data={image}
            alt={image.altText || product.title}
            aspectRatio="1/1"
            loading={loading}
            sizes="(min-width: 1024px) 312px, (min-width: 768px) 33vw, 50vw"
            className="rv-pcard__image"
          />
        ) : (
          <div className="rv-pcard__image-placeholder" aria-hidden="true" />
        )}
      </Link>
      <h3 className="rv-pcard__title">
        <Link to={`/products/${product.handle}`} prefetch="intent">
          {product.title}
        </Link>
      </h3>
      <div className="rv-pcard__spacer" />
      <div className="rv-pcard__price-row">
        {price ? <Money className="rv-pcard__price" data={price} /> : null}
        {hasCompareAt ? (
          <Money className="rv-pcard__compare" data={compareAt} />
        ) : null}
      </div>
      {variant && variant.availableForSale ? (
        <BuyNowButton product={product} variant={variant} />
      ) : (
        <button
          className="rv-pcard__btn rv-pcard__btn--soldout"
          disabled
          aria-disabled="true"
          aria-label={`Sold out - ${product.title}`}
        >
          SOLD OUT
        </button>
      )}
    </article>
  );
}

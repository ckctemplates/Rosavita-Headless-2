import {CartForm, Image, Money} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';

export const SHOW_QUICK_ADD = true;
export const MULTI_VARIANT_QUICK_ADD = 'first-available';

function getCardVariant(product) {
  return product.selectedOrFirstAvailableVariant || product.variants?.nodes?.[0] || null;
}

function QuickAddButton({product, variant}) {
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
        <QuickAddContent
          analytics={analytics}
          fetcher={fetcher}
          product={product}
        />
      )}
    </CartForm>
  );
}

function QuickAddContent({analytics, fetcher, product}) {
  const {open} = useAside();
  const lastHandled = useRef(null);
  const isPending = fetcher.state !== 'idle';
  const error = fetcher.data?.errors?.[0]?.message;

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    if (lastHandled.current === fetcher.data) return;
    lastHandled.current = fetcher.data;
    if (fetcher.data.errors?.length) return;
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
        className="rv-scard__btn"
        disabled={isPending}
        aria-label={`Add to cart - ${product.title}`}
        aria-busy={isPending}
      >
        {isPending ? 'ADDING...' : 'ADD TO CART'}
      </button>
      {error ? (
        <p className="rv-scard__error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}

function ViewOptionsButton({product}) {
  return (
    <Link
      className="rv-scard__btn rv-scard__btn--link"
      to={`/products/${product.handle}`}
      prefetch="intent"
    >
      VIEW OPTIONS
    </Link>
  );
}

export function SearchResultCard({product, loading = 'lazy', term}) {
  const variant = getCardVariant(product);
  const image = product.featuredImage || variant?.image;
  const price = variant?.price || product.priceRange?.minVariantPrice;
  const maxPrice = product.priceRange?.maxVariantPrice;
  const compareAt =
    variant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice;
  const hasCompareAt =
    compareAt && price && Number(compareAt.amount) > Number(price.amount);
  const isAvailable = variant?.availableForSale ?? product.availableForSale;
  const isSale = hasCompareAt && isAvailable;
  const isSoldOut = !isAvailable;
  const variantCount = product.variants?.nodes?.length || 1;
  const showFrom =
    maxPrice &&
    price &&
    Number(maxPrice.amount) !== Number(price.amount) &&
    variantCount > 1;

  const showQuickAddButton =
    SHOW_QUICK_ADD &&
    MULTI_VARIANT_QUICK_ADD === 'first-available' &&
    variant &&
    isAvailable;
  const showViewOptions =
    SHOW_QUICK_ADD &&
    MULTI_VARIANT_QUICK_ADD === 'view-options' &&
    variantCount > 1 &&
    isAvailable;

  return (
    <article className="rv-scard">
      <div className="rv-scard__media-wrap">
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="rv-scard__media-link"
          aria-label={product.title}
        >
          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              aspectRatio="1/1"
              loading={loading}
              sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
              className="rv-scard__image"
            />
          ) : (
            <div className="rv-scard__image-placeholder" aria-hidden="true" />
          )}
        </Link>
        {isSoldOut ? (
          <span className="rv-scard__badge">Sold out</span>
        ) : isSale ? (
          <span className="rv-scard__badge">Sale</span>
        ) : null}
      </div>
      <h3 className="rv-scard__title">
        <Link to={`/products/${product.handle}`} prefetch="intent">
          {product.title}
        </Link>
      </h3>
      <div className="rv-scard__price-block">
        {hasCompareAt && compareAt ? (
          <Money className="rv-scard__compare" data={compareAt} />
        ) : null}
        {price ? (
          <span className="rv-scard__price">
            {showFrom ? 'From ' : ''}
            <Money data={price} />
            {' '}
            {price.currencyCode}
          </span>
        ) : null}
      </div>
      <div className="rv-scard__spacer" />
      {isSoldOut ? (
        <button
          className="rv-scard__btn rv-scard__btn--soldout"
          disabled
          aria-disabled="true"
          aria-label={`Sold out - ${product.title}`}
        >
          SOLD OUT
        </button>
      ) : showQuickAddButton && variant ? (
        <QuickAddButton product={product} variant={variant} />
      ) : showViewOptions ? (
        <ViewOptionsButton product={product} />
      ) : null}
    </article>
  );
}

export function SearchPageTile({item}) {
  if (item.__typename === 'Article') {
    const image = item.image;
    return (
      <article className="rv-spage">
        <Link
          to={`/blogs/${item.blog.handle}/${item.handle}`}
          prefetch="intent"
          className="rv-spage__link"
        >
          {image ? (
            <Image
              data={image}
              alt={image.altText || item.title}
              aspectRatio="1/1"
              loading="lazy"
              sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
              className="rv-spage__image"
            />
          ) : null}
          <span className="rv-spage__title">{item.title}</span>
          <span className="rv-spage__badge">Article</span>
        </Link>
      </article>
    );
  }

  return (
    <article className="rv-spage">
      <Link
        to={`/pages/${item.handle}`}
        prefetch="intent"
        className="rv-spage__link rv-spage__link--plain"
      >
        <span className="rv-spage__title rv-spage__title--center">
          {item.title}
        </span>
        <span className="rv-spage__badge">Page</span>
      </Link>
    </article>
  );
}

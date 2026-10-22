import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

const FALLBACK_TAGS = {
  moringa: ['30 DAY SUPPLY', '60 CAPSULES'],
  beetroot: ['30 DAY SUPPLY', '60 CAPSULES'],
  electrolyte: ['30 SERVINGS', '8 KEY NUTRIENTS'],
  gummies: ['30 DAY SUPPLY', '60 GUMMIES'],
};

const FALLBACK_SUBTITLES = {
  moringa: 'Ultimate Green Superfood',
  beetroot: "Nature's Circulation Support",
  electrolyte: 'Clean Everyday Hydration',
  gummies: 'Your Daily Green Superfood',
};

const FALLBACK_IMAGES = {
  moringa: '/images/product-moringa.webp',
  beetroot: '/images/product-beetroot.png',
  electrolyte: '/images/product-electrolyte.webp',
  gummies: '/images/product-gummies.webp',
};

function fallbackKey(product) {
  const handle = product.handle || '';

  if (handle.includes('gumm')) return 'gummies';
  if (handle.includes('electro')) return 'electrolyte';
  if (handle.includes('beet')) return 'beetroot';
  return 'moringa';
}

export function ProductCard({product}) {
  const {open} = useAside();
  const key = fallbackKey(product);
  const variant = product.variants?.nodes?.[0];
  const price = variant?.price ?? product.priceRange?.minVariantPrice;
  const image = product.featuredImage;
  const tags =
    product.tags?.length > 0 ? product.tags.slice(0, 3) : FALLBACK_TAGS[key];
  const subtitle =
    product.subtitle?.value ||
    product.subtitle2?.value ||
    FALLBACK_SUBTITLES[key];
  const productUrl = `/products/${product.handle}`;

  return (
    <article className="rv-product">
      <div>
        <Link
          to={productUrl}
          className="rv-product__link"
          prefetch="intent"
          aria-label={product.title}
        >
          <img
            className="rv-product__image"
            src={image?.url || FALLBACK_IMAGES[key]}
            alt={image?.altText || product.title}
            width={image?.width || 600}
            height={image?.height || 600}
            loading="lazy"
          />
        </Link>

        <div className="rv-product__tags">
          {tags.map((tag) => (
            <span className="rv-product__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <Link to={productUrl} className="rv-product__link" prefetch="intent">
          <h3 className="rv-product__title">{product.title}</h3>
        </Link>

        {subtitle && <p className="rv-product__subtitle">{subtitle}</p>}

        {price && (
          <div className="rv-product__price">
            {product.fallback ? (
              <span>Rs.9,900</span>
            ) : (
              <Money data={price} />
            )}
          </div>
        )}
      </div>

      {variant ? (
        <AddToCartButton
          className="rv-product__atc"
          lines={[{merchandiseId: variant.id, quantity: 1}]}
          onClick={() => open('cart')}
          disabled={!variant.availableForSale}
        >
          {variant.availableForSale ? 'ADD TO CART' : 'SOLD OUT'}
        </AddToCartButton>
      ) : (
        <button type="button" className="rv-product__atc" disabled>
          SOLD OUT
        </button>
      )}
    </article>
  );
}

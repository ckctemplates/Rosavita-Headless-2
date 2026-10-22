import {ProductCard} from '~/components/home/ProductCard';

const REQUIRED_PRODUCTS = [
  {
    key: 'moringa',
    title: 'MORINGA POWDER CAPSULES',
    handle: 'rosabella-moringa-powder-capsules-np',
    match: ['moringa'],
    tags: ['30 DAY SUPPLY', '60 CAPSULES'],
    subtitle: 'Ultimate Green Superfood',
    image: '/images/product-moringa.webp',
  },
  {
    key: 'beetroot',
    title: 'ORGANIC BEETROOT CAPSULES',
    handle:
      'rosabella-organic-beetroot-capsules-1300mg-for-blood-flow-heart-health-bogo-sub',
    match: ['beetroot'],
    tags: ['30 DAY SUPPLY', '60 CAPSULES'],
    subtitle: "Nature's Circulation Support",
    image: '/images/product-beetroot.png',
  },
  {
    key: 'electrolyte',
    title: 'ELECTROLYTE DRINK POWDER',
    handle: 'rosabella-electrolyte-drink-powder-b1',
    match: ['electrolyte'],
    tags: ['30 SERVINGS', '8 KEY NUTRIENTS'],
    subtitle: 'Clean Everyday Hydration',
    image: '/images/product-electrolyte.webp',
  },
  {
    key: 'gummies',
    title: 'MORINGA GUMMIES',
    handle: 'rosabella-moringa-gummies-bogo-np',
    match: ['gumm'],
    tags: ['30 DAY SUPPLY', '60 GUMMIES'],
    subtitle: 'Your Daily Green Superfood',
    image: '/images/product-gummies.webp',
  },
];

function findProduct(nodes, {handle, match}) {
  return nodes.find(
    (product) =>
      product.handle === handle ||
      match.some((term) => product.handle.includes(term)),
  );
}

export function orderProducts(products = []) {
  const nodes = products?.nodes ?? [];
  const ordered = [];
  const seen = new Set();

  for (const required of REQUIRED_PRODUCTS) {
    const found = findProduct(nodes, required);
    if (found && !seen.has(found.id)) {
      ordered.push(found);
      seen.add(found.id);
    }
  }

  if (ordered.length === 0) {
    return REQUIRED_PRODUCTS.map((product) => ({
      id: product.key,
      title: product.title,
      handle: product.handle,
      tags: product.tags,
      fallback: true,
      subtitle2: {value: product.subtitle},
      featuredImage: {
        url: product.image,
        altText: product.title,
        width: 600,
        height: 600,
      },
      priceRange: {
        minVariantPrice: {
          amount: '9900',
          currencyCode: 'PKR',
        },
      },
    }));
  }

  for (const product of nodes) {
    if (ordered.length >= 4) break;
    if (!seen.has(product.id)) {
      ordered.push(product);
      seen.add(product.id);
    }
  }

  return ordered;
}

export function ProductGrid({products}) {
  const orderedProducts = orderProducts(products);

  return (
    <section className="rv-products" id="shop-products">
      <div className="rv-container">
        <h2 className="rv-products__title">
          SHOP ROSABELLA WELLNESS PRODUCTS
        </h2>

        <div className="rv-products__grid">
          {orderedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

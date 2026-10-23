import {CollectionProductCard} from './CollectionProductCard';

export function CollectionProductGrid({products}) {
  return (
    <ul className="rv-collection__grid" role="list">
      {products.map((product, index) => (
        <li key={product.id}>
          <CollectionProductCard
            product={product}
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </li>
      ))}
    </ul>
  );
}

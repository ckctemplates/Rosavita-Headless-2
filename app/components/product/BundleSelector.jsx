import {Money} from '@shopify/hydrogen';
import {ProductPriceRow} from '~/components/product/ProductPriceRow';
import {
  findVariantForOptionChange,
  getBundleContent,
  getExtraOptions,
  getVariantOptionValue,
  getVariantPricing,
  getVisibleBundleVariants,
} from '~/lib/product-page-content';

/**
 * Variant selector rendered as bundle cards.
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 *   onSelectVariant: (variant: any) => void;
 *   purchaseMode: 'subscribe' | 'once';
 *   preferredPlanName?: string;
 * }} props
 */
export function BundleSelector({
  product,
  selectedVariant,
  onSelectVariant,
  purchaseMode,
  preferredPlanName = '',
}) {
  const allVariants = product?.variants?.nodes || [];
  const extraOptions = getExtraOptions(product);
  const visibleVariants = getVisibleBundleVariants(product, selectedVariant);
  const variantIndex = new Map(
    allVariants.map((variant, index) => [variant.id, index]),
  );

  const selectedPricing = selectedVariant
    ? getVariantPricing(selectedVariant, purchaseMode, preferredPlanName)
    : null;

  if (allVariants.length <= 1) {
    const singleBundle = selectedVariant
      ? getBundleContent(selectedVariant, 0)
      : null;

    // Default-title variants do not need a redundant bundle card; the price
    // above the purchase controls already communicates the selection.
    if (!singleBundle || singleBundle.title === 'Default Title') {
      return null;
    }

    return (
      <div className="rv-pdp-single-bundle">
        {selectedVariant ? (
          <>
            <span className="rv-pdp-single-bundle__title">
              {singleBundle.title}
            </span>
            <ProductPriceRow
              className="rv-pdp-single-bundle__price"
              compareAt={selectedPricing?.compareAt}
              price={selectedPricing?.price}
              savingPercent={selectedPricing?.savingPercent}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rv-pdp-bundles-wrap">
      {extraOptions.map((option) => {
        if ((option.optionValues || []).length <= 1) return null;
        const selectedValue = getVariantOptionValue(
          selectedVariant,
          option.name,
        );

        return (
          <div className="rv-pdp-option" key={option.name}>
            <span className="rv-pdp-option__label">{option.name}</span>
            <div className="rv-pdp-option__values">
              {(option.optionValues || []).map((value) => {
                const optionValue = value.name;
                const target = findVariantForOptionChange(
                  product,
                  selectedVariant,
                  option.name,
                  optionValue,
                );
                return (
                  <button
                    aria-pressed={selectedValue === optionValue}
                    className={`rv-pdp-option__button ${
                      selectedValue === optionValue ? 'is-selected' : ''
                    }`}
                    disabled={!target}
                    key={optionValue}
                    onClick={() => target && onSelectVariant(target)}
                    type="button"
                  >
                    {optionValue}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        aria-label="Choose a bundle"
        className="rv-pdp-bundles"
        role="radiogroup"
      >
        {visibleVariants.map((variant) => {
          const index = variantIndex.get(variant.id) ?? 0;
          const bundle = getBundleContent(variant, index);
          const pricing = getVariantPricing(
            variant,
            purchaseMode,
            preferredPlanName,
          );
          const isSelected = selectedVariant?.id === variant.id;
          const isSoldOut = !variant.availableForSale;

          return (
            <label
              className={`rv-bundle ${isSelected ? 'is-selected' : ''} ${
                isSoldOut ? 'is-soldout' : ''
              }`.trim()}
              key={variant.id}
            >
              <input
                checked={isSelected}
                className="rv-sr-only"
                disabled={isSoldOut}
                name="rv-bundle"
                onChange={() => onSelectVariant(variant)}
                type="radio"
                value={variant.id}
              />

              {bundle.badge ? (
                <span className="rv-bundle__badge">{bundle.badge}</span>
              ) : null}

              <span className="rv-bundle__content">
                <span className="rv-bundle__radio" aria-hidden="true" />
                <span className="rv-bundle__text">
                  <span className="rv-bundle__title-row">
                    <span className="rv-bundle__title">{bundle.title}</span>
                    {pricing.savingAmount > 0 ? (
                      <span className="rv-bundle__save">
                        Save{' '}
                        <Money
                          as="span"
                          data={{
                            amount: pricing.savingAmount.toFixed(2),
                            currencyCode: pricing.price.currencyCode,
                          }}
                        />
                      </span>
                    ) : null}
                  </span>
                  {bundle.subtitle ? (
                    <span className="rv-bundle__subtitle">
                      {bundle.subtitle}
                    </span>
                  ) : null}
                  {isSoldOut ? (
                    <span className="rv-bundle__soldout">Sold out</span>
                  ) : bundle.freeShipping ? (
                    <span className="rv-bundle__shipping">
                      Includes FREE Shipping
                    </span>
                  ) : null}
                </span>
              </span>

              <span className="rv-bundle__pricing">
                <Money
                  as="span"
                  className="rv-bundle__price"
                  data={pricing.price}
                />
                {pricing.compareAt ? (
                  <s className="rv-bundle__compare">
                    <Money as="span" data={pricing.compareAt} />
                  </s>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

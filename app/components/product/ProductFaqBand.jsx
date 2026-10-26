import {ProductAccordion} from '~/components/product/ProductAccordion';
import {ShieldIcon} from '~/components/product/ProductIcons';
import {
  FINAL_CTA_GUARANTEE,
  FINAL_CTA_TEXT,
} from '~/lib/product-page-constants';

const FAQ_HEADING = 'Frequently Asked Questions';

/**
 * Tinted FAQ band with the final CTA.
 * @param {{
 *   faqs: Array<{question: string; answer: string}>;
 *   onCtaClick: () => void;
 * }} props
 */
export function ProductFaqBand({faqs = [], onCtaClick}) {
  return (
    <section className="rv-pdp-faq-band">
      <div className="rv-pdp-container">
        {faqs.length ? (
          <h2 className="rv-pdp-faq-band__title">{FAQ_HEADING}</h2>
        ) : null}

        {faqs.length ? (
          <ProductAccordion
            className="rv-pdp-faq-list"
            idPrefix="rv-pdp-faq"
            items={faqs}
            variant="faq"
          />
        ) : null}

        <div className="rv-pdp-final-cta-wrap">
          <button
            className="rv-pdp-final-cta"
            onClick={onCtaClick}
            type="button"
          >
            {FINAL_CTA_TEXT}
          </button>
          <p className="rv-pdp-final-cta__guarantee">
            <ShieldIcon size={16} />
            {FINAL_CTA_GUARANTEE}
          </p>
        </div>
      </div>
    </section>
  );
}

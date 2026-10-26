import {useState} from 'react';
import {ChevronRightIcon} from '~/components/product/ProductIcons';

/**
 * Accessible single-open accordion used by both the info rows and the FAQ band.
 * @param {{
 *   items: Array<{title?: string; body?: string; question?: string; answer?: string}>;
 *   idPrefix: string;
 *   variant?: 'info' | 'faq';
 *   className?: string;
 * }} props
 */
export function ProductAccordion({
  items = [],
  idPrefix,
  variant = 'info',
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(-1);

  if (!items.length) return null;

  return (
    <div
      className={`rv-acc rv-acc--${variant} ${className}`.trim()}
    >
      {items.map((item, index) => {
        const title = item.title ?? item.question ?? '';
        const body = item.body ?? item.answer ?? '';
        if (!title) return null;

        const isOpen = openIndex === index;
        const triggerId = `${idPrefix}-trigger-${index}`;
        const panelId = `${idPrefix}-panel-${index}`;

        return (
          <div
            className={`rv-acc__item ${isOpen ? 'is-open' : ''}`.trim()}
            key={triggerId}
          >
            <h3 className="rv-acc__heading">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="rv-acc__trigger"
                id={triggerId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                type="button"
              >
                <span>{title}</span>
                <ChevronRightIcon className="rv-acc__chevron" size={13} />
              </button>
            </h3>
            <div
              aria-hidden={!isOpen}
              aria-labelledby={triggerId}
              className="rv-acc__panel"
              id={panelId}
              role="region"
            >
              <div className="rv-acc__panel-inner">
                <p className="rv-acc__body">{body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

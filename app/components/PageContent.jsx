// Editable layout values for the Shopify page template.
export const PAGE_CONTENT_MAX_WIDTH = 672;
export const PAGE_TITLE_ALIGN = 'center';

const TITLE_ALIGNMENTS = new Set(['left', 'center']);

/**
 * Reusable title + rich-text body layout for Shopify pages.
 *
 * @param {{title: string, html: string}} props
 */
export function PageContent({title, html}) {
  const alignment = TITLE_ALIGNMENTS.has(PAGE_TITLE_ALIGN)
    ? PAGE_TITLE_ALIGN
    : 'center';

  return (
    <article
      className="rv-page"
      style={{'--rv-page-content-max-width': `${PAGE_CONTENT_MAX_WIDTH}px`}}
    >
      <div className="rv-page__inner">
        <h1 className={`rv-page__title rv-page__title--${alignment}`}>
          {title}
        </h1>
        <div className="rv-rte" dangerouslySetInnerHTML={{__html: html}} />
      </div>
    </article>
  );
}

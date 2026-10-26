import {Image, Money} from '@shopify/hydrogen';
import {useEffect, useId, useMemo, useRef, useState} from 'react';
import {Link, useFetcher, useNavigate} from 'react-router';
import {useAside} from '~/components/Aside';
import {urlWithTrackingParams} from '~/lib/search';

const SEARCH_ENDPOINT = '/search';
const MIN_QUERY_LENGTH = 2;
const MAX_PRODUCTS = 6;

const POPULAR_SEARCHES = ['Moringa', 'Beetroot', 'Electrolytes', 'Gummies'];

const EMPTY_ITEMS = {
  articles: [],
  collections: [],
  pages: [],
  products: [],
  queries: [],
};

const HTML_ENTITIES = {
  amp: '&',
  gt: '>',
  lt: '<',
  quot: '"',
  '#39': "'",
};

function decodeHtmlEntities(value) {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith('#')) {
      const code =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return HTML_ENTITIES[entity] || match;
  });
}

// Shopify returns highlighted query suggestions as a small HTML string
// (for example `<mark>gum</mark><span>mies</span>`). Render only the plain
// text and the match marker instead of injecting arbitrary HTML.
function renderStyledText(styledText) {
  if (typeof styledText !== 'string' || !styledText) return null;

  return styledText.split(/(<mark>[\s\S]*?<\/mark>)/g).map((part) => {
    if (!part) return null;

    const isMatch = part.startsWith('<mark>');
    const text = decodeHtmlEntities(part.replace(/<[^>]*>/g, ''));

    if (!text) return null;

    return isMatch ? (
      <mark key={part}>{text}</mark>
    ) : (
      <span key={part}>{text}</span>
    );
  });
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20l-4.2-4.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
    >
      <path
        d="M3 3l14 14M17 3L3 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SearchPanel() {
  const {type, close} = useAside();
  const expanded = type === 'search';
  const navigate = useNavigate();
  const fetcher = useFetcher({key: 'rv-search'});
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputId = useId();
  const resultsId = useId();

  const cleanTerm = term.trim();
  const showResults = expanded && cleanTerm.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!expanded) {
      setTerm('');
      setDebouncedTerm('');
      setActiveIndex(-1);
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  useEffect(() => {
    if (cleanTerm.length < MIN_QUERY_LENGTH) {
      setDebouncedTerm('');
      return;
    }

    const timeout = setTimeout(() => {
      setDebouncedTerm(cleanTerm);
    }, 250);

    return () => clearTimeout(timeout);
  }, [cleanTerm]);

  useEffect(() => {
    if (debouncedTerm.length < MIN_QUERY_LENGTH) return;

    void fetcher.submit(
      {q: debouncedTerm, limit: MAX_PRODUCTS, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  useEffect(() => {
    if (!expanded) return;

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, expanded]);

  const predictiveResult =
    fetcher.data?.type === 'predictive' ? fetcher.data.result : null;
  const dataMatches =
    Boolean(predictiveResult) && fetcher.data?.term === debouncedTerm;
  const isLoading =
    showResults &&
    (cleanTerm !== debouncedTerm ||
      (debouncedTerm.length >= MIN_QUERY_LENGTH &&
        (fetcher.state !== 'idle' || !dataMatches)));

  const items = useMemo(() => {
    if (!dataMatches || !predictiveResult?.items) return EMPTY_ITEMS;

    const resultItems = predictiveResult.items;
    const nodesOrSelf = (value) =>
      Array.isArray(value?.nodes)
        ? value.nodes
        : Array.isArray(value)
          ? value
          : [];

    return {
      articles: nodesOrSelf(resultItems.articles),
      collections: nodesOrSelf(resultItems.collections),
      pages: nodesOrSelf(resultItems.pages),
      products: nodesOrSelf(resultItems.products),
      queries: nodesOrSelf(resultItems.queries),
    };
  }, [dataMatches, predictiveResult]);
  const total = dataMatches ? predictiveResult.total : 0;

  const links = useMemo(() => {
    if (!dataMatches || isLoading) return [];

    const queries = Array.isArray(items.queries) ? items.queries : [];
    const products = Array.isArray(items.products) ? items.products : [];
    const collections = Array.isArray(items.collections)
      ? items.collections
      : [];
    const pages = Array.isArray(items.pages) ? items.pages : [];
    const articles = Array.isArray(items.articles) ? items.articles : [];

    return [
      ...queries.map((query) => ({
        id: `rv-search-query-${(query.text || '').replace(/[^a-zA-Z0-9_-]/g, '-')}`,
        href: `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query.text || '')}`,
      })),
      ...products.slice(0, MAX_PRODUCTS).map((product) => ({
        id: `rv-search-product-${product.id}`,
        href: urlWithTrackingParams({
          baseUrl: `/products/${product.handle}`,
          trackingParams: product.trackingParameters,
          term: debouncedTerm,
        }),
      })),
      ...collections.map((collection) => ({
        id: `rv-search-collection-${collection.id}`,
        href: urlWithTrackingParams({
          baseUrl: `/collections/${collection.handle}`,
          trackingParams: collection.trackingParameters,
          term: debouncedTerm,
        }),
      })),
      ...pages.map((page) => ({
        id: `rv-search-page-${page.id}`,
        href: urlWithTrackingParams({
          baseUrl: `/pages/${page.handle}`,
          trackingParams: page.trackingParameters,
          term: debouncedTerm,
        }),
      })),
      ...articles.map((article) => ({
        id: `rv-search-article-${article.id}`,
        href: urlWithTrackingParams({
          baseUrl: `/blogs/${article.blog?.handle || 'news'}/${article.handle}`,
          trackingParams: article.trackingParameters,
          term: debouncedTerm,
        }),
      })),
    ];
  }, [dataMatches, debouncedTerm, isLoading, items]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedTerm]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const active = links[activeIndex];
    if (!active) return;

    document.getElementById(active.id)?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex, links]);

  function goTo(href) {
    close();
    void navigate(href);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (activeIndex >= 0 && links[activeIndex]) {
      goTo(links[activeIndex].href);
      return;
    }

    if (!cleanTerm) return;
    goTo(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(cleanTerm)}`);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      if (!links.length) return;
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % links.length);
    } else if (event.key === 'ArrowUp') {
      if (!links.length) return;
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? links.length - 1 : index - 1));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0 && links[activeIndex]) {
        event.preventDefault();
        goTo(links[activeIndex].href);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  const activeDescendant =
    activeIndex >= 0 && links[activeIndex] ? links[activeIndex].id : undefined;

  return (
    <div
      aria-hidden={!expanded}
      className={`rv-search-layer ${expanded ? 'is-open' : ''}`}
    >
      <button
        aria-label="Close search"
        className="rv-search-backdrop"
        onClick={close}
        tabIndex={-1}
        type="button"
      />
      <div
        aria-labelledby={`${inputId}-heading`}
        aria-modal="true"
        className="rv-search-panel"
        ref={panelRef}
        role="dialog"
      >
        <div className="rv-container rv-search-panel__inner">
          <h2 className="sr-only" id={`${inputId}-heading`}>
            Search
          </h2>
          <form
            action={SEARCH_ENDPOINT}
            className="rv-search-form"
            method="get"
            onSubmit={handleSubmit}
            role="search"
          >
            <div className="rv-search-field">
              <label className="rv-search-field__label" htmlFor={inputId}>
                Search
              </label>
              <input
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                aria-controls={resultsId}
                aria-expanded={showResults}
                autoComplete="off"
                id={inputId}
                name="q"
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=" "
                ref={inputRef}
                role="combobox"
                type="search"
                value={term}
              />
              <button
                aria-label="Search"
                className="rv-search-field__submit"
                type="submit"
              >
                <SearchIcon />
              </button>
            </div>
            <button
              aria-label="Close search"
              className="rv-search-close"
              onClick={close}
              type="button"
            >
              <CloseIcon />
            </button>
          </form>

          <div aria-live="polite" className="rv-search-results" id={resultsId}>
            {!showResults ? (
              <PopularSearches onSelect={goTo} />
            ) : isLoading ? (
              <p className="rv-search-status">
                <span aria-hidden="true" className="rv-search-spinner" />
                Searching for &ldquo;{cleanTerm}&rdquo;&hellip;
              </p>
            ) : total === 0 ? (
              <div className="rv-search-empty">
                <p>
                  No results found for{' '}
                  <strong>&ldquo;{debouncedTerm}&rdquo;</strong>
                </p>
                <Link
                  className="rv-search-view-all"
                  onClick={close}
                  to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(debouncedTerm)}`}
                >
                  View all results
                </Link>
              </div>
            ) : (
              <div className="rv-search-card">
                {Array.isArray(items.queries) && items.queries.length ? (
                  <SearchSection title="Suggestions">
                    <ul className="rv-search-suggestions">
                      {(Array.isArray(items.queries) ? items.queries : []).map(
                        (query) => (
                          <li key={query.text}>
                            <Link
                              className="rv-search-suggestion"
                              id={`rv-search-query-${query.text.replace(
                                /[^a-zA-Z0-9_-]/g,
                                '-',
                              )}`}
                              onClick={close}
                              to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(
                                query.text,
                              )}`}
                            >
                              <span className="rv-search-suggestion-icon">
                                <SearchIcon />
                              </span>
                              <span className="rv-search-suggestion-text">
                                {query.styledText
                                  ? renderStyledText(query.styledText)
                                  : query.text}
                              </span>
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </SearchSection>
                ) : null}

                {items.products.length ? (
                  <SearchSection title="Products">
                    <ul className="rv-search-products">
                      {(Array.isArray(items.products) ? items.products : [])
                        .slice(0, MAX_PRODUCTS)
                        .map((product) => {
                          const variant =
                            product.selectedOrFirstAvailableVariant;
                          const image = variant?.image;
                          return (
                            <li key={product.id}>
                              <Link
                                className="rv-search-product"
                                id={`rv-search-product-${product.id}`}
                                onClick={close}
                                to={urlWithTrackingParams({
                                  baseUrl: `/products/${product.handle}`,
                                  trackingParams: product.trackingParameters,
                                  term: debouncedTerm,
                                })}
                              >
                                <span className="rv-search-product__media">
                                  {image ? (
                                    <Image
                                      alt={image.altText || product.title}
                                      aspectRatio="1/1"
                                      data={image}
                                      height={64}
                                      loading="lazy"
                                      width={64}
                                    />
                                  ) : null}
                                </span>
                                <span className="rv-search-product__body">
                                  <span className="rv-search-product__title">
                                    {product.title}
                                  </span>
                                  {variant?.price ? (
                                    <span className="rv-search-product__price">
                                      <Money data={variant.price} />
                                    </span>
                                  ) : null}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </SearchSection>
                ) : null}

                {Array.isArray(items.collections) &&
                items.collections.length ? (
                  <SearchSection title="Collections">
                    <ul className="rv-search-links">
                      {(Array.isArray(items.collections)
                        ? items.collections
                        : []
                      ).map((collection) => (
                        <li key={collection.id}>
                          <Link
                            className="rv-search-link"
                            id={`rv-search-collection-${collection.id}`}
                            onClick={close}
                            to={urlWithTrackingParams({
                              baseUrl: `/collections/${collection.handle}`,
                              trackingParams: collection.trackingParameters,
                              term: debouncedTerm,
                            })}
                          >
                            {collection.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </SearchSection>
                ) : null}

                {Array.isArray(items.pages) && items.pages.length ? (
                  <SearchSection title="Pages">
                    <ul className="rv-search-links">
                      {(Array.isArray(items.pages) ? items.pages : []).map(
                        (page) => (
                          <li key={page.id}>
                            <Link
                              className="rv-search-link"
                              id={`rv-search-page-${page.id}`}
                              onClick={close}
                              to={urlWithTrackingParams({
                                baseUrl: `/pages/${page.handle}`,
                                trackingParams: page.trackingParameters,
                                term: debouncedTerm,
                              })}
                            >
                              {page.title}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </SearchSection>
                ) : null}

                {Array.isArray(items.articles) && items.articles.length ? (
                  <SearchSection title="Articles">
                    <ul className="rv-search-links">
                      {(Array.isArray(items.articles)
                        ? items.articles
                        : []
                      ).map((article) => (
                        <li key={article.id}>
                          <Link
                            className="rv-search-link"
                            id={`rv-search-article-${article.id}`}
                            onClick={close}
                            to={urlWithTrackingParams({
                              baseUrl: `/blogs/${article.blog?.handle || 'news'}/${article.handle}`,
                              trackingParams: article.trackingParameters,
                              term: debouncedTerm,
                            })}
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </SearchSection>
                ) : null}

                <Link
                  className="rv-search-view-all"
                  onClick={close}
                  to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(debouncedTerm)}`}
                >
                  View all results for &ldquo;{debouncedTerm}&rdquo;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchSection({children, title}) {
  return (
    <section className="rv-search-section">
      <h3 className="rv-search-section__title">{title}</h3>
      {children}
    </section>
  );
}

function PopularSearches({onSelect}) {
  return (
    <div className="rv-search-popular">
      <p className="rv-search-popular__label">Popular searches</p>
      <ul>
        {POPULAR_SEARCHES.map((query) => (
          <li key={query}>
            <button
              className="rv-search-popular__item"
              onClick={() =>
                onSelect(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`)
              }
              type="button"
            >
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */

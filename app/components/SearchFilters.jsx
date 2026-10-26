import {useSearchParams} from 'react-router';
import {useEffect, useId, useRef, useState} from 'react';
import {
  findFilterForInput,
  parseFilterInput,
  stableStringify,
} from '~/lib/search';

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 1 5 5 9 1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <line x1="1" y1="1" x2="9" y2="9" />
      <line x1="9" y1="1" x2="1" y2="9" />
    </svg>
  );
}

function FilterDropdown({filter, appliedFilters, onApply}) {
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState(new Set());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const ref = useRef(null);
  const menuId = useId();

  useEffect(() => {
    function onClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function onEsc(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  useEffect(() => {
    setLocalValues(
      new Set(
        appliedFilters
          .filter((applied) => applied.filterId === filter.id)
          .map((applied) => stableStringify(parseFilterInput(applied.input))),
      ),
    );
  }, [appliedFilters, filter.id]);

  useEffect(() => {
    const priceInput = appliedFilters.find(
      (applied) => applied.filterId === filter.id && applied.input?.price,
    )?.input?.price;

    setMinPrice(priceInput?.min != null ? String(priceInput.min) : '');
    setMaxPrice(priceInput?.max != null ? String(priceInput.max) : '');
  }, [appliedFilters, filter.id]);

  const toggle = (value) => {
    const key = stableStringify(parseFilterInput(value.input));
    setLocalValues((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleApply = () => {
    const values = Array.from(localValues).map((key) => JSON.parse(key));
    onApply(filter.id, values);
    setOpen(false);
  };

  const handlePriceApply = () => {
    const price = {};

    if (minPrice !== '' && Number.isFinite(Number(minPrice))) {
      price.min = Math.max(0, Number(minPrice));
    }
    if (maxPrice !== '' && Number.isFinite(Number(maxPrice))) {
      price.max = Math.max(0, Number(maxPrice));
    }
    if (price.min != null && price.max != null && price.min > price.max) {
      [price.min, price.max] = [price.max, price.min];
    }

    onApply(filter.id, Object.keys(price).length ? [{price}] : []);
    setOpen(false);
  };

  if (filter.type === 'PRICE_RANGE') {
    return (
      <div className="rv-sfilters__dropdown" ref={ref}>
        <button
          type="button"
          className="rv-sfilters__trigger"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {filter.label}
          <ChevronIcon />
        </button>
        {open ? (
          <div
            className="rv-sfilters__panel rv-sfilters__panel--price"
            id={menuId}
          >
            <div className="rv-sfilters__price-row">
              <label className="rv-sfilters__price-field">
                <span>From</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </label>
              <label className="rv-sfilters__price-field">
                <span>To</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder=""
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="rv-sfilters__apply"
              onClick={handlePriceApply}
            >
              APPLY
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rv-sfilters__dropdown" ref={ref}>
      <button
        type="button"
        className="rv-sfilters__trigger"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {filter.label}
        <ChevronIcon />
      </button>
      {open ? (
        <div className="rv-sfilters__panel" id={menuId}>
          <ul className="rv-sfilters__list">
            {(filter.values || []).map((value) => {
              const key = stableStringify(parseFilterInput(value.input));
              const isChecked = localValues.has(key);
              const disabled = value.count === 0 && !isChecked;
              return (
                <li key={value.id}>
                  <label
                    className={`rv-sfilters__option ${disabled ? 'is-disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={disabled}
                      onChange={() => !disabled && toggle(value)}
                    />
                    <span>{value.label}</span>
                    <span className="rv-sfilters__count">({value.count})</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="rv-sfilters__apply"
            onClick={handleApply}
          >
            APPLY
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SearchFilters({filters = [], appliedFilters = []}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleApply = (filterId, values) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll('filter');
    next.delete('filter');

    for (const raw of existing) {
      let input;
      try {
        input = JSON.parse(raw);
      } catch {
        continue;
      }

      const key = stableStringify(input);
      const belongsToFilter =
        appliedFilters.some(
          (applied) =>
            applied.filterId === filterId &&
            stableStringify(applied.input) === key,
        ) || findFilterForInput(input, filters).filter?.id === filterId;

      if (!belongsToFilter) next.append('filter', raw);
    }

    for (const value of values) {
      next.append('filter', JSON.stringify(value));
    }

    setSearchParams(next);
  };

  const removeAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('filter');
    setSearchParams(next);
  };

  const removeFilter = (applied) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll('filter');
    const key = stableStringify(applied.input);
    let removed = false;

    next.delete('filter');
    for (const raw of existing) {
      let input;
      try {
        input = JSON.parse(raw);
      } catch {
        continue;
      }

      if (!removed && stableStringify(input) === key) {
        removed = true;
        continue;
      }
      next.append('filter', raw);
    }

    setSearchParams(next);
  };

  return (
    <div className="rv-sfilters">
      <div className="rv-sfilters__bar">
        <div className="rv-sfilters__left">
          <span className="rv-sfilters__filter-label">Filter:</span>
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.id}
              filter={filter}
              appliedFilters={appliedFilters}
              onApply={handleApply}
            />
          ))}
        </div>
        <div className="rv-sfilters__right">
          <SearchSortSelect />
        </div>
      </div>
      {appliedFilters.length ? (
        <div className="rv-sfilters__chips-row">
          <div className="rv-sfilters__chips">
            {appliedFilters.map((applied) => (
              <button
                key={`${applied.filterId || 'filter'}-${stableStringify(applied.input)}`}
                type="button"
                className="rv-sfilters__chip"
                onClick={() => removeFilter(applied)}
              >
                {applied.valueLabel}
                <CloseIcon />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rv-sfilters__remove-all"
            onClick={removeAll}
          >
            Remove all
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SearchSortSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort_by') || 'relevance';

  const updateSort = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'relevance') next.delete('sort_by');
    else next.set('sort_by', value);
    setSearchParams(next);
  };

  return (
    <div className="rv-ssort">
      <span className="rv-ssort__label">Sort by:</span>
      <select
        className="rv-ssort__select"
        value={sort}
        onChange={(e) => updateSort(e.target.value)}
        aria-label="Sort by"
      >
        <option value="relevance">Relevance</option>
        <option value="price-ascending">Price, low to high</option>
        <option value="price-descending">Price, high to low</option>
      </select>
      <ChevronIcon />
    </div>
  );
}

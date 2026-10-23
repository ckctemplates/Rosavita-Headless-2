import {useNavigate, useSearchParams} from 'react-router';
import {useEffect, useId, useRef, useState} from 'react';

function ChevronIcon() {
  return (
    <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 1 5 5 9 1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <line x1="1" y1="1" x2="9" y2="9" />
      <line x1="9" y1="1" x2="1" y2="9" />
    </svg>
  );
}

function FilterDropdown({filter, appliedFilters, onApply}) {
  const [open, setOpen] = useState(false);
  const [localValues, setLocalValues] = useState(new Set());
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
    const applied = new Set(
      appliedFilters
        .filter((af) => af.filterId === filter.id)
        .map((af) => JSON.stringify(af.input)),
    );
    setLocalValues(applied);
  }, [appliedFilters, filter.id]);

  const toggle = (value) => {
    const key = JSON.stringify(value.input);
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
          <div className="rv-sfilters__panel rv-sfilters__panel--price" id={menuId}>
            <div className="rv-sfilters__price-row">
              <label className="rv-sfilters__price-field">
                <span>From</span>
                <input type="number" placeholder="0" disabled />
              </label>
              <label className="rv-sfilters__price-field">
                <span>To</span>
                <input type="number" placeholder="" disabled />
              </label>
            </div>
            <button type="button" className="rv-sfilters__apply" onClick={() => setOpen(false)}>
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
            {filter.values.map((value) => {
              const key = JSON.stringify(value.input);
              const isChecked = localValues.has(key);
              const disabled = value.count === 0;
              return (
                <li key={value.id}>
                  <label className={`rv-sfilters__option ${disabled ? 'is-disabled' : ''}`}>
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
          <button type="button" className="rv-sfilters__apply" onClick={handleApply}>
            APPLY
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SearchFilters({filters = [], productFilters = []}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const appliedFilters = productFilters.map((pf) => ({
    filterId: pf.id,
    label: pf.label,
    input: pf.input,
    valueLabel: pf.label,
  }));

  const handleApply = (filterId, values) => {
    const next = new URLSearchParams(searchParams);
    next.delete('filter');
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

  const removeFilter = (idx) => {
    const filters = searchParams.getAll('filter');
    const next = new URLSearchParams(searchParams);
    next.delete('filter');
    filters.forEach((f, i) => {
      if (i !== idx) next.append('filter', f);
    });
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
              appliedFilters={productFilters.filter((pf) => pf.id === filter.id).map((pf) => ({filterId: pf.id, input: pf.input}))}
              onApply={handleApply}
            />
          ))}
        </div>
        <div className="rv-sfilters__right">
          <SearchSortSelect />
        </div>
      </div>
      {productFilters.length ? (
        <div className="rv-sfilters__chips-row">
          <div className="rv-sfilters__chips">
            {productFilters.map((pf, idx) => (
              <button
                key={idx}
                type="button"
                className="rv-sfilters__chip"
                onClick={() => removeFilter(idx)}
              >
                {pf.label}
                <CloseIcon />
              </button>
            ))}
          </div>
          <button type="button" className="rv-sfilters__remove-all" onClick={removeAll}>
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

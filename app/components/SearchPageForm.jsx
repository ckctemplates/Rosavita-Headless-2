import {Form, useNavigate} from 'react-router';
import {useEffect, useRef, useState} from 'react';

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <line x1="3" y1="3" x2="11" y2="11" />
      <line x1="11" y1="3" x2="3" y2="11" />
    </svg>
  );
}

export function SearchPageForm({term = ''}) {
  const [value, setValue] = useState(term);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setValue(term);
  }, [term]);

  const handleClear = () => {
    setValue('');
    navigate('/search');
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <Form action="/search" method="get" role="search" className="rv-searchpage__form">
      <div className="rv-searchpage__field">
        <label htmlFor="rv-searchpage-input" className="rv-searchpage__label">Search</label>
        <input
          id="rv-searchpage-input"
          ref={inputRef}
          type="search"
          name="q"
          className="rv-searchpage__input"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder=" "
        />
        <div className="rv-searchpage__actions">
          {value ? (
            <button
              type="button"
              className="rv-searchpage__clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <span className="rv-searchpage__clear-circle">
                <ClearIcon />
              </span>
            </button>
          ) : null}
          <span className="rv-searchpage__divider" aria-hidden="true" />
          <button type="submit" className="rv-searchpage__submit" aria-label="Search">
            <SearchIcon />
          </button>
        </div>
      </div>
    </Form>
  );
}

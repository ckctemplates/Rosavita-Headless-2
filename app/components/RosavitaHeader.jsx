import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAside} from '~/components/Aside';
import {useOptimisticCart} from '@shopify/hydrogen';

function SearchIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7.5" />
      <line x1="20.5" y1="20.5" x2="16.2" y2="16.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h12l1 14H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function CartBadge({count}) {
  const {open} = useAside();

  return (
    <button
      type="button"
      className="rv-icon-btn rv-cart-btn"
      onClick={() => open('cart')}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <BagIcon />
      {count > 0 && <span className="rv-cart-count">{count}</span>}
    </button>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

export function RosavitaHeader({cart}) {
  const {open} = useAside();

  return (
    <header className="rv-header">
      <div className="rv-container rv-header__inner">
        <div className="rv-header__left">
          <button
            type="button"
            className="rv-icon-btn rv-header__search-mobile"
            onClick={() => open('search')}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <NavLink
            to="/"
            end
            className="rv-header__logo rv-header__logo--desktop"
            prefetch="intent"
          >
            Rosavita
          </NavLink>
        </div>

        <div className="rv-header__center">
          <NavLink
            to="/"
            end
            className="rv-header__logo rv-header__logo--mobile"
            prefetch="intent"
          >
            Rosavita
          </NavLink>
          <nav className="rv-header__nav" aria-label="Main navigation">
            <NavLink to="/" prefetch="intent">
              Shop Rosavita
            </NavLink>
            <NavLink to="/products/beetroot" prefetch="intent">
              Beetroot
            </NavLink>
          </nav>
        </div>

        <div className="rv-header__actions">
          <button
            type="button"
            className="rv-icon-btn rv-header__search-desktop"
            onClick={() => open('search')}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <NavLink
            to="/account"
            className="rv-icon-btn"
            aria-label="Account"
            prefetch="intent"
          >
            <UserIcon />
          </NavLink>
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

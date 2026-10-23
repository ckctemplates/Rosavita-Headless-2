import {Await} from 'react-router';
import {Suspense} from 'react';
import {Aside} from '~/components/Aside';
import {RosavitaFooter} from '~/components/RosavitaFooter';
import {RosavitaHeader} from '~/components/RosavitaHeader';
import {CartMain} from '~/components/CartMain';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {SearchPanel} from '~/components/SearchPanel';

export function RosavitaPageLayout({cart, children = null, isLoggedIn}) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchPanel />
      <AnnouncementBar />
      <RosavitaHeader cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <RosavitaFooter />
    </Aside.Provider>
  );
}

function CartAside({cart}) {
  return (
    <Aside
      className="rv-cart-overlay"
      labelledBy="rv-cart-title"
      panelClassName="rv-cart-panel"
      showHeader={false}
      type="cart"
    >
      <Suspense fallback={<CartDrawerLoading />}>
        <Await resolve={cart}>
          {(resolvedCart) => {
            return <CartMain cart={resolvedCart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartDrawerLoading() {
  return (
    <div className="rv-cart rv-cart--loading" aria-busy="true">
      <div className="rv-cart__header">
        <h2 className="rv-cart__title">Your cart</h2>
      </div>
      <div className="rv-cart__scroll">
        <p>Loading cart...</p>
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

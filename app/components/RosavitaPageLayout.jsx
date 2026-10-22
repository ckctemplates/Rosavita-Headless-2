import {Await} from 'react-router';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {RosavitaFooter} from '~/components/RosavitaFooter';
import {RosavitaHeader} from '~/components/RosavitaHeader';
import {CartMain} from '~/components/CartMain';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {SearchFormPredictive} from '~/components/SearchFormPredictive';

export function RosavitaPageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <AnnouncementBar />
      <RosavitaHeader cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <RosavitaFooter />
    </Aside.Provider>
  );
}

function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>
      </div>
    </Aside>
  );
}

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

import {Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Header, HeaderMenu} from './Header';
import {Footer} from './Footer';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {Aside, DropDown, CloseAside} from '~/components/Aside';
import searchIcon from '~/../public/search-icon.svg';
import {useCart} from './CartProvider';

export function LayoutLight({cart, children = null, footer, header, isLoggedIn, newsletterLink}) {
  const {shop, menu} = header;
  return (
    <>
      <MobileMenuAside menu={menu} />
      <SearchDropDown />
      <div className="flex flex-col min-h-screen antialiased bg-white">
        <Header cart={cart} shop={shop} menu={menu} />

        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        <Footer menu={footer.menu} newsletterLink={newsletterLink} />
      </div>
    </>
  );
}

export function LayoutDark({cart, children = null, footer, header, isLoggedIn, newsletterLink}) {
  const {shop, menu} = header;
  return (
    <>
      <MobileMenuAside menu={menu} />
      <SearchDropDown />
      <div className="flex flex-col min-h-screen antialiased bg-black text-white">
        {/* <Header cart={cart} shop={shop} menu={menu} /> */}

        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        <Footer menu={footer.menu} newsletterLink={newsletterLink} />
      </div>
    </>
  );
}

function CartBadge({count}) {
  // return <a href="#cart-aside">Cart {count}</a>;
  return <div>{count}</div>;
}

function CartToggle() {
  const cart = useCart();
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function SearchDropDown() {
  return (
    <DropDown id="search-aside" heading="SEARCH" className="w-screen">
      <div className="search-bar-background"></div>
      <div className=" predictive-search ">
        <div className="search-form flex  justify-center align-center mx-auto">
          <PredictiveSearchForm className=" my-5 mx-5 px-5">
            {({fetchResults, inputRef}) => (
              <div className="form-body flex grow w-11/12 justify-center ">
                <div className="input-body">
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search"
                    ref={inputRef}
                    type="search"
                    onKeyDown={fetchResults}
                    className=""
                    id="prediction-search-input"
                  />
                  {/* <span className="search-name-tag">Search</span> */}
                </div>
                &nbsp;
                <button type="submit">
                  <img src={searchIcon} />{' '}
                </button>
              </div>
            )}
          </PredictiveSearchForm>
        </div>
        <PredictiveSearchResults />
      </div>

      <CloseAside />
    </DropDown>
  );
}

function MobileMenuAside({menu}) {
  return (
    <Aside id="mobile-menu-aside" heading=">Jiagia Studios<">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}

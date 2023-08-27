import {Link} from '@remix-run/react'
import {json} from '@shopify/remix-oxygen';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {Header} from './Header';
import {Footer} from './Footer';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {Aside} from '~/components/Aside';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
    const {shop, menu} = header;
    return (
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        {/* <SearchAside /> */}
        <Header cart={cart} shop={shop} menu={menu} />
        <main
          role="main"
          id="mainContent"
          className="flex-grow p-6 md:p-8 lg:p-12"
        >
          {children}
        </main>
        <Footer menu={footer.menu} />
      </div>
    );
  }

  function CartBadge({count}) {
    // return <a href="#cart-aside">Cart {count}</a>;
    return <div>{count}</div>;
  }
  
  function CartToggle({cart}) {
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

  export function HeaderMenu({menu, viewport}) {
    const [root] = useMatches();
    const publicStoreDomain = root?.data?.publicStoreDomain;
    const className = `header-menu-${viewport}`;
  
    function closeAside(event) {
      if (viewport === 'mobile') {
        event.preventDefault();
        window.location.href = event.currentTarget.href;
      }
    }
  
    return (
      <nav className={className} role="navigation">
        {viewport === 'mobile' && (
          <NavLink
            end
            onClick={closeAside}
            prefetch="intent"
            // style={activeLinkStyle}
            to="/"
          >
            Home
          </NavLink>
        )}
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
  
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="header-menu-item"
              end
              key={item.id}
              onClick={closeAside}
              prefetch="intent"
            //   style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  function activeLinkStyle({isActive, isPending}) {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      color: isPending ? 'grey' : 'black',
    };
  }
  

  function SearchAside() {
    return (
      <Aside id="search-aside" heading="SEARCH">
        <div className="predictive-search">
          <br />
          <PredictiveSearchForm>
            {({fetchResults, inputRef}) => (
              <div>
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search"
                  ref={inputRef}
                  type="search"
                />
                &nbsp;
                <button type="submit">Search</button>
              </div>
            )}
          </PredictiveSearchForm>
          <PredictiveSearchResults />
        </div>
      </Aside>
    );
  }
  
  function MobileMenuAside({menu}) {
    return (
      <Aside id="mobile-menu-aside" heading="MENU">
        <HeaderMenu menu={menu} viewport="mobile" />
      </Aside>
    );
  }
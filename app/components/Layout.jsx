import {Link} from '@remix-run/react'
import {json} from '@shopify/remix-oxygen';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Header} from './Header';
import {Footer} from './Footer';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {Aside, DropDown, CloseAside} from '~/components/Aside';
import searchIcon from "~/../public/search-icon.svg";
import {useCart} from './CartProvider';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
    const {shop, menu} = header;
    const [show, setShow] = useState(false);

    function showSearch() {
      setShow(true);
    }

    function closeSearch() {
      setShow(false);
    }

    return (
      <>
      <MobileMenuAside menu={menu} />
      <SearchDropDown />
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
      
        <Header cart={cart} shop={shop} menu={menu} showSearch={showSearch} />
        
        <main
          role="main"
          id="mainContent"
          className="flex-grow p-6 md:p-8 lg:p-12"
        >
          {children}
        </main>
        <Footer menu={footer.menu} />
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
  

  function SearchDropDown() {
    return (
      <DropDown id="search-aside" heading="SEARCH" className="w-screen">
        <div className="search-bar-background"></div>
        <div className=" predictive-search ">
          <div className='search-form flex  justify-center align-center mx-auto'>
            <PredictiveSearchForm className=" my-5 mx-5 px-5">
              {({fetchResults, inputRef}) => (
                <div className= "form-body flex grow w-11/12 justify-center ">
                  <div className='input-body'>
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
                  <img src={searchIcon} /> </button>
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
      <Aside id="mobile-menu-aside" heading="MENU">
        <HeaderMenu menu={menu} viewport="mobile" />
      </Aside>
    );
  }
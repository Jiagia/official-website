import {Link} from '@remix-run/react'
import {json} from '@shopify/remix-oxygen';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {Header} from './Header';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
    const {shop, menu} = header;
    return (
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <header
          role="banner"
          className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm`}
        >
          <div className="flex gap-12">
            <a className="font-bold" href="/">
              {shop.name}
            </a>

            <HeaderMenu menu={menu} viewport="desktop" />
            <Header cart={cart} />
            {/* <Link to="/cart">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                >
                <title>Bag</title>
                <path
                    fillRule="evenodd"
                    d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
                ></path>
                </svg>
                <CartToggle cart={cart} />
            </Link> */}
          </div>
        </header>
  
        <main
          role="main"
          id="mainContent"
          className="flex-grow p-6 md:p-8 lg:p-12"
        >
          {children}
        </main>
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
  
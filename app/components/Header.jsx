import {Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';

export function Header({cart, shop, menu, showSearch}) {
  return (
    <header
      role="banner"
      className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 
          justify-center w-full leading-none gap-4 antialiased transition shadow-sm`}
    >
      <div className="flex items-center justify-between w-4/5 gap-12">
        <a className="font-bold" href="/">
          {shop.name}
        </a>
        <HeaderMenu menu={menu} viewport="desktop" />
        <SearchToggle showSearch={showSearch}/>
        <CartToggle cart={cart} />
      </div>
    </header>
  );
}

function CartBadge({count}) {
  // return <a href="#cart-aside">Cart {count}</a>;
  return (
    <div>
      <Link to="/cart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          fill="currentColor"
          className="w-10 h-10"
        >
          <title>Bag</title>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 
                5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z"
          ></path>
        </svg>
        <div className="">{count}</div>
      </Link>
    </div>
  );
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

function HeaderMenu({menu, viewport}) {
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
          style={activeLinkStyle}
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
            style={activeLinkStyle}
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

function SearchToggle({showSearch}) {
  // return <a href="#search-aside">Search</a>;
  return <button onClick={showSearch}>Search</button>;
}
import {Link} from '@remix-run/react';
import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {SocialIcon} from './Footer';

export function Header({cart, shop, menu}) {
  return (
    <header
      role="banner"
      className={`header flex bg-white items-center h-16 p-6 md:p-8 lg:p-12 sticky z-40 top-0 justify-start w-full leading-none gap-4 antialiased transition`}
    >
      <nav className="flex gap-12 align-middle items-center justify-start content-start max-w-full w-11/12 ">
        <HeaderMenuMobileToggle />
        <NavLink
          id="logo"
          to="/"
          end
          className="shop-name font-black"
          prefetch="intent"
          // style={activeLinkStyle}
        >
          {'>Jiagia Studios<'}
        </NavLink>
        <HeaderMenuItem item={menu.items[0]} />
        <HeaderMenuItem item={menu.items[1]} />

        {menu.items[2] ? <HeaderMenuItem item={menu.items[2]} /> : null}
        {menu.items[3] ? <HeaderMenuItem item={menu.items[3]} /> : null}

        <nav className="header-ctas" role="navigation">
          {/* <SearchToggle /> */}
          <CartToggle cart={cart} />
        </nav>
      </nav>
    </header>
  );
}

export function HeaderCenter({cart, shop, menu}) {
  return (
    <>
    <div style={{height: "50px"}}></div>
    
    <header
      role="banner"
      className={`bg-black items-center z-40 top-0 
          p-4 w-full leading-none gap-4 antialiased transition`}
    >
      
      <nav className="flex flex-col gap-3 align-middle items-center justify-center content-start text-center w-full ">
        {/* <HeaderMenuMobileToggle /> */}
        <NavLink
          id="logo"
          to="/"
          end
          className="text-4xl md:text-6xl"
          prefetch="intent"
        >
          {'> Jiagia Studios <'}
        </NavLink>
        <h4>EXPLORERS OF THE DAYDREAM UNIVERSE </h4>
        <nav className='flex flex-row gap-6 md:gap-14 mt-8'>
          {menu.items.map((item, i) => <HeaderMenuItem item={item} key={i} colorMode="dark"/>)}

          
          {/* <HeaderMenuItem item={menu.items[0]} />
          <HeaderMenuItem item={menu.items[1]} />

          {menu.items[2] ? <HeaderMenuItem item={menu.items[2]} /> : null}
          {menu.items[3] ? <HeaderMenuItem item={menu.items[3]} /> : null} */}
        </nav>
        

        {/* <nav className="header-ctas" role="navigation">
          <SearchToggle />
          <CartToggle cart={cart} />
        </nav> */}
      </nav>
    </header>
    </>
  );
}

function CartBadge({count}) {
  // return <a href="#cart-aside">Cart {count}</a>;
  return (
    <div className="cart-badge">
      <Link to="/cart">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          fill="currentColor"
          className={`w-10 h-10`}
        >
          <title>Bag</title>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 
                5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z"
          ></path>
        </svg>
        {count ? (
          <div
            className={'cart-count rounded-full w-5 h-5 text-center leading-5'}
          >
            {count}
          </div>
        ) : null}
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

export function HeaderMenu({menu, viewport}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  const FBLink = 'https://www.facebook.com/profile.php?id=100083105601746';
  const IGLink = 'https://www.instagram.com/jiagia_studios/';
  const XLink = 'https://twitter.com/jiagia_studios';

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {/* {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )} */}
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
      {viewport === 'mobile' && (
        <div className="justify-self-center pt-32 md:pr-20 md:pt-0">
          <SocialIcon FacebookLink={FBLink} InstaLink={IGLink} XLink={XLink} />
        </div>
      )}
    </nav>
  );
}

function HeaderMenuItem({item, colorMode = 'light'}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  if (!item.url) return null;

  // if the url is internal, we strip the domain
  const url =
    item.url.includes('jiagia.com') || item.url.includes(publicStoreDomain)
      ? new URL(item.url).pathname
      : item.url;
  return (
    <NavLink
      className={`header-menu-item md:text-lg ${colorMode == "dark" ? "text-base" : "text-lg header-menu-desktop"}`}
      end
      key={item.id}
      prefetch="intent"
      style={activeLinkStyle}
      to={url}
    >
      {item.title}
    </NavLink>
  );
}

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bolder' : 'normal',
    // color: isPending ? 'grey' : 'black',
  };
}

function SearchToggle() {
  return (
    <a href="#search-aside">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="20px"
        height="20px"
      >
        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
      </svg>
    </a>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <div className="header-menu-mobile-toggle">
      <a href="#mobile-menu-aside">
        <h3>☰</h3>
      </a>
    </div>
  );
}

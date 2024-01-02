import {defer, json} from '@shopify/remix-oxygen';
import {useRef, useEffect, useState} from 'react';
// import {useShopifyCookies} from '@shopify/hydrogen';
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
  AnalyticsPageType,
} from '@shopify/hydrogen';
import {CartProvider, useCart} from '@shopify/hydrogen-react';
// import {Seo} from `@shopify/hydrogen`;
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useActionData,
  useLocation,
} from '@remix-run/react';

import appStyles from './styles/app.css';
import tailwindCss from './styles/tailwind.css';
import favicon from '../public/logo-square.png';
import {Layout} from './components/Layout';
// import {usePageAnalytics} from './utils';
// import {CartProvider} from './components/CartProvider';
import {usePageAnalytics} from '~/hooks/usePageAnalytics';
// import KlaviyoOnsite from './components/klaviyo/KlaviyoOnsite.client';
import {CookieBannerToggle, CookieForm} from './components/Cookie';

export const links = () => {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Jomolhari',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Poppins',
    },
    {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Inter'},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
};

// export const handle = {
//   seo: {
//     title: 'Snowdevil',
//     titleTemplate: '%s - A custom Hydrogen storefront',
//     description:
//       'Hydrogen is a React-based framework for building headless storefronts on Shopify.',
//   },
// };

export async function loader({context}) {
  const {storefront, session, cart} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const cookieConsent = await session.get('cookieConsent');
  console.log(cookieConsent);
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    customerAccessToken,
    session,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      cart: cartPromise,
      footer: await footerPromise,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
      cookieConsent,
      analytics: {
        pageType: AnalyticsPageType.home,
      },
    },
    {headers},
  );
}

export async function action({request, context}) {
  const {session} = context;
  const body = await request.formData();
  const consent = body.get('consent');

  const headers = new Headers();

  // update session consent variable
  session.set('cookieConsent', consent);

  // update session & need to return headers
  headers.append('Set-Cookie', await session.commit());

  return json(consent, {headers});
}

export default function App() {
  const data = useLoaderData();
  // need to obtain userconsent somehow
  const hasUserConsent = data.cookieConsent == 'true' || false;
  console.log(hasUserConsent);

  useShopifyCookies({hasUserConsent});

  const location = useLocation();
  const lastLocationKey = useRef('');
  const pageAnalytics = usePageAnalytics({hasUserConsent});

  useEffect(() => {
    // Filter out useEffect running twice
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
      shopId: data.header.shop.id,
    };

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });
  }, [location, pageAnalytics]);

  // show cookie consent form if consent is undefined
  const cookieConsent = data.cookieConsent;
  console.log('cookieConsent', cookieConsent);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/ntq8pat.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/wyv0dnu.css"
        ></link>
        {/* <Seo /> needs to be before <Meta /> and <Link /> */}
        {/* <Seo /> */}
        <Meta />
        <Links />
        <script
          async
          type="text/javascript"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=QRiSq4"
        ></script>
      </head>
      <body>
        {/* <CartProvider> */}
        {/* <Layout {...data} > */}
        <Outlet />
        {/* </Layout> */}
        {!cookieConsent ? <CookieForm /> : null}
        {/* <CookieForm /> */}
        <ScrollRestoration />
        <Scripts />
        {/* </CartProvider> */}
      </body>
    </html>
  );
}

// const LAYOUT_QUERY = `#graphql
//   query layout {
//     shop {
//       name
//       description
//     }
//   }
// `;

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```ts
 * //
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 *  );
 *  ```
 *  */
async function validateCustomerAccessToken(customerAccessToken, session) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }
  const expiresAt = new Date(customerAccessToken.expiresAt);
  const dateNow = new Date();
  const customerAccessTokenExpired = expiresAt < dateNow;
  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

import {defer, json} from '@shopify/remix-oxygen';
import {useRef, useEffect, useState} from 'react';
// import {useShopifyCookies} from '@shopify/hydrogen';
import { AnalyticsPageType } from '@shopify/hydrogen';
import {CartProvider, useCart} from '@shopify/hydrogen-react';
// import {Seo} from `@shopify/hydrogen`;
import {
  Outlet,
  useLoaderData,
  useActionData,
  useLocation,
} from '@remix-run/react';
import {Layout} from '../components/Layout';
import {usePageAnalytics} from '~/hooks/usePageAnalytics';


export async function loader({context}) {
  const {storefront, session, cart} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const cookieConsent = await session.get('cookieConsent');
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

export default function DarkLayout() {
  const data = useLoaderData();

  return (
    <div className='dark'>
      <Layout {...data} colorMode="dark" >
        <Outlet />
      </Layout>
    </div>
    
  )
}

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

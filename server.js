// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  createCookieSessionStorage,
} from '@shopify/remix-oxygen';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(request, env, executionContext) {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = (p) => executionContext.waitUntil(p);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
      ]);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      // const cart = createCartHandler({
      //   storefront, // storefront is created by the createStorefrontClient
      //   getCartId: cartGetIdDefault(request.headers),
      //   setCartId: cartSetIdDefault({
      //     maxage: 60 * 60 * 24 * 365, // One year expiry
      //   }),
        
      // });

      
      
      /**
       * cartQueryFragment requirements:
       *
       * - Must be named `CartApiQuery`
       * - Only have access to the following query variables:
       *   - $cartId: ID!
       *   - $country: CountryCode
       *   - $language: LanguageCode
       *   - $numCartLines: Int
       **/
      
      const CART_QUERY_FRAGMENT = `#graphql
        fragment CartApiQuery on Cart {
          metafield(namespace: "custom", key: "gift") {
            value
          }
          id
          checkoutUrl
          totalQuantity
          note
          deliveryGroups(first: 1) {
            nodes {
              id
              deliveryOptions {
                handle
                title
                code
                estimatedCost {
                  amount
                  currencyCode
                }
              }
              selectedDeliveryOption {
                handle
              }
            }
          }
          buyerIdentity {
            countryCode
            customer {
              id
              email
              firstName
              lastName
              displayName
            }
            email
            phone
          }
          lines(first: $numCartLines) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  amountPerQuantity {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    availableForSale
                    compareAtPrice {
                      ...CartApiMoney
                    }
                    price {
                      ...CartApiMoney
                    }
                    requiresShipping
                    title
                    image {
                      ...CartApiImage
                    }
                    product {
                      handle
                      title
                      id
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              ...CartApiMoney
            }
            totalAmount {
              ...CartApiMoney
            }
            totalDutyAmount {
              ...CartApiMoney
            }
            totalTaxAmount {
              ...CartApiMoney
            }
          }
          note
          attributes {
            key
            value
          }
          discountCodes {
            applicable
            code
          }
        }
      
        fragment CartApiMoney on MoneyV2 {
          currencyCode
          amount
        }
      
        fragment CartApiImage on Image {
          id
          url
          altText
          width
          height
        }
      `;
      
      const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault({
          maxage: 60 * 60 * 24 * 365, // One year expiry
        }),
        // cartQueryFragment: CART_QUERY_FRAGMENT, // Your custom cart query fragment
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session, 
          waitUntil,
          storefront, 
          env, 
          cart,
        }),
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class HydrogenSession {
  sessionStorage;
  session;
  constructor(sessionStorage, session) {
    this.sessionStorage = sessionStorage;
    this.session = session;
  }

  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  get(key) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key, value) {
    this.session.flash(key, value);
  }

  unset(key) {
    this.session.unset(key);
  }

  set(key, value) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}

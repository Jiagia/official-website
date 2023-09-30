import {
  AnalyticsEventName,
  CartForm,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {usePageAnalytics} from '~/hooks/usePageAnalytics';

// import {CartForm} from '@shopify/hydrogen';
// import {useEffect} from 'react';

// export function AddToCartButton({lines, className=''}) {
//   return (
//     <CartForm
//       route="/cart"
//       action={CartForm.ACTIONS.LinesAdd}
//       inputs={
//         {lines}
//       }
//     >
//       <button className={className}>
//         Add to cart
//       </button>
//     </CartForm>
//   );
// }

function AddToCartAnalytics({
  fetcher,
  children,
}) {
  // Data from action response
  const fetcherData = fetcher.data;
  // Data in form inputs
  const formData = fetcher.formData;
  // Data from loaders
  const pageAnalytics = usePageAnalytics({hasUserConsent: true});

  useEffect(() => {
    if (formData) {
      const cartData = {};
      const cartInputs = CartForm.getFormInput(formData);

      try {
        // Get analytics data from form inputs
        if (cartInputs.inputs.analytics) {
          const dataInForm = JSON.parse(
            String(cartInputs.inputs.analytics),
          );
          Object.assign(cartData, dataInForm);
        }
      } catch {
        // do nothing
      }

      // If we got a response from the add to cart action
      if (Object.keys(cartData).length && fetcherData) {
        const addToCartPayload = {
          ...getClientBrowserParameters(),
          ...pageAnalytics,
          ...cartData,
          cartId: fetcherData.cart.id,
          shopId: "gid://shopify/Shop/75378688295"
        };

        sendShopifyAnalytics({
          eventName: AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [fetcherData, formData, pageAnalytics]);
  return <>{children}</>;
}

export function AddToCartButton({
  children,
  lines,
  productAnalytics,
  className = '',
  disabled = false
}) {
  const analytics = {
    products: [productAnalytics]
  };

  return (
    <CartForm
      route="/cart"
      inputs={
        {lines}
      }
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher) => {
        return (
          <AddToCartAnalytics fetcher={fetcher}>
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              disabled={disabled ?? fetcher.state !== 'idle'}
              className = {className}
            >
              Add to cart
              {children}
            </button>
          </AddToCartAnalytics>
        );
      }}
    </CartForm>
  );
}


export function UpdateCartItemsButton({lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={
        {lines}
      }
    >
      <button>
        Update cart
      </button>
    </CartForm>
  );
}


export function RemoveCartItemButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={
        {lineIds}
      }
    >
      <button>
        Remove items
      </button>
    </CartForm>
  );
}


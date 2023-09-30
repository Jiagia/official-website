import {createContext, useContext, useEffect} from "react";
// import {Cart} from '@shopify/hydrogen-react/storefront-api-types';
import {useFetcher} from "@remix-run/react";

const CartContext = createContext(undefined);

export function CartProvider({children}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data || fetcher.state === 'loading') return;

    fetcher.load('/api/cart');
  }, [fetcher]);

  return <CartContext.Provider value={fetcher.data}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

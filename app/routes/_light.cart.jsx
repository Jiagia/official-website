import {Link, useLoaderData, useActionData, useFetcher} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import {CartLineItems, CartActions, CartSummary, CartError} from '~/components/Cart';

var error = null;

export async function action({request, context}) {
  const {cart, session} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let result;

  switch(action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
      case CartForm.ACTIONS.MetafieldsSet:
        result = await cart.setMetafields(inputs.metafields);
        break;
    case CartForm.ACTIONS.NoteUpdate:
        const note = String(formData.get('note') || '');
        result = await cart.updateNote(note);
        break;
    case CartForm.ACTIONS.AttributesUpdateInput:
        result = await cart.updateAttributes(inputs.attributes);
        break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
        const formDiscountCode = formData.get('discountCode');
    
        // User inputted discount code
        const discountCodes = (
            formDiscountCode ? [formDiscountCode] : []
        );
    
        // Combine with discount codes already applied on cart
        discountCodes.push(...inputs.discountCodes);
    
        result = await cart.updateDiscountCodes(discountCodes);
        break;
    case CartForm.ACTIONS.SelectedDeliveryOptionsUpdate:
        result = await cart.updateSelectedDeliveryOption(inputs.selectedDeliveryOptions);
        break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  // The Cart ID might change after each mutation, so update it each time.
  const headers = cart.setCartId(result.cart.id);

  const cartId = await session.get('cartId');

  return json(
    result,
    {status: 200, 
      headers,
      analytics: {
        cartId,
      },},
  );
}

export async function loader({context}) {
  const {cart} = context;
  
  return json({cart: await cart.get()});
}

export default function Cart() {
  // const result = useActionData();
  const {cart} = useLoaderData();
  const fetcher = useFetcher();

  console.log(cart?.quantity);
  // console.log(fetcher.data);

  const errors = fetcher.data?.errors;
  // console.log(errors);

  if (cart?.totalQuantity > 0)
    return (
      <>
        <div className="w-full text-center">
          <h2>&gt; Cart &lt;</h2>
        </div>

          <div className="w-full max-w-6xl mx-auto pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12">
          
          <div className="flex-grow md:translate-y-4">
            <CartLineItems linesObj={cart.lines} fetcher={fetcher}/>
          </div>
          <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-[65px] grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-md w-full">
            <div className="text-red-600 text-sm"></div>
            <CartError errors={errors} />
            <CartSummary cost={cart.cost} />
            <CartActions checkoutUrl={cart.checkoutUrl} />

          </div>
        </div>
      </>
    );

      
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-fit">
      <img src="https://cdn.shopify.com/s/files/1/0753/7868/8295/files/cart.png?v=1709820108" />
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Link
        to="/collections/all"
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        BACK TO STORE
      </Link>
    </div>
  );
}

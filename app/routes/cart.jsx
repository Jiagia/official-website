import {Link, useLoaderData, useActionData, useFetcher} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {CartForm} from '@shopify/hydrogen';
import {CartLineItems, CartActions, CartSummary} from '~/components/Cart';

var error = null;

export async function loader({context}) {
  const {cart} = context;
  
  return json({cart: await cart.get()});
}
 

export async function action({request, context}) {
  const {cart} = context;

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
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  // The Cart ID might change after each mutation, so update it each time.
  const headers = cart.setCartId(result.cart.id);


  console.log('1');
  console.log(result);
  // alert(result.errors[0]?.message);
  error = result.errors;

  if (error.length > 0) {
    var message = error[0].message;
    // return message;
    console.log(error[0].message);
    // invariant(false, error[0].message);
    // throw new Error(message);
  }
  return json(
    result,
    {status: 200, headers},
  );
}

export default function Cart() {
  // const result = useActionData();
  const {cart} = useLoaderData();
  const fetcher = useFetcher();
  console.log(cart);

  // console.log(cart);
  console.log(fetcher.data);

  if (cart?.totalQuantity > 0)
    return (
      <div className="w-full max-w-6xl mx-auto pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12">
        <div className="flex-grow md:translate-y-4">
          <CartLineItems linesObj={cart.lines} fetcher={fetcher}/>
        </div>
        <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-[65px] grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-md w-full">
          <CartSummary cost={cart.cost} />
          <CartActions checkoutUrl={cart.checkoutUrl} />

        </div>
      </div>
    );

      
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Link
        to="/collections/all"
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </Link>
    </div>
  );
}

import {Link, useFetcher} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

export function CartLineItems({linesObj, fetcher}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} fetcher={fetcher}/>;
      })}
    </div>
  );
}

export function CartSummary({cost}) {
    return (
      <>
        <dl className="space-y-2">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>
              {cost?.subtotalAmount?.amount ? (
                <Money data={cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>
          {/* <div className="flex items-center justify-between">
            <dt className="flex items-center">
              <span></span>
            </dt>
            
            <dd>
              {cost?.totalTaxAmount?.amount ? (
                <Money data={cost?.totalTaxAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div> */}
        </dl>
        <div>
          Taxes and shipping calculated at checkout 
        </div>
      </>
    );
  }
  
  export function CartActions({checkoutUrl}) {
    if (!checkoutUrl) return null;
  
    return (
      <div className="flex flex-col mt-2">
        <a
          href={checkoutUrl}
          className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium"
        >
          Continue to Checkout
        </a>
      </div>
    );
  }
  

function ItemRemoveButton({lineIds}) {
    return (
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={
          {lineIds}
        }
      >
        <button
          className="bg-white border-black text-black hover:text-white hover:bg-black rounded-md font-small text-center my-2 max-w-xl leading-none border w-10 h-10 flex items-center justify-center"
          type="submit"
        >
          <IconRemove />
        </button>
      </CartForm>
    );
  }
  
  function IconRemove() {
    return (
      <svg
        fill="transparent"
        stroke="currentColor"
        viewBox="0 0 20 20"
        className="w-5 h-5"
      >
        <title>Remove</title>
        <path
          d="M4 6H16"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M5.5 6L6 17H14L14.5 6"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
          strokeWidth="1.25"
        />
      </svg>
    );
  }
  

function LineItem({lineItem, fetcher}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        <Image data={merchandise.image} width={110} height={110} />
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-gray-800 text-sm">{merchandise.title}</div>
        {/* <div className="text-gray-800 text-sm">Qty: {quantity}</div> */}
        <CartLineQuantity line={lineItem} fetcher={fetcher}/>
        <ItemRemoveButton lineIds={[lineItem.id]} />

      </div>
      <Money data={lineItem.cost.totalAmount} />
    </div>
  );
}

function CartLineQuantity({line, fetcher}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantiy">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]} fetcher={fetcher}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          type="submit"
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]} fetcher={fetcher}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          type="submit"
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
      {/* <CartLineRemoveButton lineIds={[lineId]} /> */}
    </div>
  );
}

function CartLineUpdateButton({children, lines, fetcher}) {
  return (
    <JiagiaCartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
      fetcher={fetcher}
    >
      {children}
    </JiagiaCartForm>
  );
}

const INPUT_NAME = 'cartFormInput';

export function JiagiaCartForm({
  children,
  action,
  inputs,
  route,
  fetcher
}) 
{
  // const fetcher = useFetcher();

  return (
    <fetcher.Form action={route || ''} method="post">
      {(action || inputs) && (
        <input
          type="hidden"
          name={INPUT_NAME}
          value={JSON.stringify({action, inputs})}
        />
      )}
      {typeof children === 'function' ? children(fetcher) : children}
    </fetcher.Form>
  );
}
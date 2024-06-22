import {Link, useFetcher} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

export function CartLineItems({linesObj, fetcher}) {
  const lines = flattenConnection(linesObj);
  return (
    <>
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} fetcher={fetcher} />;
      })}
    </>
  );
}

export function CartSummary({cost}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-center md:justify-end gap-4">
          <dt className="text-xl font-bold">Subtotal</dt>
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
      <div className="text-center md:text-right">
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

export function CartError({errors}) {
  // console.log(errors);
  if (errors) {
    return (
      <div>
        {errors.map((error) => {
          return (
            <div className="flex text-red-600 text-sm" key={error.field[1]}>
              <svg
                className="mr-2"
                fill="#dc2626"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="20px"
                height="20px"
                viewBox="0 0 45.311 45.311"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656
                    c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635
                    C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001
                    c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0
                    c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578
                    c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0
                    c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29
                    c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z"
                  />
                </g>
              </svg>
              {error.message}
            </div>
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
}

function ItemRemoveButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        className="bg-white text-black hover:text-white hover:bg-black rounded-md font-small text-centermax-w-xl leading-none w-5 h-5 flex items-center justify-center"
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
    <tr className="table-row align-top">
      <td className="table-cell">
        <div className="flex flex-row">
          <Link
            to={`/products/${merchandise.product.handle}`}
            className="inline"
          >
            <Image data={merchandise.image} width={110} height="auto" />
          </Link>
          <div className="ml-8">
            <Link
              to={`/products/${merchandise.product.handle}`}
              className="font-bold no-underline hover:underline"
            >
              {merchandise.product.title}
            </Link>
            <div className="text-gray-800 text-sm">
              <Money data={merchandise.price} />{' '}
            </div>
            <div className="text-gray-800 text-sm">
              Size: {merchandise.title}
            </div>
          </div>
        </div>
      </td>
      <td className="flex flex-row justify-start mx-auto hidden md:table-cell">
        <CartLineQuantity line={lineItem} fetcher={fetcher} />
      </td>
      <td className="text-right table-cell">
        <Money data={lineItem.cost.totalAmount} />
      </td>
    </tr>
  );
}

function CartLineQuantity({line, fetcher}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-row border border-black gap-4 px-4">
        <CartLineUpdateButton
          lines={[{id: lineId, quantity: prevQuantity}]}
          fetcher={fetcher}
        >
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            name="decrease-quantity"
            value={prevQuantity}
            type="submit"
          >
            <span className="text-[14px]">&#8722; </span>
          </button>
        </CartLineUpdateButton>
        <small className="text-[14px]">&nbsp; {quantity} &nbsp;</small>
        <CartLineUpdateButton
          lines={[{id: lineId, quantity: nextQuantity}]}
          fetcher={fetcher}
        >
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            type="submit"
          >
            <span className="text-[14px]">&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <ItemRemoveButton lineIds={[line.id]} />
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

export function JiagiaCartForm({children, action, inputs, route, fetcher}) {
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

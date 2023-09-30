import {useFetcher} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';

export function ThisIsGift({metafield}) {
  const fetcher = useFetcher();

  return (
    <div>
      <input
        checked={metafield?.value === 'true'}
        type="checkbox"
        id="isGift"
        onChange={(event) => {
          fetcher.submit(
            {
              [CartForm.INPUT_NAME]: JSON.stringify({
                action: CartForm.ACTIONS.MetafieldsSet,
                inputs: {
                  metafields: [{
                    key: 'custom.gift',
                    type: 'boolean',
                    value: event.target.checked.toString(),
                  }],
                },
              }),
            },
            {method: 'POST', action: '/cart'}
          )
        }}
      />
      <label htmlFor="isGift">This is a gift</label>
    </div>
  );
}

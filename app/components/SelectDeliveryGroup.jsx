import {CartForm} from '@shopify/hydrogen';

function SelectDeliveryGroup({deliveryGroups}) {
  const fetcher = useFetcher();
  const group = deliveryGroups?.nodes[0];
  const deliveryOptions = group.deliveryOptions;
  const selectedHandle = group.selectedDeliveryOption?.handle;

  return (
    <div>
      {deliveryOptions.map((option) => {
        return (
          <div key={option.handle}>
            <input
              checked={selectedHandle === option.handle}
              type="radio"
              name="delivery"
              value={option.handle}
              id={option.handle}
              onChange={(event) => {
                fetcher.submit(
                  {
                    [CartForm.INPUT_NAME]: JSON.stringify({
                      action: CartForm.ACTIONS.SelectedDeliveryOptionsUpdate,
                      inputs: {
                        selectedDeliveryOptions: [{
                          deliveryGroupId: group.id,
                          deliveryOptionHandle: event.target.value,
                        }],
                      },
                    }),
                  },
                  {method: 'POST', action: '/cart'}
                )
              }}
            />
            <label htmlFor={option.handle}>{option.title}</label>
          </div>
        )
      })}
    </div>
  );
}

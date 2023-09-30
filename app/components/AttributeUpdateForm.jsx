import {CartForm} from '@shopify/hydrogen';

export default function AttributeUpdateForm({attributes}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.AttributesUpdateInput}
      inputs={
        {attributes}
      }
    >
      <button>Update attribute</button>
    </CartForm>
  );
}

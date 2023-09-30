import {CartForm} from '@shopify/hydrogen';

export default function NoteForm() {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.NoteUpdate}
    >
      <p>Provide a short message for the gift tag:</p>
      <input type="text" name="note" />
      <button>Update note</button>
    </CartForm>
  );
}

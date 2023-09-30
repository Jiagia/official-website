export async function action({request, context}) {
    const {cart, session} = context;
    const formData = await request.formData();
  
    const email = formData.get('email');
    const password = formData.get('password');
  
    try {
      // Login and get a customer access token
      const customerAccessToken = await doLogin(context, {email, password});
      session.set('customerAccessToken', customerAccessToken);
  
      // Sync customerAccessToken with existing cart
      const result = await cart.updateBuyerIdentity({customerAccessToken});
  
      // Update cart id in cookie
      const headers = cart.setCartId(result.cart.id);
  
      // Update session
      headers.append('Set-Cookie', await session.commit());
  
      return redirect(params.locale ? `/${params.locale}/account` : '/account', {
        headers,
      });
    } catch (error) {
      // handle error
    }
  };
  
import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

/* 
  component that sets up browser hydration
  hydration: a technique that allows client-side Javascript
    to convert a static HTML web page into a dynamic web page by attaching
    event handlers to the HTML elements
*/
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});

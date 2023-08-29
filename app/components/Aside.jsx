/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```ts
 * <Aside id="search-aside" heading="SEARCH">`
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
import {useState} from 'react'

export function Aside({children, heading, id = 'aside', show = false, closeAside}) {

  // console.log(show);
  return (
    <div aria-modal className={"overlay overlay-"+ (show ? "open" : "close")} id={id} role="dialog">
      <aside>
        <header>
          <h3>{heading}</h3>
          {/* <CloseAside /> */}
          <button onClick={closeAside}> &times; </button>
        </header>
        <main>{children}</main>
      </aside>
      <button
        className="close-outside"
        // onClick={() => {
        //   history.go(-1);
        //   window.location.hash = '';
        // }}
        // onClick={closeAside}
      />
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      &times;
    </a>
  );
}

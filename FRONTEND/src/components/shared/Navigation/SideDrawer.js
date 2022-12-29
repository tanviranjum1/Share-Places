// for app to work nicely on mobile device.
import React from 'react';
import './SideDrawer.css';
// this is other part of react library which is used to render the react application itself.
import ReactDOM from 'react-dom';
// CSSTransition is component provided by this third party libarary.
import { CSSTransition } from 'react-transition-group';

// {/* want to add animation to slide in and out.
// i want to render it in different part of the page than where we include the drawer. */}

// expect on sideDrawer component a function to be passed
const SideDrawer = (props) => {
  // have to tell the library when exactly the side drawer is visible.
  // props.show true means visible.
  // special classnames which third party library knows to use  and applies in sequence when it animates it in or animates out.
  // mountOnEnter or unmountonexit tells the css transition component should really be added tot he dom or removed from the dom.
  // when it should become visible or invisible.
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames='slide-in-left'
      mountOnEnter
      unmountOnExit
    >
      {/* and pass that function on to the onclick prop on aside */}
      <aside className='side-drawer' onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  // render sideDrawer on drawer hook div not root div in index.html.

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;

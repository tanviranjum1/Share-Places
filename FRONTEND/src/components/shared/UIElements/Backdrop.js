import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

// utilizes the portal concept.

// listens to the click on backdrop.
// on this background and emits a function it expects to get on an onclick prop.
const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div className='backdrop' onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;

// reusable modal.
// to show map and other functions.
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';

// general structure.
const ModalOverlay = (props) => {
  const content = (
    // to add own classes to the model. we used template literal. for flexibility. dynamic binding for flexiblity.
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header  ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        {/* user allowed to enter footer elements for ex: button to allow user to confirm a choice. */}
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

// modal component will use the first component and we will export the modal component only.
//  takes the props from modal and forwards them to modal ModalOverlay. takes all the key value pairs of teh props object
// and spreads them as attributes onto modaloverlay.
// add animation and also backdrop.
const Modal = (props) => {
  return (
    <React.Fragment>
      {/* trigger oncancel method */}
      {props.show && <Backdrop onClick={props.onCancel} />}
      {/* in is trigger for backdrop as well. */}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames='modal'
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;

import React, { useReducer, useEffect } from 'react';
import './Input.css';

import { validate } from '../util/validators';
// in the input component managed internal state, managed what user enetered and manage whether valid or not.

// often action has type property that is unique identifier that descibes an action.
const inputReducer = (state, action) => {
  switch (action.type) {
    // return new state object. object oto merge multiple different state pieces into one grouped state.
    //    copies all the key value pairs of old state.
    // add validation logic later.
    // action.val is the user input.
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };

    // return unchanged state.
    default:
      return state;
  }
};

const Input = (props) => {
  // pass in at least one arg that's acalled reducer.
  //Reducer is a function that receives an action when disspatched.
  // recieves the current state and then updates the state based on the action received.
  // returns the new state and useReducer will take the new state and give it back rerendering.
  // second arg takes initial state. the state with which you want to initialize the component.
  // returns an array of two elements just like useState.
  //   current state, and dispatch function which is how we will dispatch actions to the reducer function which will run through the function
  // and return a new state which update input state and re-render the component.
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // run useEffect when input value and validity changes.
  // under which we want to send new value back to the component where we use input component.
  useEffect(() => {
    //call props on input as a function because expect to get a function.
    onInput(id, value, isValid);
    // because we use data from props and inputState.
  }, [id, value, isValid, onInput]);

  // trigger when user entered sth. called for every keystroke.
  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' });
  };

  // onblur triggered when user loses focus. after losing focus then show error.
  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  // htmlfor used instead of for in js.
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && `form-control--invalid`
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;

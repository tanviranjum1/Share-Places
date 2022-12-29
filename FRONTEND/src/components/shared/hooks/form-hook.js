// to share form managment and input change handling logic.
import { useCallback, useReducer } from 'react';

// we have to update inside of the form reducer the states based on different action we receive.
const formReducer = (state, action) => {
  switch (action.type) {
    // return new state object. update teh input state changed and overall form validtity.
    case 'INPUT_CHANGE':
      let formIsValid = true;
      // go through all inputs- the title and description and find out if all inputs are valid.
      for (const inputid in state.inputs) {
        // if undefined.

        // check if the input is getting updated in currrent action.
        if (inputid === action.inputid) {
          //  take info from dispatched action on whether it is valid or not.
          // formisVaild prev and action.isValid new validdity value.
          formIsValid = formIsValid && action.isValid;
        } else {
          // take the stored validity of the input  as we are not updating.
          formIsValid = formIsValid && state.inputs[inputid].isValid;
        }
      }
      return {
        ...state,
        // input = current input state and overwirte with input state we are updating.
        inputs: {
          ...state.inputs,
          // dynamic assignment here. dynamically updates one of our input fields.
          [action.inputid]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
};

// have to start with lower case.
export const useForm = (initialInputs, initialFormValidity) => {
  // usevalid stores the information of whether the overall form is valid.
  // inputs is an object that stores information about the validity of individual inputs.
  // we specified the intial state here. useReducer returns values.
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    // isValid of the overall form is initially false.
    isValid: initialFormValidity,
  });

  // useCallback to wrap a function. whne component rerenders this function will be stored away by react and will
  // be reused. so that no new function object created when component function rerenders.
  // but then this function is reused and doesn't change. that doesn't lead to useEffect to run again. to avoid infinite loop.
  // we want to manage the overall validity and value of the entire form.
  // define dependency of fucntion
  // store all the values of individual input handlers.
  const inputHandler = useCallback((id, value, isValid) => {
    // dispatch a new action.

    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputid: id,
    });
  }, []);

  // useCallback have to specify it's dependency.
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};

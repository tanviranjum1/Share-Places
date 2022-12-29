import React, { useState, useContext } from 'react';
import './Auth.css';
import Card from '../../shared/UIElements/Card';
import Input from '../../shared/FormElements/Input';
import Button from '../../shared/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/FormElements/ImageUpload';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs);

    // json only sending text data.
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            // to make backend know which kind of data it receives.
            'Content-type': 'application/json',
          }
        );
        console.log(responseData);
        // console.log(formState.inputs);
        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        // all is being done in custom hook.
      }
    } else {
      // images are binary data. can't use json.
      // formdata already built into js and browser. don't need third aprty install.
      const formData = new FormData();
      // can add text or binary data.
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value); // backend we are using the key 'image'
      try {
        // fetch automatically sets the right header for formData - application/json.
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );

        // console.log(formState.inputs);
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}

      //v1
      // try {
      //   // post request. fetch returns promise.
      //   const response = await fetch('http://localhost:6300/api/users/signup', {
      //     method: 'POST',
      //     headers: {
      //       // to make backend know which kind of data it receives.
      //       'Content-type': 'application/json',
      //     },
      //     // converts it to JSON.
      //     body: JSON.stringify({
      //       name: formState.inputs.name.value,
      //       email: formState.inputs.email.value,
      //       password: formState.inputs.password.value,
      //     }),
      //   });

      //   // parse the response body by. because most api takes in json format data.
      //   // this iis actual data in response body.
      //   const responseData = await response.json();
      //   // true if 400/500 status code.e lse 200 error code. after this catch statement will execute.
      //   if (!response.ok) {
      //     throw new Error(responseData.message);
      //   }

      //   console.log(responseData);
      //   setIsLoading(false);
      //   // console.log(formState.inputs);
      //   auth.login();
      // } catch (err) {
      //   console.log(err);
      //   setIsLoading(false);
      //   setError(err.message || 'Something went wrong, please try again.');
      // }
    }
  };

  const switchModeHandler = () => {
    // runs before switching mode.
    // retain the value of email and password and drop the name field.
    // means we are signup mode.
    if (!isLoginMode) {
      // copy all fields and overwrite name.
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    // moving to signup mode.
    else {
      // retain current value of email and password. name will be empty and isValid will be false for the name field.
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    // this is for updating the state which we should use if our new state update is based on
    // the previous state. inverts it.

    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name'
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id='image'
              center
              onInput={inputHandler}
              errorText='Please provide an image'
            />
          )}
          <Input
            element='input'
            id='email'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address'
            onInput={inputHandler}
          />
          <Input
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password, at least 6 characters'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;

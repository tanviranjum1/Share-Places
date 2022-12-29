import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/FormElements/Input';
import Button from '../../shared/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (min. 5 characters).'
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;

// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import Input from '../../shared/FormElements/Input';
// import Button from '../../shared/FormElements/Button';
// import {
//   VALIDATOR_REQUIRE,
//   VALIDATOR_MINLENGTH,
// } from '../../shared/util/validators';
// import './PlaceForm.css';
// import { useForm } from '../../shared/hooks/form-hook';
// import Card from '../../shared/UIElements/Card';
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
// import ErrorModal from '../../shared/UIElements/ErrorModal';
// import { AuthContext } from '../../shared/context/auth-context';

// //get id of the place through url and fetch information about the place from a server and inilize it with place data.

// const UpdatePlace = () => {
//   const auth = useContext(AuthContext);
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [loadedPlace, setLoadedPlace] = useState();
//   const history = useHistory();
//   const placeId = useParams().placeId;

//   // remember : can't use useForm isndie of then block. only setup hook after the response is there.
//   const [formState, inputHandler, setFormData] = useForm(
//     {
//       title: {
//         value: '',
//         isValid: false,
//       },
//       description: {
//         value: '',
//         isValid: false,
//       },
//     },
//     false
//   );

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const responseData = await sendRequest(
//           `http://localhost:6300/api/places/${placeId}`
//         );
//         setLoadedPlace(responseData.place);
//         setFormData(
//           {
//             title: {
//               value: responseData.place.title,
//               isValid: true,
//             },
//             description: {
//               value: responseData.place.description,
//               isValid: true,
//             },
//           },
//           true
//         );
//       } catch (err) {}
//     };
//     fetchPlace();
//   }, [sendRequest, placeId, setFormData]);

//   const placeUpdateSubmitHandler = async (event) => {
//     event.preventDefault();
//     // console.log(formState.inputs);

//     try {
//       await sendRequest(
//         `http://localhost:6300/api/places/${placeId}`,
//         'PATCH',
//         JSON.stringify(
//           {
//             title: formState.inputs.title.value,
//             description: formState.description.title.value,
//           },
//           {
//             'Content-Type': 'application/json',
//           }
//         )
//       );
//       history.push('/' + auth.userId + '/places');
//     } catch (err) {}
//   };

//   // check this
//   if (isLoading) {
//     return (
//       <div className='center'>
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // then check
//   if (!loadedPlace && !error) {
//     return (
//       <div className='center'>
//         <Card>
//           <h2>Couldn't find the place.</h2>
//         </Card>
//       </div>
//     );
//   }

//   // form initilized with values from the place.
//   // set initial form value so have to make it adjustable.
//   return (
//     <React.Fragment>
//       <ErrorModal error={error} onClear={clearError} />
//       {!isLoading && loadedPlace && (
//         <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
//           <Input
//             id='title'
//             element='input'
//             type='text'
//             label='Title'
//             validators={[VALIDATOR_REQUIRE()]}
//             errorText='Please enter a valid title'
//             onInput={inputHandler}
//             initialValue={loadedPlace.title}
//             initialValid={true}
//           />

//           <Input
//             id='description'
//             element='textarea'
//             label='Description'
//             validators={[VALIDATOR_MINLENGTH(5)]}
//             errorText='Please set a valid description (min. 5 characters)'
//             onInput={inputHandler}
//             initialValue={loadedPlace.description}
//             initialValid={true}
//           />

//           <Button type='submit' disabled={!formState.isValid}>
//             UPDATE PLACE
//           </Button>
//         </form>
//       )}
//     </React.Fragment>
//   );
// };

// export default UpdatePlace;

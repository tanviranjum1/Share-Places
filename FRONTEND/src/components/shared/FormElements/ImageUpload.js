import React, { useRef, useState, useEffect } from 'react';

import './ImageUpload.css';
import Button from './Button';

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  // const [file, setFile] = useState(); // initially undefined.
  // const [previewUrl, setPreviewUrl] = useState(); // url of image preview.
  // const [isValid, setIsValid] = useState(false);

  // //    store value which survive rerender Cycle.
  // //    useRef to establish connection to DOM Element.
  // const filePickerRef = useRef();

  // // trigger when new file.
  // useEffect(() => {
  //   // generate preview.
  //   // no file.
  //   if (!file) {
  //     return;
  //   }
  //   // helps parse file.
  //   const fileReader = new FileReader();
  //   // convert file into readable or outputable image url.
  //   // executes when fileReader reads new file or is done parsing a file.
  //   fileReader.onload = () => {
  //     setPreviewUrl(fileReader.result);
  //   };
  //   fileReader.readAsDataURL(file);
  // }, [file]);

  // // triggered when user picked a file.
  // const pickHandler = (event) => {
  //   let pickedFile;
  //   let fileIsValid = isValid;
  //   // to show preview of file and forward the file.
  //   console.log(event.target);
  //   // event.target.files holds the files that user selected if it's  native picker.
  //   // to ensure file exists
  //   if (event.target.file && event.target.files.length === 1) {
  //     const pickedFile = event.target.files[0];
  //     setFile(pickedFile);
  //     setIsValid(true); // doesn't update immediate. it schedules state update.
  //     fileIsValid = true;
  //   } else {
  //     setIsValid(false);
  //     fileIsValid = false;
  //   }
  //   // forward picked file and validity information..
  //   // can't forward isValid it will be old isValid value.
  //   props.onInput(props.id, pickedFile, fileIsValid);
  // };

  // // to open built in file picker.
  // // have to get access to input element.
  // const pickImageHandler = () => {
  //   // to open up file picker.
  //   filePickerRef.current.click();
  // };

  // classes are available globally not scoped to a component.
  // using form-control whose style is defined in Input.css.
  // accept is a default attribute you can add on inputs of type="file"
  return (
    <div className='form-control'>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg, .png, .jpeg'
        onChange={pickedHandler}
      />
      {/* can customized where the image upload picker should be placed. */}
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload_preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

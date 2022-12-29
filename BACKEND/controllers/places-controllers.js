// have all middle ware functions that are reached for certain routes.
//clearly focused on middleware.

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const fs = require('fs');

// const uuid = require('uuid/v4');
const uuid = require('uuid');
const e = require('express');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const place = require('../models/place');

const getPlacesById = async (req, res, next) => {
  // console.log('GET Request in Places');
  const placeId = req.params.pid;

  // findById is static method means not used on instance of place but directly on the place constructor.
  // doesn't return promise. still then catch available. using exec() can get promise.
  let place;
  try {
    place = await Place.findById(placeId);
    // place is mongoose objec.t
  } catch (err) {
    // if get request problem. ex: missing info.
    const error = new HttpError(
      'Something went wrong, couldnot finda  place',
      500
    );
    return next(error);
  }

  // if place id not present in db.
  if (!place) {
    // return res
    //   .status(404)
    //   .json({ message: 'Could not find a place for the provided id.' }); //not found status code
    // const error = new Error('Could not find a place for the provided Id');
    // error.code = 404;
    // throw error; // this will trigger error ahndling middleware.
    const error = new HttpError(
      'Could not find a place for the provided Id',
      404
    );
    return next(error);
  }

  // convert to normal js object.
  res.json({ place: place.toObject({ getters: true }) }); // => {place} => {place:place}
  // getters : true to also add id which is equal to _id value.

  // converts any data to json
  //sends back response as json data.
  // res.json({ message: 'It works!' });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // gives us the first element that matches the criteria.
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.creator == userId;
  // });

  //1.0
  // works similar to findbyId. can use async op. doesn't return promise. can use exec.
  // find available in mongodb and mongoose. in mongo find returns cursor. points to results. and then allows to iterate through the results.
  // in mongoose directly returns array. can get cursor by adding cursor property.
  // let places;
  // try {
  //   places = await Place.find({ creator: userId });
  // } catch (err) {
  //   const error = new HttpError(
  //     'Fetching places failed, please try again later.',
  //     500
  //   );
  //   return next(error);
  // }

  // APPROACH : 2
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length==0)
  if (!userWithPlaces || userWithPlaces.length === 0) {
    // const error = new Error('Could not find a place for the provided user Id');
    // error.code = 404;
    // return next(error); // forward to next error handling middleware. // return to make sure the code after if block doesn't run.
    return next(
      new HttpError('Could not find places for the provided user Id', 404)
    );
  }

  // 1.0
  // find returns array. can't use toObject method to add extra id property.
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

// post has data in the request body.
const createPlace = async (req, res, next) => {
  // to get data out of the body use body parser in app.js.
  //check into req body and see if any validation error reported. returns error object.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    );
  }

  const { title, description, address } = req.body;

  // this might throw error.
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    // forward error. return code after doesn't run.
    return next(error);
  }

  //local:
  // const createdPlace = {
  //   id: uuid.v4(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };

  // store mongo db real id.
  // extract the path which malter gives. path stored. stored files locally.
  const createdPlace = new Place({
    title, // title: title
    description,
    address,
    location: coordinates,
    image: req.file.path,
    // 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg', // => File Upload module, will be replaced with real image url
    creator: req.userData.userId,
  });

  let user;
  try {
    // check if id of logged in user exists or not.
    user = await User.findById(req.userData.userId); // creator is not being received anymore.
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  // check if user in db or not.
  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }
  console.log(user);
  //store or create new doc with user id.
  // add place id to corresponding user.

  try {
    // current session when creating place.
    const sess = await mongoose.startSession();
    // start transaction
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    // make sure place id stored in user. access places property. push method in mongoose.
    // push  method used by mongoose to establish conn between place and user behind the scene.
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction(); // at this point changes are saved in db.
  } catch (err) {
    // either db down or db validation failed.
    const error = new HttpError(
      'Creating a place failed, please try again.',
      500
    );
    // to stop code execution.
    return next(error);
  }
  //local:
  //added with push or unshift method.
  // DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log('errors: ', errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  // 401 is authorization error.
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// const updatePlace = async (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your inputs', 422)
//     );
//   }

//   // only update title and desc here.
//   const { title, description } = req.body;

//   // identifier typically present in url.
//   // and data with which to work in request body.
//   const placeId = req.params.pid;

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, couldnot update place',
//       500
//     );
//     return next(error);
//   }
//   place.title = title;
//   place.description = description;
//   try {
//     await place.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, couldnot update place',
//       500
//     );
//     return next(error);
//   }

//   // not 201 because nothing new created.
//   res.status(200).json({ place: place.toObject({ getters: true }) });
// };

//LOGIC : find a place by id and then see which user has this place and delete that place id from user.
// access to user doc and overwrite or change existing info. use populate method.
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // creator has the id so id allows to search for user and get back data in user document.
    // to get access to entire content of document stored in different collection.
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id', 404);
    return next(error);
  }

  //id getter gives stirng.
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this place.',
      401
    );
    return next(error);
  }

  const imagePath = place.image; // access image key.

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    // access place stored in creator.
    //access places array.
    //remove place from user
    place.creator.places.pull(place); // automatically removes the id internally.
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(error);
  }

  //to delete the place iamge.
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};

// module.exports : allows to export single thing.

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

// for mapping and paths we are using.

const express = require('express');

// check is a method that will return a new middleware configured for our validation requirement.
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// router an object with which we can register middleware that is filtered by http method in path.
// just pointing at it so that executes when request reaches the route only.
router.get('/:pid', placesControllers.getPlacesById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

// add middleware to ensure request has to have token.
// first two request are open to everyone and the ones below it protection.
// write middleware which checks for incoming token.
// pass a pointer to use. so this function gets registered as middleware.
router.use(checkAuth);

// can implement multiple middlewares and they will execute from left to right.
// check takes name of the field which you want to validate. can chain various method on the result of check method.
router.post(
  '/',
  fileUpload.single('image'), // look for key "image".
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  placesControllers.createPlace
);

// same path doesn't matter because this is patch request.
router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

// export syntax in node js. router constant exported.
module.exports = router;

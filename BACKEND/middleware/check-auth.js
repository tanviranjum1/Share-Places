const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //check valid token. get or delete no request body so
  // can look for query param. affects url.
  // can use headers.
  // token can be considered as meta data attached to request.
  // here using authorization header to extract data.
  // will get an array of two values. here accessing second one- token.

  // allows options request to continue.
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed');
    }
    // verify the token
    // returns payload decoded as string.
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // so can get the userId of the user to which the token belongs.
    // if verification didn't fail the user is authenticated.

    // to allow req to continue it's journey. so able to reach any other routes thereafter.
    // can't be faked because it's part of the token.
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed', 403);
    return next(error);
  }
};

// const jwt = require('jsonwebtoken');

// const HttpError = require('../models/http-error');

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
//     if (!token) {
//       throw new Error('Authentication failed!');
//     }
//     const decodedToken = jwt.verify(token, 'supersecret_dont_share');
//     req.userData = { userId: decodedToken.userId };
//     next();
//   } catch (err) {
//     const error = new HttpError('Authentication failed!', 401);
//     return next(error);
//   }
// };

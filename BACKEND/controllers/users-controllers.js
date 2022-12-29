const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  // only return email and name and not the password.'email name' or '-password'
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later',
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// FOR IMMAGE:
// link the file to user db and create image url.

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your inputs', 422)
    );
  }

  const { name, email, password } = req.body;

  //check if have user.
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  //   422 for invalid user input.
  if (existingUser) {
    const error = new HttpError('User already exists, please login again', 422);
    return next(error);
  }

  let hashedPassword;
  // salt or number of salting rounds. strength of password.1
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again, 500');
    return next(error);
  }

  // store just the path on server not the url.
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [], //starting value empty array.
  });

  try {
    // save mongoose method : handles all mongo db code to store new document in db. creates unique places id.
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up  failed, please try again.', 500);
    // to stop code execution.
    return next(error);
  }

  //valid user and generate token.
  let token;
  // returns string that is token. first arg payload : string, object or buffer
  // id created by mongoose. string which only server knows.

  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError('Signing up  failed, please try again.', 500);
    // to stop code execution.
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check email address valid or not.
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed, please try again later', 500);
    return next(error);
  }

  // check user exists.
  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    // if somthing went wrong during comparison. doesn't check invalid.
    const error = new HttpError(
      'Could not log you in, please check your createntials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      403
    );
    return next(error);
  }

  let token;
  // returns string that is token. first arg payload : string, object or buffer
  // id created by mongoose. string which only server knows.
  // use the same private key as in signup.
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    const error = new HttpError('Logging in  failed, please try again.', 500);
    // to stop code execution.
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

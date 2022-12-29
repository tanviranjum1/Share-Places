// store the imported object in the express constant.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const fs = require('fs');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const { route } = require('./routes/places-route');

const app = express();

// before the request reaches the placesRoutes in the code below.
// parse any json from request body and convert to any js data structures objects and arrays. and calls next automatically
app.use(bodyParser.json());

// to grant access to the file. such request handled by middleware that's built into express.
// static middleware that returns file. wants a path from which any file requested can be served.
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

//register middleware with .use. so later response sent by the routes below have the header
app.use((req, res, next) => {
  // next() to make request continue it's journey to other middleware.
  ///* to keep it open up for any domain.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

// routes configured in the other file is now added as  middleware in app.js.
app.use('/api/places', placesRoutes); // => /api/places/..

app.use('/api/users', usersRoutes);

// normal middleware to handle error. only runs if we didn't send a response in one of our routes.
// for proper error handling for unsupported routes.
app.use((req, res, next) => {
  const error = new HttpError('Couldnot find this route.', 404);
  throw error;
});

// 4 parameters express will treat as error handling middleware function.
// will execute on middleware where error thrown.
app.use((error, req, res, next) => {
  // malter adds file property
  // file exists then delete it.
  // rollback image upload if request went wrong.
  // rollback creation of file if validation error.
  if (req.file) {
    // path pionts to the file for delete
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  // if res already sent.
  if (res.headerSent) {
    // forward the error.
    return next(error);
  }
  res.status(error.code || 500);
  // if no message property or  undefined or falsy value in the message property of error object.
  res.json({ message: error.message || 'An unknown error occured' });
});

// returns promise
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ttq28tg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 6300);
  })
  .catch((err) => {
    console.log(err);
  });

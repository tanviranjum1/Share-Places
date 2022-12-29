const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  // unique creates internal index for email in db which speeds up querying process.
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true }, // url not files.
  // array because one user can have multiple places.
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});

// to add it to shcema use plugin method. new user if email doesn't exist.
userSchema.plugin(uniqueValidator);

// first arg name of collection/ schema.
module.exports = mongoose.model('User', userSchema);

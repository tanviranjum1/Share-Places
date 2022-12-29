// predefine structure of document. exoprt schema to be used.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  // creator will be creator id. additional property ref which allows to establish connection between current placeschema
  // and user schema.
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

// model will return constructor function.
//two arg.1st is name of the model. convention: uppercase no singular.
module.exports = mongoose.model('Place', placeSchema);

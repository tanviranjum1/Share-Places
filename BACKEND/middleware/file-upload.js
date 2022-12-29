const multer = require('multer');
const uuid = require('uuid');

// get the extension mapped to it.
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// function to which can pass config object.
// it's a group of middlewares.
// object with bunch of middlwares.
const fileUpload = multer({
  // to store extracted image.
  limits: 500000, // 500 kilobytes.
  // generate driver.
  storage: multer.diskStorage({
    // configuring place where stored.
    // deriving the path where you want to store it.
    destination: (req, file, cb) => {
      // no error null as first argument.
      cb(null, 'uploads/images', 'uploads/images');
    },
    // filename is saved
    __filename: (req, file, cb) => {
      // extract extension of incomming file.
      const ext = MIME_TYPE_MAP[file.mimetype];
      // generate random file name with the right extension.
      cb(null, uuid.v4() + '.' + ext);
    },
  }),
  // which file we accept.
  fileFilter: (req, file, cb) => {
    // double bang to convert undefined to false and findings to true.
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // retrieve png, jpg or jpeg. undefined if not present.
    let error = isValid ? null : new Error('invalid Mime Type!');
    cb(error, isValid);
  },
});

module.exports = fileUpload;

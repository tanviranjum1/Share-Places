class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // to call the constructor of base class and forward message to it. Add a message property.
    this.code = errorCode; // Adds a code property.
  }
}

module.exports = HttpError;

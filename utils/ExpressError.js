class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.messsage = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; //still developing
    Error.captureStackTrace(this, this.constructor); //not pollute the stacktrace //still developing
  }
}

module.exports = AppError;

class ErrorConflict extends Error {
  constructor(message = "Такой email уже зарегистрирован.") {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;

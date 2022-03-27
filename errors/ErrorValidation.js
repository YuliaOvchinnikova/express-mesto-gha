class ErrorValidation extends Error {
  constructor(message = "Такой email уже зарегистрирован.") {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ErrorValidation;

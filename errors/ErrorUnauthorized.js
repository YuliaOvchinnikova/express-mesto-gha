class ErrorUnauthorized extends Error {
  constructor(message = "Такой email уже зарегистрирован.") {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = ErrorUnauthorized;

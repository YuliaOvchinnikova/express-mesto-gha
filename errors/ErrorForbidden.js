class ForbiddenError extends Error {
  constructor(message = "Необходима авторизация.") {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;

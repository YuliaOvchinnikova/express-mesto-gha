const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

const ErrorUnauthorized = require("../errors/ErrorUnauthorized");

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new ErrorUnauthorized());
    return;
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "dev-secret");
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new ErrorUnauthorized());
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};

const jwt = require("jsonwebtoken");
const ErrorForbidden = require("../errors/ErrorForbidden");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new ErrorForbidden());
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new ErrorForbidden());
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};

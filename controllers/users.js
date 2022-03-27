const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorNotFound = require("../errors/ErrorNotFound");
const ErrorConflict = require("../errors/ErrorConflict");
const ErrorValidation = require("../errors/ErrorValidation");
const ErrorUnauthorized = require("../errors/ErrorUnauthorized");

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict("Пользователь с таким email уже зарегистрирован.");
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ErrorValidation(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.params.id} не найден.`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorValidation(`Некорректный id ${req.params.id}`));
      } else if (err.name === "ValidationError") {
        next(new ErrorValidation("Неправильные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.user._id} не найден.`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorValidation(`Некорректный id ${req.params.id}`));
      } else if (err.name === "ValidationError") {
        next(new ErrorValidation("Неправильные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.params.id} не найден.`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorValidation(`Некорректный id ${req.params.id}`));
      } else if (err.name === "ValidationError") {
        next(new ErrorValidation("Неправильные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.params.id} не найден.`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorValidation(`Некорректный id ${req.params.id}`));
      } else if (err.name === "ValidationError") {
        next(new ErrorValidation("Неправильные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",

        { expiresIn: "7d" },
      );

      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      next(new ErrorUnauthorized(err.message));
    });
};

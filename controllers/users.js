const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorNotFound = require("../ErrorNotFound");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
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
        res
          .status(BAD_REQUEST)
          .send({ message: "Данные для создания пользователя не корректны." });
        return;
      }
      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id ${req.params.id} не найден.`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.errorMessage });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.id}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильные данные" });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateUser = (req, res) => {
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
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.errorMessage });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.id}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message:
            "Данные для обновления информации о пользователе не корректны.",
        });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.updateUserAvatar = (req, res) => {
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
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.errorMessage });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.id}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Данные для обновления аватара не корректны.",
        });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });
      res.send(res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }));
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

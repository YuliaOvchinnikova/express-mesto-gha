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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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
    { name: name, about: about },
    { new: true, runValidators: true }
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
    { avatar: avatar },
    { new: true, runValidators: true }
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

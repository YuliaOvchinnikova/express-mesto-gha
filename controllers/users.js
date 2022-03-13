const User = require('../models/user');

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
  if (
    name === undefined ||
    name === '' ||
    about === undefined ||
    about === '' ||
    avatar === undefined ||
    avatar === ''
  ) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Данные для создания пользователя не корректны.' });
    return;
  }

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.getUserById =
  ('/:id',
  (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        if (user === null) {
          res.status(NOT_FOUND).send({
            message: `Пользователь с id ${req.params.cardId} не найден.`,
          });
          return;
        }
        res.send({ data: user });
      })
      .catch((err) =>
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
      );
  });

module.exports.updateUser =
  ('/:id',
  (req, res) => {
    const { name, about } = req.body;

    if (
      name === undefined ||
      name === '' ||
      about === undefined ||
      about === ''
    ) {
      res.status(BAD_REQUEST).send({
        message:
          'Данные для обновления информации о пользователе не корректны.',
      });
      return;
    }

    User.findByIdAndUpdate(
      req.user._id,
      { name: name, about: about },
      { new: true }
    )
      .then((user) => {
        if (user === null) {
          res.status(NOT_FOUND).send({
            message: `Пользователь с id ${req.params.cardId} не найден.`,
          });
          return;
        }
        res.send({ data: user });
      })
      .catch((err) =>
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
      );
  });

module.exports.updateUserAvatar =
  ('/:id/avatar',
  (req, res) => {
    const { avatar } = req.body;

    if (avatar === undefined || avatar === '') {
      res.status(BAD_REQUEST).send({
        message: 'Данные для обновления аватара не корректны.',
      });
      return;
    }

    User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
      .then((user) => {
        if (user === null) {
          res.status(NOT_FOUND).send({
            message: `Пользователь с id ${req.params.cardId} не найден.`,
          });
          return;
        }
        res.send({ data: user });
      })
      .catch((err) =>
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
      );
  });

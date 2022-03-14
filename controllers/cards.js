const Card = require("../models/card");
const ErrorNotFound = require("../ErrorNotFound");

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .send({ message: "Данные для создания карточки не корректны." });
        return;
      }
      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({
          message: `Карточка с id ${req.params.cardId} не найдена.`,
        });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.cardId}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильные данные" });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({
          message: `Карточка с id ${req.params.cardId} не найдена.`,
        });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.cardId}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильные данные" });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({
          message: `Карточка с id ${req.params.cardId} не найдена.`,
        });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST)
          .send({ message: `Некорректный id ${req.params.cardId}` });
        return;
      }
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Неправильные данные" });
        return;
      }

      res.status(SERVER_ERROR).send({ message: "Произошла ошибка" });
    });

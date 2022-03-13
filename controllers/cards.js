const Card = require('../models/card');

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

  if (name === undefined || name === '' || link === undefined || link === '') {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Данные для создания карточки не корректны.' });
    return;
  }

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.deleteCardById =
  ('/:cardId',
  (req, res) => {
    Card.findByIdAndRemove(req.params.id)
      .then((card) => {
        if (card === null) {
          res.status(NOT_FOUND).send({
            message: `Карточка с id ${req.params.cardId} не найдена.`,
          });
          return;
        }
        res.send({ data: card });
      })
      .catch((err) =>
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
      );
  });

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        res
          .status(NOT_FOUND)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена.` });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Произошла ошибка test' });
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        res
          .status(NOT_FOUND)
          .send({ message: `Карточка с id ${req.params.cardId} не найдена.` });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    );

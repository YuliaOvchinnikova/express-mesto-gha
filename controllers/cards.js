const Card = require("../models/card");
const ErrorNotFound = require("../errors/ErrorNotFound");
const ErrorValidation = require("../errors/ErrorValidation");
const ErrorForbidden = require("../errors/ErrorForbidden");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ErrorValidation("Данные для создания карточки не корректны."));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(() => {
    throw new ErrorNotFound(`Карточка с id ${req.params.cardId} для пользовтеля ${req.user._id} не найдена.`);
  })
    .then((card) => {
      if (req.user._id !== card.owner) {
        throw new ErrorForbidden("Вы не можете удалить чужую карточку");
      }
      Card.findOneAndRemove({ id: req.params.cardId }).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorValidation(`Некорректный id ${req.params.cardId}`));
      } else if (err.name === "ValidationError") {
        next(new ErrorValidation("Неправильные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new ErrorNotFound(`Карточка с id ${req.params.cardId} не найдена.`);
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === "CastError") {
      next(new ErrorValidation(`Некорректный id ${req.params.cardId}`));
    } else if (err.name === "ValidationError") {
      next(new ErrorValidation("Неправильные данные"));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new ErrorNotFound(`Карточка с id ${req.params.cardId} не найдена.`);
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === "CastError") {
      next(new ErrorValidation(`Некорректный id ${req.params.cardId}`));
    } else if (err.name === "ValidationError") {
      next(new ErrorValidation("Неправильные данные"));
    } else {
      next(err);
    }
  });

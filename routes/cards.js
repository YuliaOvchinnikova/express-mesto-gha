const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isURL } = require("validator");

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((url, helper) => {
      if (!isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
        return helper.message(`${url} не валидная ссылка.`);
      }
      return url;
    }),

  }),
}), createCard);
router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), deleteCardById);

router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), likeCard);

router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), dislikeCard);

module.exports = router;

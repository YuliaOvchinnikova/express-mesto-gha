const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isURL } = require("validator");

const {
  getUsers,
  getUserById,
  getMe,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getMe);
router.get("/:id", celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), getUserById);
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((url, helper) => {
      if (!isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
        return helper.message(`${url} не валидная ссылка.`);
      }
      return url;
    }),
  }),
}), updateUserAvatar);

module.exports = router;

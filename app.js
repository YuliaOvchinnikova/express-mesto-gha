const express = require("express");
const bodyParser = require("body-parser");
const { isURL } = require("validator");

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { errors } = require("celebrate");
const { celebrate, Joi } = require("celebrate");
const ErrorNotFound = require("./errors/ErrorNotFound");
const errorHandler = require("./middlewares/errorHandler");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((url, helper) => {
      if (!isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
        return helper.message(`${url} не валидная ссылка.`);
      }
      return url;
    }),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),

  }),
}), createUser);

app.use(cookieParser());
app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use(() => {
  throw new ErrorNotFound("Страница не найдена!");
});

app.use(errors());

app.use(errorHandler);

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});

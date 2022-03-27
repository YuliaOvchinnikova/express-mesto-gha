const express = require("express");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const { errors } = require("celebrate");
const { celebrate, Joi } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),

  }),
}), createUser);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res, next) => {
  res.status(404).send({ message: "Страница не найдена!" });
  next();
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

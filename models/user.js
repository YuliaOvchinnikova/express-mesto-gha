const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    role: { type: String, default: "Жак-Ив Кусто" },
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    role: { type: String, default: "Исследователь" },
  },
  avatar: {
    type: String,
    required: false,
    role: { type: String, default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png" },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail("foo@bar.com"),
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Неправильные почта или пароль"));
          }

          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);

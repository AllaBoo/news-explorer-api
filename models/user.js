const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле «name» должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля «name» - 2 символа'],
    maxlength: [30, 'Максимальная длина поля «name» - 30 символов'],
  },
  email: {
    type: String,
    index: true,
    unique: [true, 'Данный email уже используется, авторизуйтесь или введите другой адрес'],
    required: [true, 'Поле «email» должно быть заполнено'],
    uniqueCaseInsensitive: true,
    validate: {
      validator: (link) => validator.isEmail(link),
      message: 'В поле «email» должна быть ссылка',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле «password» должно быть заполнено'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new Error('Неправильные почта или пароль')); }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

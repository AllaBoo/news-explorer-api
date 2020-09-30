const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model('user', userSchema);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_OK,
  ERROR_CODE_CREATED,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильная почта или пароль');
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'signature',
      { expiresIn: '7d' },
    );
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hash,
      name,
    });
    res.status(ERROR_CODE_CREATED)
      .send({
        email,
        name,
      });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('email уже существует'));
      return;
    }
    next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.status(ERROR_CODE_OK).send({ name: user.name, email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Переданы некорректные данные при создании пользователя'));
      return;
    }
    next(err);
  }
};

const findUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Нет пользователя с указанным id');
    }
    res.status(ERROR_CODE_OK).send({ name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  createUser,
  updateUserInfo,
  findUser,
};

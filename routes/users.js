const usersRouter = require('express').Router();

const { updateUserInfo, findUser } = require('../controllers/users');
const { updateUserInfoValidation } = require('../middlewares/validation');

usersRouter.get('/me', findUser);
usersRouter.patch('/me', updateUserInfoValidation, updateUserInfo);

module.exports = usersRouter;

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://scherbett.nomoredomainsicu.ru', 'https://scherbett.nomoredomainsicu.ru'], credentials: true }));
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

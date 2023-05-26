const express = require('express');
const cors = require('cors');
require('dotenv').config();
const process = require('process');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorsAll } = require('./middlewares/errors');
const { validateCreateUser, validateLogin } = require('./middlewares/validate-req-user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth, router);

app.use(errorLogger);

app.use(errors());

app.use(errorsAll);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT, () => {
  console.log('start server');
});

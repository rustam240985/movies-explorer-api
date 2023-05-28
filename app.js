const express = require('express');
const cors = require('cors');
require('dotenv').config();
const process = require('process');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const router = require('./routes');
const { errorsAll } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { urlDb } = require('./config');

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработан. Обратите внимание!`);
});

const { PORT = 3000, DB_CONN, NODE_ENV } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);
app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorsAll);

mongoose.connect(NODE_ENV === 'production' ? DB_CONN : urlDb);

app.listen(PORT, () => {
  console.log('start server');
});

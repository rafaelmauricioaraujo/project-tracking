const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const routes = require('./api/routes');
const errorHandler = require('./api/middlewares/errorHandler');
const notFound = require('./api/middlewares/notFound');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

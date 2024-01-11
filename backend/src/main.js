const express = require('express');
const jwt = require('jsonwebtoken');

const routes = require('./router/main');

const app = express();

app.use(express.json());

app.use('', routes);

app.listen(3000, () => {
  console.log('app started');
});

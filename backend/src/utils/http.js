const http = require('http');

const { app } = require('./sever');

const server = http.createServer(app);

module.exports = { server };

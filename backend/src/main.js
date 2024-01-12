const express = require('express');
const jwt = require('jsonwebtoken');
const routes = require('./router/main');
const cors = require('cors');

const secretKey = 'loremipsum';

const { app } = require('./utils/sever');
const { server } = require('./utils/http');
const { wss } = require('./utils/ws');

app.use(express.json());

app.use(cors());

app.use('', routes);

wss.on('connection', (ws, req) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (!err) {
        console.log('connected');
        ws.user = decoded;
      }
    });
  }
});

wss.on('message', (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        `[${ws.user ? ws.user.username : 'unknown user'}]: ${message}`
      );
    }
  });

  ws.send(`Welcome to the chat, ${ws.user ? ws.user.username : 'guest'}!`);
});

server.listen(3000, () => {
  console.log('app started');
});

module.exports = { wss };

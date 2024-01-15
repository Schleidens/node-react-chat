const { sql } = require('../db/db');

const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const { wss } = require('../utils/ws');

const controller = {};

controller.login = async (req, res) => {
  const username = req.body.username;
  const secretKey = 'loremipsum';

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '46h' });

  res.json({ token });
};

controller.rooms = async (req, res) => {
  const rooms = await sql`
    select * from rooms where user1 = ${req.query.username} or user2 = ${req.query.username}
  `;
  res.json({
    rooms,
  });
};

controller.chat = async (req, res) => {
  const { user, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'User and message are required' });
  }

  console.log(wss.clients);

  wss.clients.forEach((client) => {
    console.log(client);
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString('utf-8'));
    }
  });
};

module.exports = controller;

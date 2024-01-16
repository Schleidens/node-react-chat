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

  const isUserExist = await sql`
    select * from users where username = ${req.body.username}
  `;

  if (isUserExist.length === 0) {
    const newUser = await sql`
      insert into users (
        username
      ) values  (
        ${req.body.username}
      )

      returning *
    `;
    const token = jwt.sign({ user: newUser[0] }, secretKey, {
      expiresIn: '46h',
    });

    res.json({ token: token, username: newUser[0] });
  } else {
    const user = await sql`
      select * from users where username = ${req.body.username}
    `;

    const token = jwt.sign({ user: user[0] }, secretKey, { expiresIn: '46h' });

    res.json({ token: token, username: user[0] });
  }
};

controller.users = async (req, res) => {
  const users = await sql`
    select * from users
  `;

  res.json({ users });
};

controller.rooms = async (req, res) => {
  const { user } = req.user;

  const rooms = await sql`
    select * from rooms where user1 = ${user.username} or user2 = ${user.username}
  `;
  res.json({
    rooms,
  });
};

controller.discussion = async (req, res) => {
  const { user } = req.user;
  const isUserOwnDiscussion = await sql`
    select * from rooms where user1 = ${user.username} or user2 = ${user.username}
  `;

  if (isUserOwnDiscussion.length === 0) {
    return res
      .status(400)
      .json({ error: "You don't have access to the discussion" });
  } else {
    const discussion = await sql`
    select * from rooms where user1 = ${req.params.receiver} and user2 = ${req.params.sender} or user2 = ${req.params.receiver} and user1 = ${req.params.sender}
  `;
    if (!!discussion) {
      res.json({ discussion });
    }
  }
};

controller.chat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'User and message are required' });
  }

  const { user } = req.user;

  const isUserExistInDiscussion = await sql`
    select * from rooms where (user1 = ${user.username} or user2 = ${user.username}) and id = ${req.query.discussion_id}
  `;

  if (isUserExistInDiscussion.length === 0) {
    return res
      .status(400)
      .json({ error: "you don't have access to this chat" });
  } else {
    const newMessage = await sql`
    insert into messages (
      message_text, sender_id, discussion_id
    ) values (
      ${message}, ${user.id}, ${req.query.discussion_id}
    )

    returning *
  `;

    console.log(newMessage);

    wss.clients.forEach((client) => {
      console.log(client);
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ newMessage }));
      }
    });

    res.send(' message sent successfully ');
  }
};

module.exports = controller;

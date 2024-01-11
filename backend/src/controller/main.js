const jwt = require('jsonwebtoken');

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

controller.item = async (req, res) => {
  res.json({
    item: ['one', 'two', 'tree', 'four'],
  });
};

module.exports = controller;

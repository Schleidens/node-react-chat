const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/main');

const controller = require('../controller/main');

router.post('/login', controller.login);
router.get('/item', isAuthenticated, controller.item);
router.post('/chat', isAuthenticated, controller.chat);

module.exports = router;
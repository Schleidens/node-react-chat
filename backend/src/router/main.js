const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/main');

const controller = require('../controller/main');

router.post('/login', controller.login);
router.get('/users', isAuthenticated, controller.users);
router.get('/rooms', isAuthenticated, controller.rooms);
router.get('/inbox/:receiver/:sender', isAuthenticated, controller.discussion);
router.post('/chat', isAuthenticated, controller.chat);

module.exports = router;

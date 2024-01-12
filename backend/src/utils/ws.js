const { server } = require('./http');

const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

module.exports = { wss };

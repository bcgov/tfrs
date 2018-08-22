const W3CWebSocket = require('websocket').w3cwebsocket;

const client = new W3CWebSocket(
  'ws://localhost:10920/ws/notifications/some_channel/',
  'tfrs-notification-v1'
);

client.onerror = function (e) {
  console.log('error');
};

client.onopen = function () {
  console.log('connection established');
};

client.onclose = function () {
  console.log('connection closed');
};

client.onmessage = function (e) {
  console.log(`received: '${e.data}'`);
};

const notifications = require('./notifications');

const http = require('http');
const httpServer = http.createServer((req, res) => {
  res.end();
});

const io = require('socket.io')(httpServer);

httpServer.listen(3000);

io.on('connect', (socket) => {
  socket.join('global');
  socket.emit('action', { type: 'SERVER_INITIATED_NOTIFICATION_RELOAD', message: 'connected' });
});

notifications.connect(io);


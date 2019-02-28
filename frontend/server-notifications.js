const notifications = require('./notifications');

const http = require('http');

const httpServer = http.createServer((req, res) => {
  res.end();
});

const io = require('socket.io')(httpServer);

httpServer.listen(3000);

notifications.setup(io);

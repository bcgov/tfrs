const notifications = require('./notifications');

const fallback = require('express-history-api-fallback');
const httpProxy = require('http-proxy');
const path = require('path');
const bundle = require('./server/webpackServer.js');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;

const proxy = httpProxy.createProxyServer();
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

if (!isProduction) {
  bundle();

  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.use(fallback('index.html', { root: publicPath }));
}

io.on('connect', (socket) => {
  socket.join('global');
  socket.emit('action', { type: 'server_notify', message: 'connected' });
});

proxy.on('error', (e) => {
  console.log('Could not connect to proxy please try again');
});

notifications.connect(io);

server.listen(port, () => {
  console.log(`server running on Port ${port}`);
});

const express = require('express');
const fallback = require('express-history-api-fallback')
const httpProxy = require('http-proxy');
const path = require('path');
const bundle = require('./server/webpackServer.js');

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;

const proxy = httpProxy.createProxyServer();
const app = express();
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

if (!isProduction) {
  bundle();

  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });

  app.use(fallback('index.html', { root: publicPath } ));
}

proxy.on('error', (e) => {
  console.log('Could not connect to proxy please try again');
});

app.listen(port, () => {
  console.log(`server running on Port ${port}`);
});

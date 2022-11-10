const Webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const path = require('path');
const http = require('http');

const webpackConfig = require('./webpack.config');
const notifications = require('./notifications');

const devServerOptions = {
  static: {
    directory: path.join(__dirname, 'public'),
    publicPath: '/',
    serveIndex: true,
    watch: {
      ignored: ['node_modules'],
      usePolling: true
    }
  },
  allowedHosts: 'all',
  historyApiFallback: {
    verbose: true,
    index: '/index.html',
    rewrites: [
      {
        from: /\/api/,
        to: '/api'
      }
    ]
  },
  devMiddleware: {
    index: '/index.html',
    publicPath: '/'
  },
  port: 3000,
  hot: false,
  client: false
};

const compiler = Webpack(webpackConfig);
const devServer = new DevServer(devServerOptions, compiler);

const websocketServer = http.createServer((req, res) => {
  res.end();
});

const io = require('socket.io')(websocketServer);

notifications.setup(io);

websocketServer.listen(5002, '0.0.0.0');

(async () => {
  await devServer.start();

  console.log('Running');
})();

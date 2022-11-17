const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('./webpack.config')
const path = require('path')
const http = require('http')
const notifications = require('./notifications')

const devServerOptions = {
  static: {
    directory: path.join(__dirname, 'public', 'build'),
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
}

// First we fire up Webpack an pass in the configuration we
// created
const compiler = Webpack(webpackConfig({ env: { production: false } }))
const devServer = new WebpackDevServer(devServerOptions, compiler)

const websocketServer = http.createServer((req, res) => {
  res.end()
})

const io = require('socket.io')(websocketServer)

notifications.setup(io)

websocketServer.listen(5002, '0.0.0.0')

const startServer = async () => {
  await devServer.start()
  console.log('Webpack Dev Server Started')
}

startServer()

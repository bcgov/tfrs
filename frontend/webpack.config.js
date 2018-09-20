const Webpack = require('webpack');
const packageJson = require('./package.json');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'index.js');
console.log('using dev');

const config = {
  // Makes sure errors in console map to the correct file
  // and line numbe
  // devtool: 'eval',
  mode: 'development',
  entry: [
    // Polyfill for Object.assign on IE11, etc
    'babel-polyfill',

    // For hot style updates
    'webpack/hot/dev-server',

    // The script refreshing the browser on none hot updates
    'webpack-dev-server/client?http://localhost:8080',

    // Our application
    mainPath
  ],
  output: {
    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the buildPath
    // as that points to where the files will eventually be bundled
    // in production
    path: buildPath,
    filename: 'bundle.js',

    // Everything related to Webpack should go through a build path,
    // localhost:3000/build. That makes proxying easier to handle
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      // I highly recommend using the babel-loader as it gives you
      // ES6/7 syntax and JSX transpiling out of the box
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath],
        query: {
          presets: ['react', 'env'],
          plugins: ['transform-object-rest-spread']
        }
      },

      // Let us also add the style-loader and css-loader, which you can
      // expand with less-loader etc
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader:
          'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader:
          'style-loader!css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file?name=[name].[ext]']
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
        loader: 'file?name=./public/assets/fonts/[name].[ext]',
        query: {
          limit: 10000
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: 'cheap-module-eval-source-map', // 'source-map', // debug
  // We have to manually add the Hot Replacement plugin when running
  // from Node
  plugins: [
    new Dotenv({
      path: '../.env'
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      __LOGOUT_TEST_URL__: JSON.stringify('https://logontest.gov.bc.ca/clp-cgi/logoff.cgi'),
      __LOGOUT_URL__: JSON.stringify('https://logon.gov.bc.ca/clp-cgi/logoff.cgi'),
      __VERSION__: JSON.stringify(packageJson.version)
    })
  ]
};

module.exports = config;

const Webpack = require('webpack');
const packageJson = require('./package.json');
const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'index.js');
// var plugins = require('webpack-load-plugins')();
// plugins.ImageminPlugin = require('imagemin-webpack-plugin');
// plugsin.imageminMozjpeg = require('imagemin-mozjpeg');

const config = {
  entry: [
    // Polyfill for Object.assign on IE11, etc
    'babel-polyfill',

    mainPath
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath],
        query: {
          presets: ['react', 'env']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?name=./images/[name].[ext]']
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
        loader: 'file-loader?name=./fonts/[name].[ext]',
        query: {
          limit: 10000
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept'
    }
  },
  plugins: [
    new Webpack.DefinePlugin({
      __LOGOUT_URL__: JSON.stringify('https://logon.gov.bc.ca/clp-cgi/logoff.cgi'),
      __VERSION__: JSON.stringify(packageJson.version)
    }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

module.exports = config;

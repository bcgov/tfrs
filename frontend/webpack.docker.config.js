const Webpack = require('webpack');
const path = require('path');
const packageJson = require('./package.json');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'index.js');
const tokenRenewalPath = path.resolve(__dirname, 'src', 'tokenRenewal.js');


const config = {
  entry: { bundle: [
    // Polyfill for Object.assign on IE11, etc
    'babel-polyfill',
    mainPath
  ],
    tokenRenewal: [
      'babel-polyfill',
      tokenRenewalPath
    ]
  }
  ,
  output: {
    filename: "[name].js",
    publicPath: '/build/',
    path: buildPath
  },
  mode: 'development',
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
  devtool: 'source-map', // 'source-map', // debug
  plugins: [
    new Webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageJson.version)
    }),
    new Webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;

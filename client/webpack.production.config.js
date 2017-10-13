var Webpack = require("webpack");
var path = require("path");
var nodeModulesPath = path.resolve(__dirname, "node_modules");
var buildPath = path.resolve(__dirname, "public", "build");
var mainPath = path.resolve(__dirname, "src", "index.js");
// var plugins = require('webpack-load-plugins')();
// plugins.ImageminPlugin = require('imagemin-webpack-plugin');
// plugsin.imageminMozjpeg = require('imagemin-mozjpeg');

// Don't set a fall back URL. The users should know immediately if the API URL
// is not set up correctly
const apiHost = process.env.API_BASE_URL;

var config = {
  entry: [
    // Polyfill for Object.assign on IE11, etc
    "babel-polyfill",

    mainPath
  ],
  output: {
    path: buildPath,
    filename: "bundle.js",
    publicPath: "/build/"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: [nodeModulesPath],
        query: {
          presets: ["react", "es2015"]
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ["file-loader?name=./images/[name].[ext]"]
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
        loader: "file-loader?name=./fonts/[name].[ext]",
        query: {
          limit: 10000
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept"
    }
  },
  plugins: [
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new Webpack.DefinePlugin({ __API__: '"' + apiHost + '"' })
  ]
};

module.exports = config;

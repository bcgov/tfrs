const Webpack = require('webpack');
const packageJson = require('./package.json');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'index.js');
const tokenRenewalPath = path.resolve(__dirname, 'src', 'tokenRenewal.js');

const config = {
  mode: 'development',
  entry: {
    bundle: [
      // For hot style updates
      'webpack/hot/dev-server',
      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client/index.js?hot=true&live-reload=true',
      '@babel/polyfill',
      // Our application
      mainPath
    ],
    // tokenRenewal: [
    //   'babel-polyfill',
    //   tokenRenewalPath
    // ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  output: {
    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the buildPath
    // as that points to where the files will eventually be bundled
    // in production
    path: buildPath,
    filename: '[name].js',

    // Everything related to Webpack should go through a build path,
    // localhost:3000/build. That makes proxying easier to handle
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [
      // I highly recommend using the babel-loader as it gives you
      // ES6/7 syntax and JSX transpiling out of the box
      {
        test: /\.jsx?$/,
        exclude: [nodeModulesPath],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              'react-hot-loader/babel'
            ]
          }
        }
      },
      {
        test: /\.(s?)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },      
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/i,
        type: 'asset/resource'
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: 'source-map',
  // We have to manually add the Hot Replacement plugin when running
  // from Node
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      title: 'TFRS',
      chunks: ['bundle', 'vendor'],
      filename: 'index.html',
      inject: true,
      favicon: './favicon.ico',
      template: './template.html'
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.DefinePlugin({
      __LOGOUT_TEST_URL__: JSON.stringify('https://logontest.gov.bc.ca/clp-cgi/logoff.cgi'),
      __LOGOUT_URL__: JSON.stringify('https://logon.gov.bc.ca/clp-cgi/logoff.cgi'),
      __VERSION__: JSON.stringify(packageJson.version),
      __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || '')
    })
  ]
};

module.exports = config;

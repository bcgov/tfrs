const Webpack = require('webpack')
const packageJson = require('./package.json')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const nodeModulesPath = path.resolve(__dirname, 'node_modules')
const buildPath = path.resolve(__dirname, 'public', 'build')
const mainPath = path.resolve(__dirname, 'src', 'index.js')

module.exports = (env) => {
  console.log('Building for ' + (env.production ? 'Production' : 'Development'))
  return {
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
      ]
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
    plugins: [
      new CopyPlugin(
        env.production
          ? { patterns: [{ from: 'public/assets/', to: 'assets/' }] }
          : {
              patterns: [
                { from: 'public/config/features.js', to: 'static/js/config/' }, // add local dev config
                { from: 'public/assets/', to: 'assets/' }
              ]
            }
      ),
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
        __VERSION__: JSON.stringify(packageJson.version),
        __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || '')
      })
    ]
  }
}

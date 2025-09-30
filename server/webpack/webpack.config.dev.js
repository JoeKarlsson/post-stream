'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV;
const fs = require('fs');
const join = path.join;
const resolve = path.resolve;

// ENV variables
const dotEnvVars = dotenv.config();

const envVariables =
  Object.assign({}, dotEnvVars);

const defines =
  Object.keys(envVariables)
    .reduce((memo, key) => {
      const val = JSON.stringify(envVariables[key]);
      memo[`__${key.toUpperCase()}__`] = val;
      return memo;
    }, {
      __NODE_ENV__: JSON.stringify(NODE_ENV)
    });

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '../../app/components/entry.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(defines),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-object-rest-spread'
            ]
          }
        }
      },
      {
        test: /\.json$/,
        type: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[hash:6][ext]'
        }
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000
          }
        }
      },
      {
        test: /(\.scss$|\.css$)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][local]__[hash:base64:5]'
              },
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'modern'
            }
          }
        ],
      }
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};

'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
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
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, '../../app/entry.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(defines),
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: 'node_modules',
      }
    ],
    loaders: [{
      test: /(\.js$)/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0'],
      },
    }, {
      test: /\.json?$/,
      loader: 'json',
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
      loader: 'file',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url?limit=10000'
    }, {
      test: /(\.scss$|\.css$)/,
      loaders: [
        'style',
        'css?modules&importLoaders=1' +
        '&localIdentName=[path][local]__[hash:base64:5]!sass',
        'sass',
      ],
    }],
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss: function() {
    return [autoprefixer];
  },
};

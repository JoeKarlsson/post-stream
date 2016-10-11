const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, '../../app/components/entry.js'),
  ],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name]-[hash].min.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false,
    }),
    new webpack.DefinePlugin({
      '__NODE_ENV__': JSON.stringify(process.env.NODE_ENV),
      '__AUTH0_CLIENT_ID__': JSON.stringify(process.env.AUTH0_CLIENT_ID),
      '__AUTH0_CLIENT_SECRET__': JSON.stringify(process.env.AUTH0_CLIENT_SECRET),
      '__AUTH0_TOKEN__': JSON.stringify(process.env.AUTH0_TOKEN),
      '__AUTH0_DOMAIN__': JSON.stringify(process.env.AUTH0_DOMAIN),
      '__AUTH0_CALLBACK_URL__': JSON.stringify(process.env.AUTH0_CALLBACK_URL),
    }),
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

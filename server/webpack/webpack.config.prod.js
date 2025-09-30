const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: [
    path.join(__dirname, '../../app/components/entry.js'),
  ],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name]-[contenthash].min.js',
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].min.css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__NODE_ENV__': JSON.stringify(process.env.NODE_ENV),
      '__AUTH0_CLIENT_ID__': JSON.stringify(process.env.AUTH0_CLIENT_ID),
      '__AUTH0_CLIENT_SECRET__': JSON.stringify(process.env.AUTH0_CLIENT_SECRET),
      '__AUTH0_TOKEN__': JSON.stringify(process.env.AUTH0_TOKEN),
      '__AUTH0_DOMAIN__': JSON.stringify(process.env.AUTH0_DOMAIN),
      '__AUTH0_CALLBACK_URL__': JSON.stringify(process.env.AUTH0_CALLBACK_URL),
    }),
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
          MiniCssExtractPlugin.loader,
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
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

'use strict';

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const favicon = require('express-favicon');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const passport = require('passport');
const isDeveloping = process.env.NODE_ENV !== 'production';
let webpackMiddleware;
let webpackHotMiddleware;
let webpackConfig;
if (isDeveloping) {
  webpackMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');
  webpackConfig = require('./webpack/webpack.config.dev.js');
}
const db = require('./models');
const post = require('./routes/post');
const auth = require('./routes/auth');
const port = isDeveloping ? 3000 : process.env.PORT;
const host = '0.0.0.0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
// app.use(favicon(`${__dirname}/favicon.ico`));

app.use('/post', post);
app.use('/auth', auth);

if (isDeveloping) {
  app.set('host', 'http://localhost');
  app.use(logger('dev'));
  app.use(errorhandler());
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });
  const response = (req, res) => {
    try {
      // Try to read from webpack memory filesystem first
      res.write(middleware.fileSystem.readFileSync(path.resolve(__dirname, 'dist/index.html')));
    } catch (error) {
      // Fallback to static file if webpack compilation failed
      console.log('Webpack compilation failed, serving static HTML file');
      res.write(fs.readFileSync(path.resolve(__dirname, 'dist/index.html')));
    }
    res.end();
  };

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', response);
  console.log('path.resolve(__dirname, dist/index.html): ', path.resolve(__dirname, 'dist/index.html'));
} else {
  app.use(express.static(`${__dirname}/dist`));
  app.get('*', (req, res) => {
    res.write(
      fs.readFileSync(path.resolve(__dirname, 'dist/index.html'))
    );
  });
}

const onStart = (err) => {
  if (err) {
    throw new Error(err);
  }
  console.info(
    `==> 🌎 Listening on port ${port}. ` +
    `Open up http://${host}:${port}/ in your browser.`
  );
  db.sequelize.sync(
    // {force: true}
  );
};

if (!module.parent) {
  app.listen(port, host, onStart);
}

module.exports = app;

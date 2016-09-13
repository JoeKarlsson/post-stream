'use strict';

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const CONFIG = require('./config/config.json');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack/webpack.config.dev.js');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const favicon = require('express-favicon');
const Promise = require('bluebird');

const db = require('./models');
const User = db.User;

const user = require('./routes/user');
const post = require('./routes/post');
const root = require('./routes/root');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

app.use(session(
  {
    secret : CONFIG.SESSION.secret,
    resave : false,
    saveUninitialized : true
  }
));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(favicon(`${__dirname}/favicon.ico`));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

// local strategy checks our local DB to authenticate users
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({
      where : {
        username : username
      }
    })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return done(null, false);
        }
        if (res) {
          console.log('success')
          return done(null, user);
        }
        return done(null, false);
      });
    });
  }
));

Promise.onPossiblyUnhandledRejection((err) => {
  throw new Error(err);
});

app.use('/api/user', user);
app.use('/post', post);
app.use('/api', root);

if (isDeveloping) {
  app.set('host', 'http://localhost');
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
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
    res.write(middleware.fileSystem.readFileSync(path.resolve(__dirname, 'dist/index.html')));
    res.end();
  };

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', response);
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
    `Open up http://localhost:${port}/ in your browser.`
  );
  db.sequelize.sync(
    // {force: true}
  );
};

if (!module.parent) {
  app.listen(port, 'localhost', onStart);
}

module.exports = app;

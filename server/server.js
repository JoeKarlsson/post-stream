'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const passport = require('passport');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const isDeveloping = process.env.NODE_ENV !== 'production';
const db = require('./models');
const post = require('./routes/post');
const auth = require('./routes/auth');
const { securityHeaders } = require('./middleware/securityHeaders');
const { postsAsText } = require('./plainText');
const port = isDeveloping ? 3001 : process.env.PORT;
const host = '0.0.0.0';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || (isDeveloping ? 'http://localhost:3000' : false),
  credentials: true,
  optionsSuccessStatus: 200
};

app.disable('x-powered-by');
app.use(securityHeaders);
app.use(compression());
app.use(cors(corsOptions));
if (isDeveloping && require.main === module) {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    await db.sequelize.authenticate();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error.message
    });
  }
});

// Rate limits cover the API only (not static files), and only in production
const noLimit = (req, res, next) => next();
app.use('/post', isDeveloping ? noLimit : limiter, post);

// A user's posts as plain text: curl http://localhost:3000/user/janedoe343.txt
app.get('/user/:file', async (req, res, next) => {
  const match = /^([a-zA-Z0-9]+)\.txt$/.exec(req.params.file);
  if (!match) {
    return next(); // not a .txt request: the app's own /user/:name page
  }
  const username = match[1];
  if (!(await db.User.count({ where: { username } }))) {
    return res.status(404).type('text/plain').send(`no user named ${username}\n`);
  }
  const posts = await db.Post.findAll({
    where: { userID: username },
    order: [['createdAt', 'DESC'], ['id', 'DESC']],
    limit: 100
  });
  res.type('text/plain').send(postsAsText(username, posts));
});
app.use('/auth', isDeveloping ? noLimit : limiter, isDeveloping ? noLimit : authLimiter, auth);

// Bad input from any route (model validation) is the client's fault, not a 500
app.use((err, req, res, next) => {
  // UniqueConstraintError (two sign-ups racing for one username) is a validation error too
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors.map((e) => e.message).join('; ') });
  }
  next(err);
});

if (isDeveloping) {
  // In development, Vite serves the frontend on port 3000; this server only handles the API
  app.use(errorhandler());
} else {
  // Vite puts a content hash in every file under /assets, so they never change
  app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), { immutable: true, maxAge: '1y' }));
  // Everything else (index.html, icons) revalidates so a new deploy shows up
  app.use(express.static(path.join(__dirname, 'dist'), { maxAge: 0 }));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
};

if (require.main === module) {
  app.listen(port, host, onStart);
}

module.exports = app;

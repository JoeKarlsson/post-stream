'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const favicon = require('express-favicon');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const passport = require('passport');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const isDeveloping = process.env.NODE_ENV !== 'production';
const db = require('./models');
const post = require('./routes/post');
const auth = require('./routes/auth');
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

app.use(cors(corsOptions));
// Only apply rate limiting in production
if (!isDeveloping) {
  app.use(limiter);
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
// app.use(favicon(`${__dirname}/favicon.ico`));

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

app.use('/post', post);
// Only apply auth rate limiting in production
if (!isDeveloping) {
  app.use('/auth', authLimiter, auth);
} else {
  app.use('/auth', auth);
}

if (isDeveloping) {
  app.set('host', 'http://localhost');
  app.use(logger('dev'));
  app.use(errorhandler());
  // In development, Vite serves the frontend on port 3000
  // The server only handles API routes
} else {
  app.use(express.static(`${__dirname}/dist`));
  app.get('*', (req, res) => {
    res.write(
      fs.readFileSync(path.resolve(__dirname, 'dist/index.html'))
    );
    res.end();
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

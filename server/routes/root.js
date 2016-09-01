const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('./../models');
const User = db.User;

router.route('/register')
  // Create a new user
  .post((req, res) => {
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          res.json({ error: err });
        }
        User.create({
          username: req.body.username,
          password: hash,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          bio: req.body.bio,
          following: [req.body.following]
        })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          res.json({ error: err });
        })
      });
    });

  })

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (!user) {
      return res.json({ success: false })
    }
    req.logIn(user, () => {
      const userSuccess = {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio,
        following: user.following,
        createdAt: user.createdAt,
        success: true,
      };
      return res.json(userSuccess)
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

module.exports = router;

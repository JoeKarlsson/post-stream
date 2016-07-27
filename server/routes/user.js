'use strict';

const express = require('express');
const router = express.Router();
const db = require('./../models');
const User = db.User;
const Post = db.Post;

const exists = (req) => {
  if (typeof parseInt(req.params.id) === 'number') {
    Post.findById(req.params.id)
      .then((post) => {
        if (post) {
          return true;
        };
        return false;
      })
      .catch((err) => {
        return false;
      })
  } else {
    return false;
  }
};

router.route('/')
  // return an array of all the users
  .get((req, res) => {
    User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json({ error: err });
    })
  })

router.route('/new')
  // Create a new user
  .post((req, res) => {
    User.create({
      username: req.body.username,
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
  })

router.route('/:id')
  // GET one user by ID
  .get((req, res) => {
    if(exists) {
      User.findOne({
        id: req.params.id
      })
      .then((user) => {
        res.json(user);
      });
    } else {
      res.json({ success: false });
    }
  })
  // DELETE user from database by ID
  .delete((req, res) => {
    if(exists) {
      User.destroy({
        where : {
          id : req.params.id
        }
      })
      .then((data) => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  });

router.route('/:id/edit')
  // find by id and update the post
  .put((req, res) => {
    if(exists) {
      User.findById(req.params.id)
      .then((foundUser) => {
        // then update
        foundUser.following.push(req.body.following);
        console.log('foundUser.following: ', foundUser.following);

        foundUser.update({
          username: req.body.username,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          bio: req.body.bio,
          following: foundUser.following
        })
        .then((newUser) => {
          res.json(newUser);
        })
        .catch((err) => {
          res.json({ error: err });
        })
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  })

router.route('/:id/posts')
  // get an array of all the users posts
  .get((req, res) => {
    Post.findAll({
      where : {
        UserId : req.params.id
      }
    })
    .then((userPosts) => {
      res.json(userPosts);
    })
    .catch((err) => {
      res.json({ error: err });
    })
  })

router.route('/:id/following')
  // get an array of all the users followings posts
  .get((req, res) => {
    User.findAll({
      where : {
        id : req.params.id
      }
    })
    .then((user) => {
      const following = user[0].dataValues.following;

      Post.findAll({
        where : {
          UserId : {
            $any: following
          }
        }
      })
      .then((userPosts) => {
        res.json(userPosts);
      })
      .catch((err) => {
        res.json({ error: err });
      })

    })
    .catch((err) => {
      res.json({ error: err });
    })

  })

module.exports = router;

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
  // GET all of the posts
  .get((req, res) => {
    Post.findAll()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.json({ error: err });
    });
  })

router.route('/:id')
  // GET one post by ID
  .get((req, res) => {
    if(exists) {
      Post.findOne({
        id: req.params.id
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  })
  // DELETE post from database by ID
  .delete((req, res) => {
    if(exists) {
      Post.destroy({
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
      Post.findById(req.params.id)
      .then((foundPost) => {
        // then update
        foundPost.update({
          body : req.body.body,
        })
        .then((newPost) => {
          res.json(newPost);
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

router.route('/new')
  // create a new post
  // TODO - updated user when AUTH is working
  .post((req, res) => {
    Post.create({
      body: req.body.body,
      UserId: '3'
    })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json({ error: err });
    })
  })

module.exports = router;

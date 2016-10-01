'use strict';

const express = require('express');
const router = express.Router();
const db = require('./../models');
const Post = db.Post;

router.route('/')
  // GET all of the posts
  .get((req, res) => {
    Post.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.json({ error: err });
    });
  })

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const db = require('./../models');
const { authenticateJWT } = require('./../middleware/jwt');

const { Post, Comment } = db;
const FEED_LIMIT = 10;
// Newest first; id breaks ties so paging is stable when timestamps match
const NEWEST_FIRST = [['createdAt', 'DESC'], ['id', 'DESC']];

// ?offset=N skips the first N posts, for "show more"
const pageOf = (req) => {
  const offset = Number.parseInt(req.query.offset ?? '0', 10);
  return { limit: FEED_LIMIT, offset: Number.isNaN(offset) || offset < 0 ? 0 : offset, order: NEWEST_FIRST };
};

// Loads req.params[paramName] from Model into req.found, or answers 404.
// With ownerOnly, answers 403 unless the logged-in user wrote it.
const loadRecord = (Model, paramName, { ownerOnly = false } = {}) =>
  async (req, res, next) => {
    const record = await Model.findByPk(req.params[paramName]);
    if (!record) {
      return res.status(404).json({ error: `${Model.name} not found` });
    }
    if (ownerOnly && record.userID !== req.user.username) {
      return res.status(403).json({ error: `You can only change your own ${Model.name.toLowerCase()}s` });
    }
    req.found = record;
    next();
  };

router.get('/', async (req, res) => {
  const posts = await Post.findAll(pageOf(req));
  res.json(posts);
});

router.post('/new', authenticateJWT, async (req, res) => {
  const post = await Post.create({ body: req.body.body, userID: req.user.username });
  res.json(post);
});

router.get('/user/:username', async (req, res) => {
  const posts = await Post.findAll({ where: { userID: req.params.username }, ...pageOf(req) });
  res.json(posts);
});

router.get('/:id', loadRecord(Post, 'id'), (req, res) => {
  res.json(req.found);
});

router.delete('/:id', authenticateJWT, loadRecord(Post, 'id', { ownerOnly: true }), async (req, res) => {
  await req.found.destroy();
  res.json({ success: true });
});

router.put('/:id/edit', authenticateJWT, loadRecord(Post, 'id', { ownerOnly: true }), async (req, res) => {
  res.json(await req.found.update({ body: req.body.body }));
});

router.get('/:id/comments', async (req, res) => {
  const comments = await Comment.findAll({
    where: { PostId: req.params.id },
    order: [['createdAt', 'ASC']]
  });
  res.json(comments);
});

// :CommentId is kept in the URL for older clients; replies are flat (always 0)
router.post('/:id/comments/:CommentId/new', authenticateJWT, loadRecord(Post, 'id'), async (req, res) => {
  const comment = await Comment.create({
    body: req.body.body,
    userID: req.user.username,
    PostId: req.found.id
  });
  await req.found.increment('commentCount');
  res.json(comment);
});

router.put('/:id/comments/:CommentId/edit', authenticateJWT, loadRecord(Comment, 'CommentId', { ownerOnly: true }), async (req, res) => {
  res.json(await req.found.update({ body: req.body.body }));
});

module.exports = router;

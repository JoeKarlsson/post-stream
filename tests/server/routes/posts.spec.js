'use strict';

// Runs against the development database; needs the seed data (npm run db:seed).
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../server/server.js');
const db = require('../../../server/models');

const login = async (email) => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password: 'password123' })
    .expect(200);
  return res.body.token;
};

describe('Post routes', () => {
  let john;
  let jane;
  let createdPostId;

  before(async () => {
    john = await login('john@example.com');
    jane = await login('jane@example.com');
  });

  beforeEach(async () => {
    const post = await request(app)
      .post('/post/new')
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'spec post', userID: 'someone-else' })
      .expect(200);
    createdPostId = post.body.id;
    expect(post.body.userID).to.equal('johndoe131');
  });

  afterEach(async () => {
    await db.Post.destroy({ where: { id: createdPostId } });
  });

  it('attaches a reply to its post and takes the author from the token', async () => {
    await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ body: 'spec reply' })
      .expect(200);

    const comments = await request(app).get(`/post/${createdPostId}/comments`).expect(200);
    expect(comments.body).to.have.length(1);
    expect(comments.body[0]).to.include({
      body: 'spec reply',
      userID: 'janedoe343',
      PostId: createdPostId,
    });

    const post = await request(app).get(`/post/${createdPostId}`).expect(200);
    expect(post.body.commentCount).to.equal(1);
  });

  it('rejects creating a post without a token', async () => {
    await request(app).post('/post/new').send({ body: 'nope' }).expect(401);
  });

  it('rejects a post longer than 255 characters with a 400', async () => {
    const res = await request(app)
      .post('/post/new')
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'x'.repeat(256) })
      .expect(400);
    expect(res.body.error).to.match(/255/);
  });

  it("only lets the author edit or delete a post", async () => {
    await request(app)
      .put(`/post/${createdPostId}/edit`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ body: 'hijacked' })
      .expect(403);
    await request(app)
      .delete(`/post/${createdPostId}`)
      .set('Authorization', `Bearer ${jane}`)
      .expect(403);

    const edited = await request(app)
      .put(`/post/${createdPostId}/edit`)
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'edited by owner' })
      .expect(200);
    expect(edited.body.body).to.equal('edited by owner');
  });

  it('lets the author delete a post, and only edit their own comments', async () => {
    const comment = await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ body: 'janes comment' })
      .expect(200);
    await request(app)
      .put(`/post/${createdPostId}/comments/${comment.body.id}/edit`)
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'not yours' })
      .expect(403);
    await request(app)
      .put(`/post/${createdPostId}/comments/${comment.body.id}/edit`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ body: 'edited' })
      .expect(200);

    await request(app).delete(`/post/${createdPostId}`).set('Authorization', `Bearer ${john}`).expect(200);
    await request(app).get(`/post/${createdPostId}`).expect(404);
    expect(await db.Comment.count({ where: { PostId: createdPostId } })).to.equal(0);
  });

  it("lists one user's posts", async () => {
    const res = await request(app).get('/post/user/johndoe131').expect(200);
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body.every((p) => p.userID === 'johndoe131')).to.equal(true);
  });

  it('returns 404 for a post that does not exist', async () => {
    await request(app).get('/post/999999').expect(404);
  });
});

describe('Profile and follow routes', () => {
  let jane;

  before(async () => {
    jane = await login('jane@example.com');
  });

  afterEach(async () => {
    await request(app)
      .delete('/auth/user/johndoe131/follow')
      .set('Authorization', `Bearer ${jane}`);
  });

  it('shows a public profile without the email address', async () => {
    const res = await request(app).get('/auth/user/johndoe131').expect(200);
    expect(res.body.user).to.include({ username: 'johndoe131', first_name: 'John' });
    expect(res.body.user).to.not.have.property('email');
    expect(res.body.user).to.not.have.property('password');
  });

  it('follows and unfollows a user', async () => {
    await request(app)
      .post('/auth/user/johndoe131/follow')
      .set('Authorization', `Bearer ${jane}`)
      .expect(200);
    let profile = await request(app).get('/auth/user/johndoe131');
    expect(profile.body.user.followers).to.deep.equal(['janedoe343']);

    await request(app)
      .delete('/auth/user/johndoe131/follow')
      .set('Authorization', `Bearer ${jane}`)
      .expect(200);
    profile = await request(app).get('/auth/user/johndoe131');
    expect(profile.body.user.followers).to.deep.equal([]);
  });

  it("won't let a user follow themselves", async () => {
    await request(app)
      .post('/auth/user/janedoe343/follow')
      .set('Authorization', `Bearer ${jane}`)
      .expect(400);
  });
});

describe('Feed paging', () => {
  it('pages through posts newest first with no repeats', async () => {
    const first = await request(app).get('/post').expect(200);
    const second = await request(app).get('/post?offset=5').expect(200);
    expect(first.body).to.have.length.at.most(10);
    expect(first.body.slice(5).map((p) => p.id)).to.deep.equal(second.body.slice(0, first.body.length - 5).map((p) => p.id));
  });

  it('treats a bad offset as the first page', async () => {
    const first = await request(app).get('/post').expect(200);
    const bad = await request(app).get('/post?offset=-3').expect(200);
    expect(bad.body.map((p) => p.id)).to.deep.equal(first.body.map((p) => p.id));
  });
});

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
      .send({ kind: 'agree_because', detail: 'spec reason' })
      .expect(200);

    const comments = await request(app).get(`/post/${createdPostId}/comments`).expect(200);
    expect(comments.body).to.have.length(1);
    expect(comments.body[0]).to.include({
      body: 'agree, because spec reason',
      kind: 'agree_because',
      userID: 'janedoe343',
      PostId: createdPostId,
    });

    const post = await request(app).get(`/post/${createdPostId}`).expect(200);
    expect(post.body.commentCount).to.equal(1);
  });

  it('rejects creating a post without a token', async () => {
    await request(app).post('/post/new').send({ body: 'nope' }).expect(401);
  });

  it('rejects a post longer than 2048 characters with a 400', async () => {
    const res = await request(app)
      .post('/post/new')
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'x'.repeat(2049) })
      .expect(400);
    expect(res.body.error).to.match(/2048/);
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
      .send({ kind: 'thanks' })
      .expect(200);
    await request(app)
      .put(`/post/${createdPostId}/comments/${comment.body.id}/edit`)
      .set('Authorization', `Bearer ${john}`)
      .send({ kind: 'agree' })
      .expect(403);
    await request(app)
      .put(`/post/${createdPostId}/comments/${comment.body.id}/edit`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ kind: 'brilliant' })
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

  it('only takes contextual responses as replies', async () => {
    const freeForm = await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ body: 'free-form text' })
      .expect(400);
    expect(freeForm.body.error).to.match(/Pick one of/);

    await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ kind: 'disagree_because', detail: '   ' })
      .expect(400);
  });

  it('marks a post edited only when its author edits it', async () => {
    const before = await request(app).get(`/post/${createdPostId}`).expect(200);
    expect(before.body.editedAt).to.equal(null);

    // A reply changes commentCount (and updatedAt) but isn't an edit
    await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${jane}`)
      .send({ kind: 'agree' })
      .expect(200);
    expect((await request(app).get(`/post/${createdPostId}`)).body.editedAt).to.equal(null);

    await request(app)
      .put(`/post/${createdPostId}/edit`)
      .set('Authorization', `Bearer ${john}`)
      .send({ body: 'edited' })
      .expect(200);
    expect((await request(app).get(`/post/${createdPostId}`)).body.editedAt).to.be.a('string');
  });

  it('serves a user\'s posts as plain text', async () => {
    const res = await request(app).get('/user/johndoe131.txt').expect(200);
    expect(res.headers['content-type']).to.match(/^text\/plain/);
    expect(res.text).to.match(/^# johndoe131 on PostStream/);
    expect(res.text).to.include('<johndoe131>');
    expect(res.text).to.include('spec post');
    await request(app).get('/user/nobodyatall.txt').expect(404);
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

  it('lists everyone by name only, alphabetically', async () => {
    const res = await request(app).get('/auth/users').expect(200);
    const names = res.body.map((u) => u.username);
    expect(names).to.include.members(['janedoe343', 'johndoe131', 'joejoebinks131']);
    expect(names).to.deep.equal([...names].sort());
    expect(res.body[0]).to.have.all.keys('username', 'first_name', 'last_name');
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
    expect(profile.body.user.followers).to.include('janedoe343');

    await request(app)
      .delete('/auth/user/johndoe131/follow')
      .set('Authorization', `Bearer ${jane}`)
      .expect(200);
    profile = await request(app).get('/auth/user/johndoe131');
    expect(profile.body.user.followers).to.not.include('janedoe343');
  });

  it("won't let a user follow themselves", async () => {
    await request(app)
      .post('/auth/user/janedoe343/follow')
      .set('Authorization', `Bearer ${jane}`)
      .expect(400);
  });
});

describe('Feeds', () => {
  let john;
  let jane;

  before(async () => {
    john = await login('john@example.com');
    jane = await login('jane@example.com');
  });

  it('has no global feed, only your own (logged in)', async () => {
    await request(app).get('/post/feed').expect(401);
  });

  it('shows posts from people you follow, plus your own', async () => {
    // Seeds: john follows jane and joe; jane follows nobody
    const johns = await request(app).get('/post/feed').set('Authorization', `Bearer ${john}`).expect(200);
    expect(new Set(johns.body.map((p) => p.userID))).to.deep.equal(new Set(['johndoe131', 'janedoe343', 'joejoebinks131']));
    const janes = await request(app).get('/post/feed').set('Authorization', `Bearer ${jane}`).expect(200);
    expect(new Set(janes.body.map((p) => p.userID))).to.deep.equal(new Set(['janedoe343']));
  });

  it('pages newest first with no repeats', async () => {
    const auth = { Authorization: `Bearer ${john}` };
    const first = await request(app).get('/post/feed').set(auth).expect(200);
    const second = await request(app).get('/post/feed?offset=5').set(auth).expect(200);
    expect(first.body).to.have.length.at.most(10);
    expect(first.body.slice(5).map((p) => p.id)).to.deep.equal(second.body.slice(0, first.body.length - 5).map((p) => p.id));
  });

  it('treats a bad offset as the first page', async () => {
    const auth = { Authorization: `Bearer ${john}` };
    const first = await request(app).get('/post/feed').set(auth).expect(200);
    const bad = await request(app).get('/post/feed?offset=-3').set(auth).expect(200);
    expect(bad.body.map((p) => p.id)).to.deep.equal(first.body.map((p) => p.id));
  });
});

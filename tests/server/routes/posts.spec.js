'use strict';

// Runs against the development database; needs the seed data (npm run db:seed).
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../server/server.js');
const db = require('../../../server/models');

describe('Post comment routes', () => {
  let token;
  let createdPostId;

  before(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password123' })
      .expect(200);
    token = res.body.token;
  });

  after(async () => {
    if (createdPostId) {
      await db.Post.destroy({ where: { id: createdPostId } });
    }
  });

  it('attaches a reply to its post and takes the author from the token', async () => {
    const post = await request(app)
      .post('/post/new')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'spec post', userID: 'someone-else' })
      .expect(200);
    createdPostId = post.body.id;
    expect(post.body.userID).to.equal('johndoe131');

    await request(app)
      .post(`/post/${createdPostId}/comments/0/new`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'spec reply' })
      .expect(200);

    const comments = await request(app)
      .get(`/post/${createdPostId}/comments`)
      .expect(200);
    expect(comments.body).to.have.length(1);
    expect(comments.body[0]).to.include({
      body: 'spec reply',
      userID: 'johndoe131',
      PostId: createdPostId,
    });
  });

  it('rejects creating a post without a token', async () => {
    await request(app).post('/post/new').send({ body: 'nope' }).expect(401);
  });
});

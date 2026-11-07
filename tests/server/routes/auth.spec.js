'use strict';

// Runs against the development database; needs the seed data (npm run db:seed).
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../server/server.js');
const db = require('../../../server/models');

describe('Auth routes', () => {
  const username = `spec${Date.now()}`;
  const email = `${username}@example.com`;
  let token;

  after(async () => {
    await db.User.destroy({ where: { username } });
  });

  it('registers a user and returns a token, without the password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username, email, password: 'specpass1', first_name: 'Spec', last_name: 'User', bio: '' })
      .expect(201);
    token = res.body.token;
    expect(token).to.be.a('string');
    expect(res.body.user).to.include({ username, email });
    expect(res.body.user).to.not.have.property('password');
  });

  it('refuses a username or email that is already taken', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username, email: `other-${email}`, password: 'specpass1' })
      .expect(400);
  });

  it('returns field errors as a 400, not a 500', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'x!', email: 'not-an-email', password: '123' })
      .expect(400);
    expect(res.body.error).to.be.a('string').and.not.equal('Registration failed');
  });

  it('rejects a wrong password with a 401', async () => {
    const res = await request(app).post('/auth/login').send({ email, password: 'wrong-pass' }).expect(401);
    expect(res.body.error).to.equal('Invalid email or password');
  });

  it('updates your own name and bio', async () => {
    const res = await request(app)
      .put('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: 'Changed', last_name: 'Name', bio: 'new bio' })
      .expect(200);
    expect(res.body.user).to.include({ first_name: 'Changed', bio: 'new bio' });
  });

  it('changes the password only with the current one, and rejects a short new one', async () => {
    await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'wrong-pass', newPassword: 'specpass2' })
      .expect(400);
    await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'specpass1', newPassword: '123' })
      .expect(400);
    await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'specpass1', newPassword: 'specpass2' })
      .expect(200);
    await request(app).post('/auth/login').send({ email, password: 'specpass2' }).expect(200);
  });

  it('answers 404 for a profile that does not exist', async () => {
    await request(app).get('/auth/user/nobody-by-this-name').expect(404);
  });

  it('rejects requests with a bad token', async () => {
    await request(app).get('/auth/profile').set('Authorization', 'Bearer not-a-token').expect(401);
  });
});

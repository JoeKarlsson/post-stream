'use strict';

const path = require('path');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../../server/server.js');

describe('Users Routes Test', () => {

  beforeEach((done) => {
    //setup server
    app()

  });

  describe('GET /users', () => {
    it('should return an array', function (done) {
      this.timeout(0);
      request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.be.an('array');
        return done();
      })
    })
  });

  describe('POST /users', () => {
    it('should create a new user', function (done) {
      this.timeout(0);
      request(app)
      .post('/users', {
        username: 'joejoebinks3',
        first_name: 'Joe',
        last_name: 'Carlson',
        bio: 'I am new user on this site'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.be.an('object');
        return done();
      })
    })
  });

});

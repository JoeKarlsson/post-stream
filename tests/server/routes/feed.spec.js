'use strict';

const path = require('path');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../../server/server.js');

describe('Film Routes Test', () => {
  describe('GET /api/film', () => {
    it('should send JSON with an array of films', (done) => {
      return done();
    });
  });

});

'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server/server.js');

describe('Security headers', () => {
  it('sends a strict CSP and the standard hardening headers', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-security-policy']).to.include("script-src 'self'");
    expect(res.headers['content-security-policy']).to.include("frame-ancestors 'none'");
    expect(res.headers).to.include({
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'strict-origin-when-cross-origin'
    });
    expect(res.headers).to.not.have.property('x-powered-by');
  });
});

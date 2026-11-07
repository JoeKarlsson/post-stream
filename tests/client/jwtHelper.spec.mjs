import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { isTokenExpired } from '../../app/components/shared/auth/jwtHelper.ts';

describe('isTokenExpired', () => {
  const now = new Date('2026-01-01T00:00:00Z');
  const tokenExpiringAt = (date) =>
    jwt.sign({ id: 1, exp: Math.floor(date.getTime() / 1000) }, 'test-secret');

  it('is false before the expiry time', () => {
    expect(isTokenExpired(tokenExpiringAt(new Date('2026-01-02T00:00:00Z')), now)).to.equal(false);
  });

  it('is true once the expiry time has passed', () => {
    expect(isTokenExpired(tokenExpiringAt(new Date('2025-12-31T00:00:00Z')), now)).to.equal(true);
  });

  it('treats an unreadable token as expired instead of throwing', () => {
    expect(isTokenExpired('not-a-jwt', now)).to.equal(true);
  });
});

import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { decodeToken } from '#libs/jwt';
import { verifyToken } from '#middlewares/verifyToken';
import { logger } from '#utils/logger';

vi.mock('#config/environment', () => ({
  JWT_SECRET: 'test-secret',
}));

vi.mock('#libs/jwt', () => ({
  decodeToken: vi.fn(),
}));

describe('verifyToken Middleware', () => {
  test('Should call next() if the token is valid', async () => {
    vi.mocked(decodeToken).mockResolvedValue({
      id: 1,
      role: 'user',
      accessLevel: 'basic',
    });
    const req = createRequest({
      cookies: { accessToken: 'valid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(decodeToken).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(next).toHaveBeenCalled();
  });

  test('Should call next() if the token is valid in the header', async () => {
    vi.mocked(decodeToken).mockResolvedValue({
      id: 2,
      role: 'admin',
      accessLevel: 'high',
    });
    const req = createRequest({
      headers: { authorization: 'Bearer valid-token-header' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);

    expect(decodeToken).toHaveBeenCalledWith(
      'valid-token-header',
      expect.any(String),
    );
    expect(next).toHaveBeenCalled();
  });

  test('Should respond with 401 if no token is provided', async () => {
    const req = createRequest({
      cookies: {},
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
  });

  test('Should respond with 401 if the token is invalid', async () => {
    const spiedLogger = vi.spyOn(logger, 'error').mockImplementation(vi.fn());
    vi.mocked(decodeToken).mockRejectedValue(new Error('Invalid token'));
    const req = createRequest({
      cookies: { accessToken: 'invalid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(spiedLogger).toHaveBeenCalledWith(
      'Token verification failed:',
      'Invalid token',
    );
  });

  test('does not logs non-Error exceptions', async () => {
    const spiedLogger = vi.spyOn(logger, 'error').mockImplementation(vi.fn());
    vi.mocked(decodeToken).mockRejectedValue('Some string error');
    const req = createRequest({
      cookies: { accessToken: 'invalid-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    await verifyToken(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(spiedLogger).toHaveBeenCalledWith(
      'Token verification failed:',
      'Invalid token',
    );
  });
});

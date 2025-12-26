import { afterEach, describe, expect, test, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';

describe('CORS Middleware', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('sets CORS headers correctly for an allowed origin in production', async () => {
    vi.doMock('#config/environment', () => ({
      NODE_ENV: 'production',
    }));
    const { cors } = await import('#middlewares/cors');

    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/test',
        headers: {
          origin: 'https://allowed-origin.com',
        },
      }),
      res = createResponse();

    const corsMiddleware = cors({
      origins: ['https://allowed-origin.com'],
      methods: ['GET', 'POST'],
      headers: ['Content-Type', 'Authorization'],
    });
    corsMiddleware(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBe(
      'https://allowed-origin.com',
    );
    expect(res.getHeader('Access-Control-Allow-Methods')).toBe('GET, POST');
    expect(res.getHeader('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    );
    expect(res.getHeader('Access-Control-Allow-Credentials')).toBe('true');
    expect(next).toHaveBeenCalled();
  });

  test('does not set CORS headers for a disallowed origin in production', async () => {
    vi.doMock('#config/environment', () => ({
      NODE_ENV: 'production',
    }));
    const { cors } = await import('#middlewares/cors');

    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/test',
        headers: {
          origin: 'https://not-allowed-origin.com',
        },
      }),
      res = createResponse();

    const corsMiddleware = cors({
      origins: ['https://allowed-origin.com'],
    });
    corsMiddleware(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBe('');
    expect(next).toHaveBeenCalled();
  });

  test('sets Access-Control-Allow-Origin to * in development', async () => {
    vi.doMock('#config/environment', () => ({
      NODE_ENV: 'development',
    }));
    const { cors } = await import('#middlewares/cors');

    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/test',
        headers: {
          origin: 'https://any-origin.com',
        },
      }),
      res = createResponse();

    const corsMiddleware = cors({
      origins: ['https://allowed-origin.com'],
    });
    corsMiddleware(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBe('*');
    expect(next).toHaveBeenCalled();
  });

  test('responds with 204 for OPTIONS requests', async () => {
    // No mock needed, but we import dynamically to be safe with resetModules
    const { cors } = await import('#middlewares/cors');
    const next = vi.fn(),
      req = createRequest({
        method: 'OPTIONS',
        url: '/test',
        headers: {
          origin: 'https://allowed-origin.com',
        },
      }),
      res = createResponse();

    const corsMiddleware = cors({
      origins: ['https://allowed-origin.com'],
    });
    corsMiddleware(req, res, next);

    expect(res.statusCode).toBe(204);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() if there is no Origin header', async () => {
    vi.doMock('#config/environment', () => ({
      NODE_ENV: 'production',
    }));
    const { cors } = await import('#middlewares/cors');

    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/test',
      }),
      res = createResponse();

    const corsMiddleware = cors({
      origins: ['https://allowed-origin.com'],
    });
    corsMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('skips CORS configuration if skip is true', async () => {
    vi.doMock('#config/environment', () => ({
      NODE_ENV: 'production',
    }));
    const { cors } = await import('#middlewares/cors');

    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/test',
        headers: {
          origin: 'https://allowed-origin.com',
        },
      }),
      res = createResponse();

    const corsMiddleware = cors({
      skip: true,
      origins: ['https://allowed-origin.com'],
    });
    corsMiddleware(req, res, next);

    expect(res.getHeader('Access-Control-Allow-Origin')).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});

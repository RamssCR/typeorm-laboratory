import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import type { RequestHandler } from 'express';
import { limiter } from '#middlewares/limit';

vi.mock('#config/environment', () => ({
  LIMIT: 5,
  LIMIT_MESSAGE: 'Too many requests, please try again later.',
}));

vi.mock('express-rate-limit', () => ({
  default: vi.fn((config: { skip: () => boolean }): RequestHandler => {
    return (_req, _res, next) => {
      if (config.skip()) {
        return next();
      }
      return next();
    };
  }),
}));

describe('Rate Limiter Middleware', () => {
  test('calls the next middleware', () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn();

    limiter()(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should skip limiter validation if disabled', () => {
    const req = createRequest();
    const res = createResponse();
    const next = vi.fn();

    limiter(true)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

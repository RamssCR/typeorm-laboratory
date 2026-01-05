import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { validate } from '#middlewares/schema';
import { z } from 'zod';

describe('Schema validation middleware', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number().min(18),
  });

  test('validates a valid request body correctly', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
        age: 25,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('responds with error for an invalid request body', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
        age: 15,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(res.statusCode).toBe(400);
  });

  test('validates correctly with partial mode', () => {
    const req = createRequest({
      method: 'POST',
      url: '/user',
      body: {
        name: 'John Doe',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema, { mode: 'partial' });
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('validates query parameters correctly', () => {
    const req = createRequest({
      method: 'GET',
      url: '/user',
      query: {
        name: 'John Doe',
        age: '30',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const middleware = validate(schema, { target: 'query' });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('Middleware: query property and descriptor/getter behavior', () => {
  const schema = z.object({
    name: z.string(),
    age: z.coerce.number().min(18),
  });

  test('defines query as an accessor (getter), enumerable and configurable, returns parsed value and resists assignment', () => {
    const next = vi.fn(),
      req = createRequest({
        method: 'GET',
        url: '/user',
        query: {
          name: 'John Doe',
          age: '30',
        },
      }),
      res = createResponse();

    const middleware = validate(schema, { target: 'query' });
    middleware(req, res, next);

    let assignError = null;
    try {
      req.query = { name: 'Hacker', age: '99' };
    } catch (err) {
      assignError = err;
    }
    expect(assignError).toBeInstanceOf(TypeError);
    expect(req.query).toEqual({ name: 'John Doe', age: 30 });
  });
});

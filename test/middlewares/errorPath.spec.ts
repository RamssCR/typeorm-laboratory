import { createRequest, createResponse } from 'node-mocks-http';
import { describe, expect, test, vi } from 'vitest';
import { errorPath } from '#middlewares/errorPath';

describe('Error Path Middleware', () => {
  test('should return a 404 error message', () => {
    const req = createRequest();
    const res = createResponse();
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn();

    const next = vi.fn();

    errorPath(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

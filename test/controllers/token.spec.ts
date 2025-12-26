import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { getTokenById, getTokens } from '#controllers/token';
import type { Pagination } from '#types/pagination';
import type { Token } from '#models/token';
import { TokenService } from '#services/token';

vi.mock('#services/token');

describe('Token Controller', () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('getTokens - should retrieve tokens successfully', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/tokens',
      user: { id: 1 },
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockTokens = {
      items: [
        { id: 1, token: 'token1', user: { id: 1 } },
        { id: 2, token: 'token2', user: { id: 1 } },
      ],
      page: 1,
      pages: 10,
      total: 2,
    } as Pagination<Token>;

    vi.spyOn(service, 'findAll').mockResolvedValue(mockTokens);

    const handler = getTokens(service);
    await handler(req, res, next);

    expect(service.findAll).toHaveBeenCalledWith(1, {
      page: 1,
      limit: 10,
      offset: 0,
    });
    expect(res._getStatusCode()).toBe(200);
  });

  test('getTokens - should handle errors', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/tokens',
      user: { id: 1 },
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(service, 'findAll').mockRejectedValue(new Error('Database error'));

    const handler = getTokens(service);
    await handler(req, res, next);

    expect(service.findAll).toHaveBeenCalledWith(1, {
      page: 1,
      limit: 10,
      offset: 0,
    });
    expect(next).toHaveBeenCalled();
  });

  test('getTokenById - should retrieve a token by ID', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/tokens/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockToken = { id: 1, token: 'token1', user: { id: 1 } } as Token;
    vi.spyOn(service, 'findOne').mockResolvedValue(mockToken);

    const handler = getTokenById(service);
    await handler(req, res, next);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
  });

  test('getTokenById - should handle errors', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/tokens/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(service, 'findOne').mockRejectedValue(new Error('Database error'));

    const handler = getTokenById(service);
    await handler(req, res, next);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });
});

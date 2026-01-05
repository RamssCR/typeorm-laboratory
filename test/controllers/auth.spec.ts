import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { createRequest, createResponse } from 'node-mocks-http';
import { login, logout, profile, refresh, register } from '#controllers/auth';
import { AuthService } from '#services/auth';
import type { User } from '#models/user';

vi.mock('#services/auth');

vi.mock('#config/environment', () => ({
  NODE_ENV: 'production',
}));

describe('Auth Controller', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('login - should log in a user successfully', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/login',
      body: { email: 'test@example.com', password: 'password123' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    } as User;
    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    vi.spyOn(authService, 'login').mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    });

    const handler = login(authService);
    await handler(req, res, next);

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res._getStatusCode()).toBe(200);
  });

  test('register - should register a user successfully', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/register',
      body: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUser = {
      id: 2,
      username: 'newuser',
      email: 'newuser@example.com',
    } as User;
    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    vi.spyOn(authService, 'register').mockResolvedValue({
      user: mockUser,
      tokens: mockTokens,
    });

    const handler = register(authService);
    await handler(req, res, next);

    expect(authService.register).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    });
    expect(res._getStatusCode()).toBe(201);
  });

  test('logout - should log out a user successfully', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/logout',
      user: { id: 1 },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'logout').mockResolvedValue();

    const handler = logout(authService);
    await handler(req, res, next);

    expect(authService.logout).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
  });

  test('profile - should retrieve user profile successfully', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/auth/profile',
      user: { id: 1 },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    } as User;
    vi.spyOn(authService, 'profile').mockResolvedValue(mockUser);

    const handler = profile(authService);
    await handler(req, res, next);

    expect(authService.profile).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
  });

  test('refresh - should refresh tokens successfully', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/refresh',
      user: { id: 1 },
      cookies: { refreshToken: 'old-refresh-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };
    vi.spyOn(authService, 'refresh').mockResolvedValue(mockTokens);

    const handler = refresh(authService);
    await handler(req, res, next);

    expect(authService.refresh).toHaveBeenCalledWith('old-refresh-token', 1);
    expect(res._getStatusCode()).toBe(200);
  });
});

describe('Auth Controller Error Handling', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('login - should handle errors', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/login',
      body: { email: 'test@example.com', password: 'password123' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'login').mockRejectedValue(
      new Error('Invalid credentials'),
    );

    const handler = login(authService);
    await handler(req, res, next);

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(next).toHaveBeenCalled();
  });

  test('register - should handle errors', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/register',
      body: {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'register').mockRejectedValue(
      new Error('Email already in use'),
    );

    const handler = register(authService);
    await handler(req, res, next);

    expect(authService.register).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    });
    expect(next).toHaveBeenCalled();
  });

  test('logout - should handle errors', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/logout',
      user: { id: 1 },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'logout').mockRejectedValue(
      new Error('Logout failed'),
    );

    const handler = logout(authService);
    await handler(req, res, next);

    expect(authService.logout).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test('profile - should handle errors', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/auth/profile',
      user: { id: 1 },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'profile').mockRejectedValue(
      new Error('User not found'),
    );

    const handler = profile(authService);
    await handler(req, res, next);

    expect(authService.profile).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });

  test('refresh - should handle errors', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/auth/refresh',
      user: { id: 1 },
      cookies: { refreshToken: 'old-refresh-token' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(authService, 'refresh').mockRejectedValue(
      new Error('Invalid refresh token'),
    );

    const handler = refresh(authService);
    await handler(req, res, next);

    expect(authService.refresh).toHaveBeenCalledWith('old-refresh-token', 1);
    expect(next).toHaveBeenCalled();
  });
});

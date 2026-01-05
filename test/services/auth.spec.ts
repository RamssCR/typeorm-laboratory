import { beforeEach, describe, expect, test, vi } from 'vitest';
import { compareValue } from '#libs/bcrypt';
import { AuthService } from '#services/auth';
import type { Token } from '#models/token';
import { TokenService } from '#services/token';
import type { User } from '#models/user';
import type { UserSchema } from '#schemas/user';
import { UserService } from '#services/user';
import { container } from '#config/container';
import { createToken } from '#libs/jwt';
import { tokenDecoder } from '#helpers/tokenEncoder';

vi.mock('#libs/bcrypt', () => ({
  hashValue: vi.fn(),
  compareValue: vi.fn(),
}));

vi.mock('#libs/jwt', () => ({
  createToken: vi.fn(),
}));

vi.mock('#config/environment', () => ({
  JWT_SECRET: 'test_jwt_secret',
  JWT_REFRESH_SECRET: 'test_jwt_refresh_secret',
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',
}));

vi.mock('#helpers/tokenEncoder', () => ({
  tokenEncoder: vi.fn(),
  tokenDecoder: vi.fn(),
}));

describe('Services - Auth', () => {
  let service: AuthService;
  let userService: UserService;
  let tokenService: TokenService;

  beforeEach(() => {
    userService = {
      findOne: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
    } as unknown as UserService;

    tokenService = {
      findOne: vi.fn(),
      create: vi.fn(),
      revoke: vi.fn(),
      revokeAll: vi.fn(),
    } as unknown as TokenService;

    vi.spyOn(container, 'resolve').mockImplementation((cls) => {
      if (cls === UserService) return userService;
      if (cls === TokenService) return tokenService;
      throw new Error('Service not found');
    });
    service = new AuthService();
  });

  test('login should authenticate user and return tokens', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
    };
    vi.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as User);
    vi.mocked(compareValue).mockResolvedValue(true);

    const mockTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    vi.mocked(createToken)
      .mockResolvedValueOnce(mockTokens.accessToken)
      .mockResolvedValueOnce(mockTokens.refreshToken);
    vi.spyOn(tokenService, 'create').mockResolvedValue({ id: 1 } as Token);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password',
    } as UserSchema);
    expect(Object.keys(result).length).toEqual(2);
  });

  test('login should throw error for invalid credentials', async () => {
    vi.spyOn(userService, 'findByEmail').mockResolvedValue(null);
    await expect(
      service.login({
        email: 'test@example.com',
        password: 'password',
      } as UserSchema),
    ).rejects.toThrow('Invalid email or password');
  });

  test('register should create new user and return tokens', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
    };

    vi.spyOn(userService, 'findByEmail').mockResolvedValue(null);
    vi.spyOn(userService, 'create').mockResolvedValue(mockUser as User);
    const mockTokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    vi.mocked(createToken)
      .mockResolvedValueOnce(mockTokens.accessToken)
      .mockResolvedValueOnce(mockTokens.refreshToken);
    vi.spyOn(tokenService, 'create').mockResolvedValue({ id: 1 } as Token);

    const result = await service.register({
      email: 'test@example.com',
      password: 'password',
    } as UserSchema);
    expect(Object.keys(result).length).toEqual(2);
  });

  test('register should throw error if email is already in use', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
    };
    vi.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as User);

    await expect(
      service.register({
        email: 'test@example.com',
        password: 'password',
      } as UserSchema),
    ).rejects.toThrow('Email already in use');
  });

  test('profile should return user profile by ID', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
    };
    vi.spyOn(userService, 'findOne').mockResolvedValue(mockUser as User);

    const result = await service.profile(1);
    expect(result).toEqual(mockUser);
  });

  test('throws error if token decoding fails during logout', async () => {
    vi.mocked(tokenDecoder).mockReturnValue(null);
    await expect(service.logout('invalid_token')).rejects.toThrow(
      'Invalid token',
    );
  });

  test('logout should revoke the refresh token', async () => {
    const mockToken = {
      id: 1,
      token: 'refresh_token',
      user: { id: 1 },
    } as Token;
    vi.mocked(tokenDecoder).mockReturnValue({ id: 1, token: 'refresh_token' });
    vi.spyOn(tokenService, 'create').mockResolvedValue(mockToken);

    await service.logout('refresh_token');
    expect(tokenService.revoke).toHaveBeenCalledWith(mockToken.id);
  });

  test('refresh should return new tokens if refresh token is valid', async () => {
    const mockToken = {
      id: 1,
      token: 'refresh_token',
      user: { id: 1 },
      revoked: false,
    } as Token;
    vi.mocked(tokenDecoder).mockReturnValue({ id: 1, token: 'refresh_token' });
    vi.spyOn(tokenService, 'findOne').mockResolvedValue(mockToken);

    const mockTokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    vi.mocked(createToken)
      .mockResolvedValueOnce(mockTokens.accessToken)
      .mockResolvedValueOnce(mockTokens.refreshToken);
    vi.spyOn(tokenService, 'create').mockResolvedValue({ id: 2 } as Token);

    const result = await service.refresh('refresh_token', 1);
    expect(Object.keys(result).length).toEqual(2);
  });

  test('revokes all tokens if refresh token has been revoked', async () => {
    const mockToken = {
      id: 1,
      token: 'refresh_token',
      user: { id: 1 },
      revoked: true,
    } as Token;
    vi.mocked(tokenDecoder).mockReturnValue({ id: 1, token: 'refresh_token' });
    vi.spyOn(tokenService, 'findOne').mockResolvedValue(mockToken);

    await expect(service.refresh('refresh_token', 1)).rejects.toThrow(
      'Token has been revoked',
    );
    expect(tokenService.revokeAll).toHaveBeenCalledWith(1);
  });

  test('throws error if token decoding fails during refresh', async () => {
    vi.mocked(tokenDecoder).mockReturnValue(null);
    await expect(service.refresh('invalid_token', 1)).rejects.toThrow(
      'Invalid token',
    );
  });
});

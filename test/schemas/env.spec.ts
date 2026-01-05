import { describe, expect, test } from 'vitest';
import { env } from '#schemas/env';

describe('Env Schema', () => {
  test('valid env passes validation', () => {
    const validEnv = {
      NODE_ENV: 'development' as const,
      PORT: 3000,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USER: 'user',
      DB_PASSWORD: 'password',
      DB_NAME: 'database',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'supersecretrefresh',
      JWT_EXPIRES_IN: '1h',
      JWT_REFRESH_EXPIRES_IN: '7d',
      LIMIT: 30,
      LIMIT_MESSAGE: 'Too many requests, please try again later.',
      ALLOWED_ORIGINS: 'http://localhost:3000, http://example.com',
      DEBUG: false,
    };
    expect(() => env.parse(validEnv)).not.toThrow();
  });

  test('invalid env fails validation', () => {
    const invalidEnv = {
      NODE_ENV: 'invalid_env',
      PORT: -1,
      DB_HOST: '',
      DB_PORT: 'not_a_number',
      DB_USER: '',
      DB_PASSWORD: '',
      DB_NAME: '',
      JWT_SECRET: '',
      JWT_REFRESH_SECRET: '',
    };
    expect(() => env.parse(invalidEnv)).toThrow();
  });
});

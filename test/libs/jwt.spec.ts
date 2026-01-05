import { createToken, decodeToken } from '#libs/jwt';
import { describe, expect, test } from 'vitest';

describe('Create Token - JWT Library', () => {
  test('creates a JWT token correctly', async () => {
    const payload = { userId: 123 },
      secret = 'mysecretkey';

    const token = await createToken(payload, secret, { expiresIn: '1h' });
    expect(token).toBeTypeOf('string');
  });

  test('throws an error if the secret key is invalid', async () => {
    const payload = { userId: 123 },
      secret = '';

    await expect(createToken(payload, secret)).rejects.toThrow();
  });
});

describe('Decode Token - JWT Library', () => {
  test('decodes a JWT token correctly', async () => {
    const payload = { userId: 123 },
      secret = 'mysecretkey';

    const token = await createToken(payload, secret, { expiresIn: '1h' });
    const decoded = await decodeToken(token, secret);

    expect(decoded).toHaveProperty('userId', 123);
  });

  test('throws an error if the token is invalid', async () => {
    const invalidToken = 'invalid.token.here',
      secret = 'mysecretkey';

    await expect(decodeToken(invalidToken, secret)).rejects.toThrow();
  });

  test('throws an error if the token has expired', async () => {
    const payload = { userId: 123 },
      secret = 'mysecretkey';

    const token = await createToken(payload, secret, { expiresIn: '1ms' });
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    await expect(decodeToken(token, secret)).rejects.toThrow();
  });
});

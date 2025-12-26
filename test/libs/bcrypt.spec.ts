import { compareValue, hashValue } from '#libs/bcrypt';
import { describe, expect, test } from 'vitest';

describe('bcrypt library', () => {
  test('should hash and compare a password correctly', async () => {
    const plainPassword = 'miContraseñaSegura';
    const hashedPassword = await hashValue(plainPassword);

    const isMatch = await compareValue(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });
});

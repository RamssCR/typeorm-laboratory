import { describe, expect, test } from 'vitest';
import { encryptValue } from '#libs/crypto';

describe('encryptValue', () => {
  test('should generate a hexadecimal secret of the correct length', () => {
    const bytes = 16;
    const secret = encryptValue(bytes);
    expect(secret).toMatch(/^[a-f0-9]+$/);
    expect(secret.length).toBe(bytes * 2);
  });

  test('should generate different secrets on multiple calls', () => {
    const secret1 = encryptValue();
    const secret2 = encryptValue();
    expect(secret1).not.toBe(secret2);
  });
});

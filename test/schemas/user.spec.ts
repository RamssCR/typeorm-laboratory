import { describe, expect, test } from 'vitest';
import { user } from '#schemas/user';

describe('User Schema', () => {
  test('valid user passes validation', () => {
    const validUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'StrongPassw0rd!',
      phone: '1234567890',
      age: 25,
    };
    expect(() => user.parse(validUser)).not.toThrow();
  });

  test('invalid user fails validation', () => {
    const invalidUser = {
      username: 'tu',
      email: 'invalidemail',
      password: 'weak',
      age: 10,
    };
    expect(() => user.parse(invalidUser)).toThrow();
  });
});

import { describe, expect, test } from 'vitest';
import { pagination } from '#schemas/pagination';

describe('Pagination Schema', () => {
  test('valid pagination input passes validation', () => {
    const validInput = { page: '2', limit: '20' };
    const result = pagination.parse(validInput);
    expect(result).toEqual({ page: 2, limit: 20, offset: 20 });
  });

  test('pagination input with defaults', () => {
    const input = {};
    const result = pagination.parse(input);
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  test('invalid pagination input fails validation', () => {
    const invalidInput = { page: '0', limit: '200' };
    expect(() => pagination.parse(invalidInput)).toThrow();
  });
});

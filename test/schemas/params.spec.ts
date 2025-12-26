import { describe, expect, test } from 'vitest';
import { params } from '#schemas/params';

describe('Params Schema', () => {
  test('valid params passes validation', () => {
    const validParams = { id: '123' };
    const result = params.parse(validParams);
    expect(result).toEqual({ id: 123 });
  });

  test('invalid params fails validation', () => {
    const invalidParams = { id: '-5' };
    expect(() => params.parse(invalidParams)).toThrow();
  });
});

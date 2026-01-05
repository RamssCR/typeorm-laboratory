import { describe, expect, test } from 'vitest';
import { Expose } from 'class-transformer';
import { serialize } from '#utils/serialize';

class User {
  @Expose()
  id!: number;

  @Expose()
  name!: string;
}

describe('serialize', () => {
  test('should serialize a single object correctly', () => {
    const plainData = {
      id: 1,
      name: 'John Doe',
      extraField: 'should be excluded',
    };
    const result = serialize(User, plainData);
    expect(result).toBeInstanceOf(User);
    expect(result).toEqual({ id: 1, name: 'John Doe' });
  });

  test('should serialize an array of objects correctly', () => {
    const plainDataArray = [
      { id: 1, name: 'John Doe', extraField: 'should be excluded' },
      { id: 2, name: 'Jane Doe', anotherExtraField: 'should be excluded too' },
    ];
    const result = serialize(User, plainDataArray);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(User);
  });
});

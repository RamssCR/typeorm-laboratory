import { describe, expect, test } from 'vitest';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';

describe('Token Encoders & Decoders', () => {
  test('encodes an object correctly', () => {
    const obj = { token: 'abc123', id: 1 };
    const encoded = tokenEncoder(obj);
    expect(typeof encoded).toBe('string');
    expect(encoded).not.toBe(JSON.stringify(obj));
  });

  test('decodes a string correctly', () => {
    const obj = { token: 'abc123', id: 1 };
    const encoded = tokenEncoder(obj);
    const decoded = tokenDecoder(encoded);
    expect(decoded).toEqual(obj);
  });

  test('returns null when decoding an invalid string', () => {
    const invalidEncoded = 'invalid_base64_string';
    const decoded = tokenDecoder(invalidEncoded);
    expect(decoded).toBeNull();
  });
});

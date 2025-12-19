import type { Encoded } from '#types/token';

/**
 * Encodes a token and a user id into a base64 string.
 * @param object - Object containing the token and the id.
 * @returns Base64 encoded string.
 * @example
 * const encoded = tokenEncoder({ token: 'abc123', id: 1 });
 * console.log(encoded); // Base64 string
 */
export const tokenEncoder = <T = Encoded>(object: T) =>
  Buffer.from(JSON.stringify(object)).toString('base64');

/**
 * Decodes a base64 string into an object with token and user id.
 * @param encoded - Base64 encoded string.
 * @returns Object with the token and the id, or null if decoding fails.
 * @example
 * const decoded = tokenDecoder(encoded);
 * console.log(decoded); // { token: 'abc123', id: 1 } o null
 */
export const tokenDecoder = <T = Encoded>(encoded: string): T | null => {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  try {
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};

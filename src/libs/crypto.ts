import { CRYPTO_RANDOM_BYTES } from '#utils/constants';
import crypto from 'node:crypto';

/**
 * Generates a secure and random value in hexadecimal format.
 * @param bytes - Number of random bytes to generate.
 * @returns Generated value in hexadecimal format.
 * @example
 * const secret = encryptValue();
 * console.log(secret); // '9f1c2d3e4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j'
 */
export const encryptValue = (bytes: number = CRYPTO_RANDOM_BYTES) =>
  crypto.randomBytes(bytes).toString('hex');

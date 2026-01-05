/**
 * Number of salt rounds for hashing passwords.
 */
const SALT_ROUNDS = 12;

/**
 * Number of random bytes for cryptographic operations.
 */
const CRYPTO_RANDOM_BYTES = 16;

/**
 * Output file name for storing data.
 */
const OUTPUT_FILE = 'output.json';

/**
 * Cookie expiration time set to one day (in milliseconds).
 */
const COOKIE_EXPIRATION_ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Cookie expiration time set to one week (in milliseconds).
 */
const COOKIE_EXPIRATION_ONE_WEEK = 7 * COOKIE_EXPIRATION_ONE_DAY;

export {
  SALT_ROUNDS,
  OUTPUT_FILE,
  CRYPTO_RANDOM_BYTES,
  COOKIE_EXPIRATION_ONE_DAY,
  COOKIE_EXPIRATION_ONE_WEEK,
};

import jwt from 'jsonwebtoken';

export type DecodedToken<T> = T & jwt.JwtPayload;

/**
 * Wrapper around the jsonwebtoken sign function to create a JWT token.
 * Converts the callback-based function to a promise-based one.
 * @param payload - Data to be included in the token.
 * @param secret - Secret or private key to sign the token.
 * @param options - Additional options for signing the token.
 * @returns The generated JWT token.
 * @throws If an error occurs during token creation.
 * @example
 * createToken({ userId: 123 }, 'mysecretkey', { expiresIn: '1h' })
 *   .then(token => console.log(token))
 *   .catch(error => console.error(error));
 */
export const createToken = (
  payload: string | object | Buffer,
  secret: jwt.Secret | jwt.PrivateKey,
  options: jwt.SignOptions = {},
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, secret, options);
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Wrapper around the jsonwebtoken verify function to decode a JWT token.
 * Converts the callback-based function to a promise-based one.
 * @param token - The JWT token to decode.
 * @param secret - Secret or public key to verify the token.
 * @returns The decoded content of the token.
 * @throws If the token is invalid or has expired.
 * @example
 * decodeToken(token, 'mysecretkey')
 *   .then(decoded => console.log(decoded))
 *   .catch(error => console.error(error));
 */
export const decodeToken = <T>(
  token: string,
  secret: jwt.Secret | jwt.PublicKey,
): Promise<DecodedToken<T>> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded as DecodedToken<T>);
    });
  });

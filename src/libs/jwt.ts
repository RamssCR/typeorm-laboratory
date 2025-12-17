import jwt from 'jsonwebtoken';

export type DecodedToken<T> = T & jwt.JwtPayload;

/**
 * Wrapper sobre la función sign de jsonwebtoken para crear un token JWT.
 * Convierte la función basada en callbacks a una basada en promesas.
 * @param payload - Datos que se incluirán en el token.
 * @param secret - Clave secreta o privada para firmar el token.
 * @param options - Opciones adicionales para la firma del token.
 * @returns El token JWT generado.
 * @throws Si ocurre un error durante la creación del token.
 * @example
 * createToken({ userId: 123 }, 'mysecretkey', { expiresIn: '1h' })
 *   .then(token => console.log(token))
 *   .catch(error => console.error(error));
 */
export const createToken = (
  payload: string | object | Buffer,
  secret: jwt.Secret | jwt.PrivateKey,
  options: jwt.SignOptions = {},
) =>
  new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, secret, options);
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Wrapper sobre la función verify de jsonwebtoken para decodificar un token JWT.
 * Convierte la función basada en callbacks a una basada en promesas.
 * @param token - El token JWT a decodificar.
 * @param secret - Clave secreta o pública para verificar el token.
 * @returns El contenido decodificado del token.
 * @throws Si el token no es válido o ha expirado.
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

import { compare, hash } from 'bcryptjs';
import { SALT_ROUNDS } from '#utils/constants';

/**
 * Hashes a value using bcrypt.
 * @param value - Plain text value.
 * @returns Hashed value.
 * @example
 * const hashed = await hashValue('miContraseñaSegura');
 * console.log(hashed); // Muestra la contraseña hasheada en consola
 */
export const hashValue = async (value: string) =>
  await hash(value, SALT_ROUNDS);

/**
 * Compares a plain text value with a hashed value.
 * @param value - Plain text value.
 * @param hashedValue - Hashed value.
 * @returns Result of the comparison.
 * @example
 * const isMatch = await compareValue('miContraseñaSegura', hashed);
 * console.log(isMatch); // Muestra true si coinciden, false en caso contrario
 */
export const compareValue = async (value: string, hashedValue: string) =>
  await compare(value, hashedValue);

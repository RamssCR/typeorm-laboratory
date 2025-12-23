import { plainToInstance } from 'class-transformer';

/**
 * Serializes plain data to a class instance, excluding extraneous values.
 * @param instance - The class to which the data should be serialized.
 * @param data - The plain data to serialize.
 * @returns An instance of the specified class with serialized data.
 */
export const serialize = <T extends object>(
  instance: new () => T,
  data: unknown,
): T | T[] =>
  Array.isArray(data)
    ? data.map((item) =>
        plainToInstance(instance, item, { excludeExtraneousValues: true }),
      )
    : plainToInstance(instance, data, { excludeExtraneousValues: true });

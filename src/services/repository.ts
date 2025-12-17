import type { Repository } from 'typeorm';
import { appDataSource } from '#config/database';

/**
 * Get the repository for a given entity.
 * @param entity - The entity class.
 * @returns The repository for the specified entity.
 */
export const repository = <T extends object>(
  entity: new () => T,
): Repository<T> => appDataSource.getRepository(entity);

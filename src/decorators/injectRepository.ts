import { type Instance, container } from '#config/container';

/**
 * Injects a TypeORM repository for the specified entity into the decorated property.
 * @param entity - The entity class for which to inject the repository.
 * @returns PropertyDecorator
 */
export const InjectRepository =
  <T extends object>(entity: Instance<T>): PropertyDecorator =>
  (target, property) =>
    Object.defineProperty(target, property, {
      get: () => container.getRepository(entity),
    });

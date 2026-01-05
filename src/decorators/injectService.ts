import { type Instance, container } from '#config/container';

/**
 * Injects a service instance into the decorated property.
 * @param service - The service class to inject.
 * @returns PropertyDecorator
 */
export const InjectService =
  <T extends object>(service: Instance<T>): PropertyDecorator =>
  (target, property) =>
    Object.defineProperty(target, property, {
      get: () => container.resolve(service),
    });

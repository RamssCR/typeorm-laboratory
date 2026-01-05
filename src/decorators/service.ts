/**
 * Marks a class as a service.
 * @returns ClassDecorator
 */
export const Service = (): ClassDecorator => (target) =>
  Reflect.defineMetadata('service', true, target);

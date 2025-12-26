import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { Service } from '#decorators/service';

describe('Service Decorator', () => {
  beforeAll(() => {
    Reflect.defineMetadata = vi.fn();
    Reflect.getMetadata = vi.fn();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('should add service metadata to the class', () => {
    @Service()
    class MyService {
      randomMethod() {
        return 'Hello, World!';
      }
    }

    vi.spyOn(Reflect, 'getMetadata').mockReturnValue(true);

    const isService = Reflect.getMetadata('service', MyService);
    expect(isService).toBe(true);
  });
});

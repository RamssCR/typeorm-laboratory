import { beforeEach, describe, expect, test, vi } from 'vitest';
import { InjectService } from '#decorators/injectService';
import { container } from '#config/container';

describe('InjectService Decorator', () => {
  let spier: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    spier = vi.spyOn(container, 'resolve');
  });

  test('should inject the specified service instance', () => {
    class TestService {
      public getValue(): string {
        return 'test value';
      }
    }

    class TestClass {
      @InjectService(TestService)
      public service!: TestService;
    }

    vi.spyOn(container, 'resolve').mockReturnValue(new TestService());
    const testInstance = new TestClass();

    const serviceInstance = testInstance.service;
    expect(spier).toHaveBeenCalledWith(TestService);
    expect(serviceInstance).toBeDefined();
    expect(serviceInstance.getValue()).toBe('test value');
  });
});

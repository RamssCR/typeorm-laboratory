import { beforeEach, describe, expect, test, vi } from 'vitest';
import { InjectRepository } from '#decorators/injectRepository';
import type { Repository } from 'typeorm';
import { container } from '#config/container';

describe('InjectRepository Decorator', () => {
  let spier: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    spier = vi.spyOn(container, 'getRepository');
  });

  test('should inject the repository for the specified entity', () => {
    class TestEntity {
      id!: number;
      name!: string;
    }

    class TestClass {
      @InjectRepository(TestEntity)
      public repository!: Repository<TestEntity>;
    }

    vi.spyOn(container, 'getRepository').mockReturnValue(
      {} as Repository<TestEntity>,
    );
    const testInstance = new TestClass();

    const repo = testInstance.repository;
    expect(spier).toHaveBeenCalledWith(TestEntity);
    expect(repo).toBeDefined();
  });
});

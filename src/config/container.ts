import type { DataSource, Repository } from 'typeorm';

export type Instance<T = object> = new (...args: unknown[]) => T;

/**
 * A simple dependency injection container.
 * Manages instances of classes and TypeORM repositories.
 */
export class Container {
  private instances: Map<Instance, unknown> = new Map();
  private dataSource: DataSource | null = null;

  /**
   * Sets the TypeORM DataSource for repository retrieval.
   * @param dataSource - The TypeORM DataSource instance.
   * @returns void
   */
  public setDataSource(dataSource: DataSource): void {
    this.dataSource = dataSource;
  }

  /**
   * Retrieves the TypeORM repository for a given entity.
   * @param entity - The entity class for which to get the repository.
   * @returns The TypeORM Repository for the specified entity.
   */
  public getRepository<T extends object>(entity: Instance<T>): Repository<T> {
    if (!this.dataSource) throw new Error('DataSource not set in Container');
    return this.dataSource.getRepository(entity);
  }

  /**
   * Resolves an instance of the given class.
   * @param target - The class to instantiate.
   * @returns An instance of the specified class.
   */
  public resolve<T extends object>(target: Instance<T>): T {
    if (!this.instances.has(target)) this.instances.set(target, new target());

    return this.instances.get(target) as T;
  }
}

export const container = new Container();

/**
 * Pagination type definition to keep
 * consistency across the application.
 * @file src/types/pagination.d.ts
 */
export type Pagination<T> = {
  items: T[];
  page: number;
  total: number;
  pages: number;
};

export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

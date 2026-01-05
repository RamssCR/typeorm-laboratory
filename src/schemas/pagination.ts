import { z } from 'zod';

export const pagination = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
  .transform(({ page, limit }) => ({
    page,
    limit,
    offset: (page - 1) * limit,
  }));

export type Pagination = z.infer<typeof pagination>;

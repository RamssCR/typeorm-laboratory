import { z } from 'zod';

export const params = z.object({
  id: z.coerce.number().int().positive(),
});

export type Params = z.infer<typeof params>;

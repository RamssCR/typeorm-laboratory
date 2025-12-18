import { z } from 'zod';

export const user = z.object({
  username: z.string().min(2).max(100),
  phone: z.string().min(5).max(20),
  email: z.email().max(255),
  points: z.number().int().positive(),
});

export type UserSchema = z.infer<typeof user>;

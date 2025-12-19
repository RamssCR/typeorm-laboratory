import { z } from 'zod';

export const achievement = z.object({
  title: z.string().min(4).max(50),
  description: z.string().min(8).max(125),
  points: z.number().int().min(1).max(1000),
});

export type AchievementSchema = z.infer<typeof achievement>;

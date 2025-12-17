import { z } from 'zod';

export const env = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'staging'])
    .default('development'),
  PORT: z.coerce.number().positive().default(3000),
  DB_HOST: z.string({ error: 'DB_HOST is required' }),
  DB_PORT: z.coerce.number({ error: 'DB_PORT is required' }).positive(),
  DB_USER: z.string({ error: 'DB_USER is required' }),
  DB_PASSWORD: z.string({ error: 'DB_PASSWORD is required' }),
  DB_NAME: z.string({ error: 'DB_NAME is required' }),
  JWT_SECRET: z.string({ error: 'JWT_SECRET is required' }),
  JWT_REFRESH_SECRET: z.string({ error: 'JWT_REFRESH_SECRET is required' }),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  LIMIT: z.coerce.number().positive().default(30),
  LIMIT_MESSAGE: z
    .string()
    .default('Too many requests, please try again later.'),
  ALLOWED_ORIGINS: z
    .string()
    .transform((val) => val.split(',').map((origin) => origin.trim()))
    .default([]),
  DEBUG: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof env>;

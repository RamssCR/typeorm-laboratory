import { logger } from '#utils/logger';
import { env } from '#schemas/env';
import { treeifyError } from 'zod';

const parsed = env.safeParse(process.env);

if (!parsed.success) {
  logger.error(treeifyError(parsed.error)?.properties);
  throw new Error('Invalid environment variables');
}

export const {
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  PORT,
  LIMIT,
  LIMIT_MESSAGE,
  ALLOWED_ORIGINS,
  DEBUG,
} = parsed.data;

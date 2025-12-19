import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DEBUG,
  NODE_ENV,
} from './environment.ts';
import { DataSource } from 'typeorm';
import { container } from './container.ts';
import { logger } from '#utils/logger';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  entities: ['src/models/**/*.{ts,js}'],
  logging: DEBUG,
  synchronize: NODE_ENV === 'development',
});

/**
 * Establishes a connection to the database.
 * Logs success or error messages accordingly.
 * @example
 * await establishConnection();
 */
export const establishConnection = async () => {
  try {
    await appDataSource.initialize();
    container.setDataSource(appDataSource);
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Error establishing database connection:', error);
    appDataSource.destroy();
    throw error;
  }
};

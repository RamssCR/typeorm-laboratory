import { config, createLogger, format, transports } from 'winston';
const { combine, errors, json, prettyPrint, timestamp } = format;

/**
 * Global logger for the application.
 * Uses Winston for logging in JSON format.
 * Log levels are based on npm's default configuration.
 * - error: 0 (most severe)
 * - warn: 1 (Warnings)
 * - info: 2 (General information)
 * - http: 3 (HTTP logs)
 * - verbose: 4 (Additional details)
 * - debug: 5 (Debugging)
 * - silly: 6 (least severe)
 * @example
 * logger.info('Information message');
 * logger.error('Error message');
 * logger.debug('Debug message');
 * logger.warn('Warning message');
 * logger.http('HTTP message');
 * logger.verbose('Verbose message');
 * logger.silly('Silly message');
 */
export const logger = createLogger({
  levels: config.npm.levels,
  format: combine(json(), timestamp(), prettyPrint(), errors({ stack: true })),
  transports: [new transports.Console()],
});

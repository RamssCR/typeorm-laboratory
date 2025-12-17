import { LIMIT, LIMIT_MESSAGE } from '#config/environment';
import rateLimiter from 'express-rate-limit';

/**
 * Rate limiter middleware
 * @param skip - Whether to skip the rate limiting
 * @returns The rate limiter middleware
 * @example
 * app.use(rateLimiter()) // Globally
 * @example
 * app.get('/api/v1/resource', rateLimiter(), (req, res) => {
 *   res.send('This is a rate limited resource');
 * });
 */
export const limiter = (skip = false) =>
  rateLimiter({
    skip: () => skip,
    windowMs: 30 * 1000,
    limit: LIMIT,
    message: LIMIT_MESSAGE,
    legacyHeaders: false,
  });

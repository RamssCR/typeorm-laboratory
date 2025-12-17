import type { RequestHandler } from 'express';
import status from 'http-status';

/**
 * Middleware to handle not found routes (404).
 * @param req - The request object.
 * @param res - The response object.
 * @param _next - The next middleware function.
 * @returns void
 * @example
 * app.use(errorPath)
 */
export const errorPath: RequestHandler = (req, res, _next) => {
  res.status(status.NOT_FOUND).json({
    status: status.NOT_FOUND,
    message: `Route ${req.originalUrl} not found`,
  });
};

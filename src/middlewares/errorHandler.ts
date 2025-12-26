import type { NextFunction, Request, Response } from 'express';
import { RequestError } from '#utils/requestError';
import httpStatus from 'http-status';
import { logger } from '#utils/logger';

/**
 * Handles errors in an Express application.
 * If the error is an instance of Error, it logs the stack trace to the console
 * and sends a JSON response with the error status, code 500, and the error message.
 * @param error - The error captured in the application.
 * @param _req - The request object.
 * @param res - The response object.
 * @param _next - The next middleware function in the stack.
 * @returns Does not return anything but sends a response to the client.
 * @example
 * app.use(errorHandler);
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof RequestError) {
    logger.error(error.toString());
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.statusCode,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof Error) {
    logger.error(error?.stack);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }

  logger.error(error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    code: httpStatus.INTERNAL_SERVER_ERROR,
    message: 'An unknown error occurred',
  });
};

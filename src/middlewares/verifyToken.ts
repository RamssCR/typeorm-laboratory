import type { Request, RequestHandler } from 'express';
import { decodeToken } from '#libs/jwt';
import { JWT_SECRET } from '#config/environment';
import type { Payload } from '#types/jwt';
import httpStatus from 'http-status';
import { logger } from '#utils/logger';

/**
 * Retrieves the access token from the request cookies.
 * @param req - The Express request object.
 * @returns The access token string if present and valid, otherwise null.
 */
const getTokenFromCookies = (req: Request): string | null => {
  const { accessToken } = req.cookies;
  return accessToken && accessToken !== 'null' && accessToken !== 'undefined'
    ? accessToken
    : null;
};

/**
 * Retrieving the JWT token from the request, either from headers or cookies.
 * @param req - The incoming request.
 * @returns The JWT token or null if not found.
 */
const getToken = (req: Request): string | null => {
  const headerToken = req.headers?.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const cookieToken = getTokenFromCookies(req);
  return cookieToken ?? headerToken;
};

/**
 * Middleware to verify JWT token from request.
 * @param req - The incoming request.
 * @param res - The outgoing response.
 * @param next - The next middleware function.
 * @returns void
 */
export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = getToken(req);

  if (!token)
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: 'error',
      message: 'No token provided',
    });

  try {
    const decoded = await decodeToken<Payload>(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Token verification failed:', error.message);
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};

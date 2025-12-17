import type { RequestHandler, Response } from 'express';
import type { Env } from '#schemas/env';
import { NODE_ENV } from '#config/environment';
import httpStatus from 'http-status';

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
const DEFAULT_HEADERS = ['Content-Type', 'Authorization'] as const;

type CorsOptions = {
  skip?: boolean;
  origins?: string[];
  methods?: (typeof DEFAULT_METHODS)[number][];
  headers?: (typeof DEFAULT_HEADERS)[number][];
};

/**
 * Converts all array values to uppercase and joins them with commas.
 * @param values - Array of values to be converted to uppercase.
 * @returns Resulting string with uppercase values separated by commas.
 * @example
 * parseHeader(['get', 'post']); // 'GET, POST'
 * @example
 * parseHeader(['Content-Type', 'Authorization']); // 'Content-Type, Authorization'
 */
const parseHeader = (values: string[]) => values.join(', ');

/**
 * Configures CORS headers in the response.
 * @param res - Express response object.
 * @param origin - Request origin.
 * @param methods - Allowed HTTP methods.
 * @param headers - Allowed headers.
 * @returns Does not return anything.
 * @example
 * setCorsHeaders(res, 'https://myapp.com', ['GET', 'POST'], ['Content-Type', 'Authorization']);
 */
const setCorsHeaders = (
  res: Response,
  origin: string,
  methods: string[],
  headers: string[],
) => {
  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Methods',
    parseHeader(methods.map((value) => value.toUpperCase())),
  );
  res.header('Access-Control-Allow-Headers', parseHeader(headers));
  res.header('Access-Control-Allow-Credentials', 'true');
};

/**
 * Determines the allowed origin based on environment and origins list.
 * @param requestOrigin - Request origin.
 * @param origins - List of allowed origins.
 * @param nodeEnv - Node.js environment.
 * @returns Allowed origin or null if not allowed.
 * @example
 * getAllowedOrigin('https://myapp.com', ['https://myapp.com'], 'production'); // 'https://myapp.com'
 */
const getAllowedOrigin = (
  requestOrigin: string,
  origins: string[],
  nodeEnv?: Env['NODE_ENV'],
) => {
  if (nodeEnv === 'development' || nodeEnv === 'test') return '*';
  return origins.includes(requestOrigin) ? requestOrigin : '';
};

/**
 * Advanced CORS middleware with origin validation.
 * @param {object} options - Configuration options.
 * @param {boolean} [options.skip=false] - Indicates whether CORS configuration should be skipped.
 * @param {string[]} [options.origins=[]] - List of allowed origins.
 * @param {string[]} [options.methods=['GET', 'POST', 'PUT', 'DELETE']] - Allowed HTTP methods.
 * @param {string[]} [options.headers=['Content-Type', 'Authorization']] - Allowed headers.
 * @returns {RequestHandler} Express middleware for CORS.
 * @example
 * app.use(cors({ origins: ['https://myapp.com', 'https://otherapp.com'] }));
 */
export const cors =
  ({
    skip = false,
    origins = [],
    methods = [...DEFAULT_METHODS],
    headers = [...DEFAULT_HEADERS],
  }: CorsOptions = {}): RequestHandler =>
  (req, res, next) => {
    if (skip) return next();

    const origin = req.headers?.origin;
    if (!origin) return next();

    const allowedOrigin = getAllowedOrigin(origin, origins, NODE_ENV);
    setCorsHeaders(res, allowedOrigin, methods, headers);

    if (req.method === 'OPTIONS') return res.sendStatus(httpStatus.NO_CONTENT);
    return next();
  };

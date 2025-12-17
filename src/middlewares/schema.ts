import type { Request, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { z } from 'zod';

type Target = 'headers' | 'body' | 'params' | 'query';
type Mode = 'full' | 'partial';

type ZodParams = {
  object: Record<string, unknown>;
  schema: z.ZodSchema;
  mode: Mode;
};

type SchemaValidator = {
  target: keyof Pick<Request, Target>;
  mode: Mode;
};

/**
 * Validates an object against a zod schema.
 * If validation fails, it returns a list of error messages.
 * If validation succeeds, it returns the parsed object.
 * @param params - The parameters object.
 * @returns A list of error messages if validation fails, otherwise the validated object.
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number().min(0),
 * })
 * const errors = parseSchema({ name: "John", age: -5 }, schema)
 * // errors will be: ["Number must be greater than or equal to 0"]
 */
const parseSchema = ({ object, schema, mode }: ZodParams) => {
  const parsed =
    mode === 'partial' && schema instanceof z.ZodObject
      ? schema.partial().safeParse(object)
      : schema.safeParse(object);

  return parsed.success
    ? parsed.data
    : parsed.error.issues.map(
        (issue) => `${issue.path.join('.')} - ${issue.message}`,
      );
};

/**
 * Middleware to validate the request body against a zod schema.
 * If validation fails, it responds with 400 and the error message.
 * If validation succeeds, it calls the next middleware.
 * @param schema - The zod schema to validate.
 * @param options - Options for validation.
 * @returns The middleware function.
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number().min(0),
 * })
 * app.post('/user', validate(schema), (req, res) => {
 *   // If validation passes, this handler will be executed
 *   res.send('User is valid')
 * })
 */
export const validate =
  (
    schema: z.ZodSchema,
    { target = 'body', mode = 'full' }: SchemaValidator,
  ): RequestHandler =>
  (req, res, next) => {
    const result = parseSchema({ object: req[target], schema, mode });

    if (Array.isArray(result) && result.length > 0)
      return res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        code: httpStatus.BAD_REQUEST,
        details: result,
      });

    if (target === 'query') {
      Object.defineProperty(req, 'query', {
        get: () => result,
        enumerable: true,
        configurable: true,
      });
    } else {
      req[target] = result;
    }

    return next();
  };

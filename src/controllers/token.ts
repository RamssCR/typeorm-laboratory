import type { RequestHandler } from 'express';
import type { TokenService } from '#services/token';

/**
 * Gets all tokens for the authenticated user.
 * @param service - The TokenService instance.
 * @returns A request handler function.
 */
export const getTokens =
  (service: TokenService): RequestHandler =>
  async (req, res, next) => {
    const userId = req.user?.id as number;
    const { page, limit, offset } = req.query;

    try {
      const tokens = await service.findAll(userId, {
        page: Number(page),
        limit: Number(limit),
        offset: Number(offset),
      });

      res.json({
        status: 'success',
        message: 'Tokens retrieved successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Gets a token by its ID.
 * @param service - The TokenService instance.
 * @returns A request handler function.
 */
export const getTokenById =
  (service: TokenService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const token = await service.findOne(Number(id));
      res.json({
        status: 'success',
        message: 'Token retrieved successfully',
        data: token,
      });
    } catch (error) {
      next(error);
    }
  };

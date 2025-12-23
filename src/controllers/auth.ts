import {
  COOKIE_EXPIRATION_ONE_DAY,
  COOKIE_EXPIRATION_ONE_WEEK,
} from '#utils/constants';
import type { Auth } from '#schemas/user';
import type { AuthService } from '#services/auth';
import { NODE_ENV } from '#config/environment';
import type { RequestHandler } from 'express';

/**
 * Handles user login requests.
 * @param authService - The authentication service instance.
 * @returns An Express request handler for login.
 */
export const login =
  (authService: AuthService): RequestHandler =>
  async (req, res, next) => {
    try {
      const { tokens, user } = await authService.login(req.body as Auth);
      res
        .cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_DAY,
        })
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_WEEK,
        })
        .json({
          status: 'success',
          message: 'Logged in successfully',
          data: { user, tokens },
        });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles user registration requests.
 * @param authService - The authentication service instance.
 * @returns An Express request handler for registration.
 */
export const register =
  (authService: AuthService): RequestHandler =>
  async (req, res, next) => {
    try {
      const { tokens, user } = await authService.register(req.body as Auth);
      res
        .cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_DAY,
        })
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_WEEK,
        })
        .json({
          status: 'success',
          message: 'Registered successfully',
          data: { user, tokens },
        });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles profile retrieval requests.
 * @param authService - The authentication service instance.
 * @returns An Express request handler for profile retrieval.
 */
export const profile =
  (authService: AuthService): RequestHandler =>
  async (req, res, next) => {
    const id = req?.user?.id as number;

    try {
      const user = await authService.profile(id);
      res.json({
        status: 'success',
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles user logout requests.
 * @param authService - The authentication service instance.
 * @returns An Express request handler for logout.
 */
export const logout =
  (authService: AuthService): RequestHandler =>
  async (req, res, next) => {
    const { refreshToken } = req.cookies;

    try {
      await authService.logout(refreshToken);
      res.clearCookie('accessToken').clearCookie('refreshToken').json({
        status: 'success',
        message: 'Logged out successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles token refresh requests.
 * @param authService - The authentication service instance.
 * @returns An Express request handler for token refresh.
 */
export const refresh =
  (authService: AuthService): RequestHandler =>
  async (req, res, next) => {
    const id = req?.user?.id as number;
    const { refreshToken } = req.cookies;

    try {
      const tokens = await authService.refresh(refreshToken, id);
      res
        .cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_DAY,
        })
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          maxAge: COOKIE_EXPIRATION_ONE_WEEK,
        })
        .json({
          status: 'success',
          message: 'Tokens refreshed successfully',
          data: tokens,
        });
    } catch (error) {
      next(error);
    }
  };

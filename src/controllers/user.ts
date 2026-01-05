import type { RequestHandler } from 'express';
import type { UserSchema } from '#schemas/user';
import { UserResponse } from '#dtos/user';
import type { UserService } from '#services/user';
import httpStatus from 'http-status';
import { serialize } from '#utils/serialize';

/**
 * Gets a list of users from the UserService.
 * @param service - The UserService instance.
 * @returns An Express RequestHandler function.
 */
export const getUsers =
  (service: UserService): RequestHandler =>
  async (req, res, next) => {
    const { page, limit, offset } = req.query;

    try {
      const users = await service.findAll({
        page: Number(page),
        limit: Number(limit),
        offset: Number(offset),
      });
      res.json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: {
          ...users,
          items: serialize(UserResponse, users.items),
        },
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Gets a single user by ID from the UserService.
 * @param service - The UserService instance.
 * @returns An Express RequestHandler function.
 */
export const getUserById =
  (service: UserService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await service.findOne(Number(id));
      res.json({
        status: 'success',
        message: 'User retrieved successfully',
        data: serialize(UserResponse, user),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Creates a new user using the UserService.
 * @param service - The UserService instance.
 * @returns An Express RequestHandler function.
 */
export const createUser =
  (service: UserService): RequestHandler =>
  async (req, res, next) => {
    try {
      const user = await service.create(req.body as UserSchema);
      res.status(httpStatus.CREATED).json({
        status: 'success',
        message: 'User created successfully',
        data: serialize(UserResponse, user),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Updates an existing user using the UserService.
 * @param service - The UserService instance.
 * @returns An Express RequestHandler function.
 */
export const updateUser =
  (service: UserService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await service.update(
        Number(id),
        req.body as Partial<UserSchema>,
      );
      res.json({
        status: 'success',
        message: 'User updated successfully',
        data: serialize(UserResponse, user),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Deletes a user by ID using the UserService.
 * @param service - The UserService instance.
 * @returns An Express RequestHandler function.
 */
export const deleteUser =
  (service: UserService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      await service.delete(Number(id));
      res.json({
        status: 'success',
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

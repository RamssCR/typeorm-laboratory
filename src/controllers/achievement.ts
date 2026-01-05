import { AchievementResponse } from '#dtos/achievement';
import type { AchievementSchema } from '#schemas/achievement';
import type { AchievementService } from '#services/achievement';
import { serialize } from '#utils/serialize';
import type { RequestHandler } from 'express';
import httpStatus from 'http-status';

/**
 * Handles retrieving all achievements for a user.
 * @param service - The AchievementService instance.
 * @returns An Express RequestHandler function.
 */
export const getAchievements =
  (service: AchievementService): RequestHandler =>
  async (req, res, next) => {
    const { page, limit, offset } = req.query;

    try {
      const achievements = await service.findAll({
        page: Number(page),
        limit: Number(limit),
        offset: Number(offset),
      });

      res.json({
        status: 'success',
        message: 'Achievements retrieved successfully',
        data: {
          ...achievements,
          items: serialize(AchievementResponse, achievements.items),
        },
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles retrieving a single achievement by its ID.
 * @param service - The AchievementService instance.
 * @returns An Express RequestHandler function.
 */
export const getAchievementById =
  (service: AchievementService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const achievement = await service.findOne(Number(id));
      res.json({
        status: 'success',
        message: 'Achievement retrieved successfully',
        data: serialize(AchievementResponse, achievement),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles creating a new achievement.
 * @param service - The AchievementService instance.
 * @returns An Express RequestHandler function.
 */
export const createAchievement =
  (service: AchievementService): RequestHandler =>
  async (req, res, next) => {
    try {
      const achievement = await service.create(req.body as AchievementSchema);
      res.status(httpStatus.CREATED).json({
        status: 'success',
        message: 'Achievement created successfully',
        data: serialize(AchievementResponse, achievement),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles updating an existing achievement.
 * @param service - The AchievementService instance.
 * @returns An Express RequestHandler function.
 */
export const updateAchievement =
  (service: AchievementService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const achievement = await service.update(
        Number(id),
        req.body as AchievementSchema,
      );
      res.json({
        status: 'success',
        message: 'Achievement updated successfully',
        data: serialize(AchievementResponse, achievement),
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Handles deleting an achievement by its ID.
 * @param service - The AchievementService instance.
 * @returns An Express RequestHandler function.
 */
export const deleteAchievement =
  (service: AchievementService): RequestHandler =>
  async (req, res, next) => {
    const { id } = req.params;

    try {
      await service.delete(Number(id));
      res.json({
        status: 'success',
        message: 'Achievement deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

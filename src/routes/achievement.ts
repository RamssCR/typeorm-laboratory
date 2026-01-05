import {
  createAchievement,
  deleteAchievement,
  getAchievementById,
  getAchievements,
  updateAchievement,
} from '#controllers/achievement';
import { AchievementService } from '#services/achievement';
import { Router } from 'express';
import { achievement } from '#schemas/achievement';
import { container } from '#config/container';
import { pagination } from '#schemas/pagination';
import { params } from '#schemas/params';
import { validate } from '#middlewares/schema';

const achievementService =
  container.resolve<AchievementService>(AchievementService);
export const achievementRouter = Router();

achievementRouter.get(
  '/',
  validate(pagination, { mode: 'partial', target: 'query' }),
  getAchievements(achievementService),
);
achievementRouter.get(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  getAchievementById(achievementService),
);
achievementRouter.post(
  '/',
  validate(achievement),
  createAchievement(achievementService),
);
achievementRouter.patch(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  validate(achievement, { mode: 'partial' }),
  updateAchievement(achievementService),
);
achievementRouter.delete(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  deleteAchievement(achievementService),
);

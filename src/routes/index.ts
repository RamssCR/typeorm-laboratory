import { Router } from 'express';
import { achievementRouter } from './achievement.ts';
import { tokenRouter } from './token.ts';
import { userRouter } from './user.ts';

export const router = Router();

router.use('/users', userRouter);
router.use('/achievements', achievementRouter);
router.use('/tokens', tokenRouter);

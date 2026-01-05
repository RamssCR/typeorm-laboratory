import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '#controllers/user';
import { Router } from 'express';
import { UserService } from '#services/user';
import { container } from '#config/container';
import { pagination } from '#schemas/pagination';
import { params } from '#schemas/params';
import { user } from '#schemas/user';
import { validate } from '#middlewares/schema';

const userService = container.resolve<UserService>(UserService);
export const userRouter = Router();

userRouter.get(
  '/',
  validate(pagination, { mode: 'partial', target: 'query' }),
  getUsers(userService),
);
userRouter.get(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  getUserById(userService),
);
userRouter.post('/', validate(user), createUser(userService));
userRouter.patch(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  validate(user, { mode: 'partial' }),
  updateUser(userService),
);
userRouter.delete(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  deleteUser(userService),
);

import { getTokenById, getTokens } from '#controllers/token';
import { Router } from 'express';
import { TokenService } from '#services/token';
import { container } from '#config/container';
import { pagination } from '#schemas/pagination';
import { params } from '#schemas/params';
import { validate } from '#middlewares/schema';

const tokenService = container.resolve<TokenService>(TokenService);
export const tokenRouter = Router();

tokenRouter.get(
  '/',
  validate(pagination, { mode: 'partial', target: 'query' }),
  validate(params.pick({ id: true }), { target: 'user' }),
  getTokens(tokenService),
);
tokenRouter.get(
  '/:id',
  validate(params.pick({ id: true }), { target: 'params' }),
  getTokenById(tokenService),
);

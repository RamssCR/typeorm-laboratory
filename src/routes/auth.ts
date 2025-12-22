import { login, logout, profile, refresh, register } from '#controllers/auth';
import { AuthService } from '#services/auth';
import { Router } from 'express';
import { authentication } from '#schemas/user';
import { container } from '#config/container';
import { validate } from '#middlewares/schema';

const authService = container.resolve<AuthService>(AuthService);
export const authRouter = Router();

authRouter.post(
  '/login',
  validate(authentication.pick({ email: true, password: true })),
  login(authService),
);
authRouter.post('/register', validate(authentication), register(authService));
authRouter.post('/profile', profile(authService));
authRouter.post('/logout', logout(authService));
authRouter.post('/refresh', refresh(authService));

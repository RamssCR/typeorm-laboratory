import type { DecodedToken } from '#libs/jwt';
import type { Payload } from './jwt.d.ts';
import 'express';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: DecodedToken<Payload>;
  }
}

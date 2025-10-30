import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: payloadType; // or specify the type of `user`, e.g., `user: JwtPayload | null`
    }
  }
}

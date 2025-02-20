import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestWithCookies } from 'src/types/request';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  use(req: RequestWithCookies, res: Response, next: NextFunction) {
    if (!req.cookies?.userId) {
      const userId: string = uuidv4();

      res.cookie('userId', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      });

      req.cookies.userId = userId;
    }

    next();
  }
}

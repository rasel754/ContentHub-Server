import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../constants/roles';
import { AppError } from '../utils/AppError';
import { Messages } from '../constants/messages';

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = (req as any).auth?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(new AppError(Messages.FORBIDDEN, 403));
    }

    next();
  };
};

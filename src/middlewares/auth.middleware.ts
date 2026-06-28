import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';
import { Messages } from '../constants/messages';

// Middleware to populate req.auth using Clerk's JWT verification
export const clerkAuthHandler: RequestHandler = ClerkExpressWithAuth();

// Middleware to extract role and email from Clerk metadata if authenticated (does not enforce logged-in state)
export const resolveAuthDetails: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.auth && req.auth.userId && !(req.auth as any).role) {
    const claims = (req.auth as any).sessionClaims;
    const publicMetadata = claims?.publicMetadata || claims?.metadata || {};
    const role = (publicMetadata.role as UserRole) || UserRole.USER;
    const email = claims?.email || (req.auth as any).claims?.email || undefined;

    (req as any).auth = {
      userId: req.auth.userId,
      role,
      email,
    };
  }
  next();
};

// Middleware to enforce authentication and extract role from Clerk metadata
export const requireAuth: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  // Check if Clerk populated the auth object and a valid userId exists
  if (!req.auth || !req.auth.userId) {
    return next(new AppError(Messages.AUTH.INVALID_TOKEN, 401));
  }

  // Ensure role and email details are resolved if not already done
  if (!(req.auth as any).role) {
    const claims = (req.auth as any).sessionClaims;
    const publicMetadata = claims?.publicMetadata || claims?.metadata || {};
    const role = (publicMetadata.role as UserRole) || UserRole.USER;
    const email = claims?.email || (req.auth as any).claims?.email || undefined;

    (req as any).auth = {
      userId: req.auth.userId,
      role,
      email,
    };
  }

  next();
};

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';
import { Messages } from '../constants/messages';

// Middleware to populate req.auth using Clerk's JWT verification
export const clerkAuthHandler: RequestHandler = ClerkExpressWithAuth();

// Middleware to enforce authentication and extract role from Clerk metadata
export const requireAuth: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  // Check if Clerk populated the auth object and a valid userId exists
  if (!req.auth || !req.auth.userId) {
    return next(new AppError(Messages.AUTH.INVALID_TOKEN, 401));
  }

  // Fetch role and email from Clerk's session claims
  const claims = (req.auth as any).sessionClaims;
  const publicMetadata = claims?.publicMetadata || claims?.metadata || {};
  
  // Resolve role: check metadata or fall back to 'user'
  const role = (publicMetadata.role as UserRole) || UserRole.USER;
  const email = claims?.email || (req.auth as any).claims?.email || undefined;

  // Inject resolved details back onto the request object
  (req as any).auth = {
    userId: req.auth.userId,
    role,
    email,
  };

  next();
};

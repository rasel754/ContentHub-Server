import { UserRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: UserRole;
        email?: string;
      };
    }
  }
}

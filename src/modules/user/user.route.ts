import { Router } from 'express';
import { UserController } from './user.controller';
import { clerkAuthHandler, requireAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { updateProfileSchema } from './user.validation';

const router = Router();

// Profile endpoints
router.get('/profile', clerkAuthHandler, requireAuth, UserController.getProfile);
router.patch(
  '/profile',
  clerkAuthHandler,
  requireAuth,
  validateRequest(updateProfileSchema),
  UserController.updateProfile
);
router.post('/sync', UserController.syncProfile);

export const userRoutes = router;
export default router;

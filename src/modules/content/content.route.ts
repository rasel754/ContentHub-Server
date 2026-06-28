import { Router } from 'express';
import { ContentController } from './content.controller';
import { clerkAuthHandler, requireAuth, resolveAuthDetails } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { contentQuerySchema, updateContentSchema } from './content.validation';

const router = Router();

// Public GET endpoints (clerkAuthHandler parses token if it exists but does not block unauthenticated users)
router.get('/', clerkAuthHandler, resolveAuthDetails, validateRequest(contentQuerySchema), ContentController.getAllContent);
router.get('/:id', clerkAuthHandler, resolveAuthDetails, ContentController.getContent);

// Protected modification endpoints (forces authenticated state)
router.patch('/:id', clerkAuthHandler, requireAuth, validateRequest(updateContentSchema), ContentController.updateContent);
router.delete('/:id', clerkAuthHandler, requireAuth, ContentController.deleteContent);

export const contentRoutes = router;
export default router;

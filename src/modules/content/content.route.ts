import { Router } from 'express';
import { ContentController } from './content.controller';
import { clerkAuthHandler, requireAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { contentQuerySchema, updateContentSchema } from './content.validation';

const router = Router();

// Apply auth to all endpoints in this route file
router.use(clerkAuthHandler, requireAuth);

router.get('/', validateRequest(contentQuerySchema), ContentController.getAllContent);
router.get('/:id', ContentController.getContent);
router.patch('/:id', validateRequest(updateContentSchema), ContentController.updateContent);
router.delete('/:id', ContentController.deleteContent);

export const contentRoutes = router;
export default router;

import { Router } from 'express';
import { ChatController } from './chat.controller';
import { clerkAuthHandler, requireAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createSessionSchema, chatSessionQuerySchema } from './chat.validation';

const router = Router();

// Apply authentication to all chat endpoints
router.use(clerkAuthHandler, requireAuth);

router.post('/sessions', validateRequest(createSessionSchema), ChatController.createSession);
router.get('/sessions', validateRequest(chatSessionQuerySchema), ChatController.getSessions);
router.get('/sessions/:sessionId/messages', ChatController.getSessionMessages);
router.delete('/sessions/:sessionId', ChatController.deleteSession);

export const chatRoutes = router;
export default router;

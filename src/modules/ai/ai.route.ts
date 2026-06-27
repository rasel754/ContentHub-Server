import { Router } from 'express';
import { AIController } from './ai.controller';
import { clerkAuthHandler, requireAuth } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { generateContentSchema, chatAssistantSchema } from './ai.validation';

const router = Router();

// Require authentication for all AI generation and chat endpoints
router.use(clerkAuthHandler, requireAuth);

router.post('/generate', validateRequest(generateContentSchema), AIController.generateContent);
router.post('/chat', validateRequest(chatAssistantSchema), AIController.chatWithAssistant);

export const aiRoutes = router;
export default router;

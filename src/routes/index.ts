import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { contentRoutes } from '../modules/content/content.route';
import { chatRoutes } from '../modules/chat/chat.route';
import { aiRoutes } from '../modules/ai/ai.route';

const router = Router();

// Mount module routes
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/chat', chatRoutes);
router.use('/ai', aiRoutes);

export default router;

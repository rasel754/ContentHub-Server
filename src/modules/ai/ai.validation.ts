import { z } from 'zod';
import { ContentType } from '../../constants/enums';

export const generateContentSchema = z.object({
  body: z.object({
    prompt: z.string().trim().min(5, 'Prompt must be at least 5 characters long'),
    type: z.nativeEnum(ContentType),
  }).strict(),
});

export const chatAssistantSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1, 'Message cannot be empty'),
    conversationId: z.string().trim().min(1, 'Conversation ID (sessionId) is required'),
  }).strict(),
});

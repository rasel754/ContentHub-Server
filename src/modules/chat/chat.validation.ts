import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Session title cannot be empty'),
  }).strict(),
});

export const chatSessionQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

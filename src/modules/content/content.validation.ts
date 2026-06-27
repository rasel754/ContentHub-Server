import { z } from 'zod';
import { ContentType } from '../../constants/enums';

export const updateContentSchema = z.object({
  body: z.object({
    prompt: z.string().trim().min(1, 'Prompt cannot be empty').optional(),
    type: z.nativeEnum(ContentType).optional(),
    output: z.string().min(1, 'Output cannot be empty').optional(),
    metadata: z.record(z.any()).optional(),
  }).strict(),
});

export const contentQuerySchema = z.object({
  query: z.object({
    type: z.nativeEnum(ContentType).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

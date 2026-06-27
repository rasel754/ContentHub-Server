import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, 'First name cannot be empty').optional(),
    lastName: z.string().trim().min(1, 'Last name cannot be empty').optional(),
    profileImageUrl: z.string().url('Profile image URL must be a valid URL').optional(),
  }).strict(),
});

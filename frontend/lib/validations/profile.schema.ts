import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  avatarUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

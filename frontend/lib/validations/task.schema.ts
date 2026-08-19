import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['TODO', 'DOING', 'COMPLETED', 'ON_HOLD']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
});
export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().trim().min(8).optional().or(z.literal('')),
  rateVariant: z.string().trim().min(6)
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

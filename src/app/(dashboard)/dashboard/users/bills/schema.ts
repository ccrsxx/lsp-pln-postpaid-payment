import { z } from 'zod';

export const createBillSchema = z.object({
  finalKwh: z.coerce.number().positive()
});

export type CreateBillSchema = z.infer<typeof createBillSchema>;

export const createBillActionsSchema = z.object({
  userId: z.string().uuid(),
  finalKwh: z.number().positive()
});

export type CreateBillActionsSchema = z.infer<typeof createBillActionsSchema>;

import { z } from 'zod';

export const createBillSchema = z.object({
  finalKwh: z.coerce.number().positive()
});

export type CreateBillSchema = z.infer<typeof createBillSchema>;

export const createBillActionsSchema = createBillSchema.extend({
  userId: z.string().uuid()
});

export type CreateBillActionsSchema = z.infer<typeof createBillActionsSchema>;

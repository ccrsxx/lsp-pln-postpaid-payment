import { z } from 'zod';
import type { PaymentStatus } from '@prisma/client';

export const VALID_PAYMENT_STATUSES = [
  'REJECTED',
  'COMPLETED'
] as const satisfies PaymentStatus[];

export type ValidPaymentStatus = (typeof VALID_PAYMENT_STATUSES)[number];

export const validatePaymentSchema = z.object({
  status: z.enum(VALID_PAYMENT_STATUSES)
});

export type ValidatePaymentSchema = z.infer<typeof validatePaymentSchema>;

export const validatePaymentActionsSchema = validatePaymentSchema.extend({
  paymentId: z.string().uuid()
});

export type ValidatePaymentActionsSchema = z.infer<
  typeof validatePaymentActionsSchema
>;

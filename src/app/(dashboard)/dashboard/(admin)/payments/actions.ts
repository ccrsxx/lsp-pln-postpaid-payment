'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import {
  validatePaymentActionsSchema,
  type ValidatePaymentActionsSchema
} from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function validatePayment(
  formData: ValidatePaymentActionsSchema
): Promise<ActionsResponse> {
  const { data, success } = validatePaymentActionsSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { paymentId, status } = data;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found' };

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status }
  });

  revalidatePath('/dashboard/payments');

  return { success: 'Payment created successfully' };
}

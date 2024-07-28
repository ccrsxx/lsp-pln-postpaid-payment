'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import {
  createBillActionsSchema,
  type CreateBillActionsSchema
} from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function createBill(
  formData: CreateBillActionsSchema
): Promise<ActionsResponse> {
  const { data, success } = createBillActionsSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId
    },
    include: {
      rateVariant: true,
      usage: {
        where: {
          active: true
        }
      }
    }
  });

  if (!user) return { error: 'User not found' };

  if (!user.usage.length) return { error: 'No active usage found' };

  const currentBill = await prisma.bill.findFirst({
    where: {
      userId: user.id,
      expiredAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (currentBill) return { error: 'Bill already created for this month' };

  const currentUsage = user.usage[0];

  const { finalKwh } = data;
  const { initialKwh } = currentUsage;

  const totalUsageKwh = finalKwh - initialKwh;
  const totalPrice = totalUsageKwh * user.rateVariant.feeRate;

  const nextMonthDate = new Date();

  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  await prisma.$transaction([
    prisma.usage.update({
      where: {
        id: currentUsage.id
      },
      data: {
        finalKwh,
        active: false
      }
    }),
    prisma.bill.create({
      data: {
        totalPrice,
        totalUsageKwh,
        userId: user.id,
        usageId: currentUsage.id,
        expiredAt: nextMonthDate
      }
    }),
    prisma.usage.create({
      data: {
        active: true,
        userId: user.id,
        initialKwh: finalKwh
      }
    })
  ]);

  revalidatePath('/dashboard/users');

  return { success: 'Bill created successfully' };
}

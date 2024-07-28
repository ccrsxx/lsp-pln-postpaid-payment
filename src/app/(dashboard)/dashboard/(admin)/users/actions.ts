'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import type { ActionsResponse } from '@/lib/types/api';

export async function deleteUser(userId: string): Promise<ActionsResponse> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) return { error: 'User not found' };

  await prisma.user.delete({
    where: {
      id: userId
    }
  });

  revalidatePath('/dashboard/users');

  return {
    success: 'User deleted successfully'
  };
}

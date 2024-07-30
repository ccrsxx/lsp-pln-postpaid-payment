'use server';

import { hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { updateUserSchema, type UpdateUserSchema } from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function updateUser(
  formData: UpdateUserSchema
): Promise<ActionsResponse> {
  const { data, success } = updateUserSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { name, email, password, rateVariant } = data;

  try {
    const hashedPassword = password ? await hash(password, 10) : null;

    await prisma.user.update({
      where: {
        email
      },
      data: {
        name,
        email,
        ...(hashedPassword && { password: hashedPassword }),
        rateVariant: {
          connect: {
            name: rateVariant
          }
        }
      }
    });

    revalidatePath('/dashboard/users');

    return { success: 'Update user successful' };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };

    return { error: 'Internal server error' };
  }
}

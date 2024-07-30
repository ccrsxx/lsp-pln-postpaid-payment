'use server';

import { hash } from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getUniqueKwhNumber } from '@/lib/actions/common';
import { createNewUser } from '@/lib/actions/auth';
import { createUserSchema, type CreateUserSchema } from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function createUser(
  formData: CreateUserSchema
): Promise<ActionsResponse> {
  const { data, success } = createUserSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { name, email, password, rateVariant } = data;

  try {
    const userFromEmailExists = await prisma.user.findFirst({
      where: { email }
    });

    if (userFromEmailExists) return { error: 'Email already exists' };

    const hashedPassword = await hash(password, 10);

    const uniqueKwhNumber = await getUniqueKwhNumber();

    await createNewUser({
      name,
      email,
      password: hashedPassword,
      kwhNumber: uniqueKwhNumber,
      rateVariant
    });

    revalidatePath('/dashboard/users');

    return { success: 'Create user successful' };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };

    return { error: 'Internal server error' };
  }
}

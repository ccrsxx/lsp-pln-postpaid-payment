'use server';

import { hash } from 'bcrypt';
import { prisma } from '@/lib/db';
import { getUniqueKwhNumber } from '@/app/actions/common';
import { registerSchema, type RegisterSchema } from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function registerUser(
  formData: RegisterSchema
): Promise<ActionsResponse> {
  const { data, success } = registerSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { name, email, password } = data;

  try {
    const userFromEmailExists = await prisma.user.findFirst({
      where: { email }
    });

    if (userFromEmailExists) return { error: 'Email already exists' };

    const hashedPassword = await hash(password, 10);

    const uniqueKwhNumber = await getUniqueKwhNumber();

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        kwhNumber: uniqueKwhNumber,
        rateVariant: {
          connect: {
            name: '900 VA'
          }
        }
      }
    });

    return { success: 'Registration successful' };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };

    return { error: 'Internal server error' };
  }
}

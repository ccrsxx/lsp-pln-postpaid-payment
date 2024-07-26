'use server';

import { compare } from 'bcrypt';
import { signIn } from '@/auth';
import { prisma } from '@/lib/db';
import { loginSchema, type LoginSchema } from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function loginUser(
  formData: LoginSchema
): Promise<ActionsResponse> {
  const { data, success } = loginSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { email, password } = data;

  try {
    const userFromEmail = await prisma.user.findFirst({
      where: { email }
    });

    if (!userFromEmail) return { error: 'User not found' };

    const userHashedPassword = userFromEmail.password;

    if (!userHashedPassword) return { error: 'Password is not setup yet' };

    const isPasswordMatch = await compare(password, userHashedPassword);

    if (!isPasswordMatch) return { error: "Password doesn't match" };

    await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    return { success: 'Login successful' };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };

    return { error: 'Internal server error' };
  }
}

import { useSession } from 'next-auth/react';
import type { User } from 'next-auth';
import type { Role } from '@prisma/client';

type UserWithRole = User & { role: Role };

type UseUser = {
  user: UserWithRole | null;
};

export function useUser(): UseUser {
  const session = useSession();

  const user = session?.data?.user ?? null;

  return {
    user: user
  };
}

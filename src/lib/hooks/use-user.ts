import { useSession } from 'next-auth/react';
import type { User } from 'next-auth';

type UseUser = {
  user: User | null;
};

export function useUser(): UseUser {
  const session = useSession();

  const user = session?.data?.user ?? null;

  return {
    user: user
  };
}

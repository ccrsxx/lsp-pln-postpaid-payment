import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { ReactNode } from 'react';

export default async function Layout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  if (!session) redirect('/login');

  return <>{children}</>;
}

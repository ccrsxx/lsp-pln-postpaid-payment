import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { ReactNode } from 'react';

export default async function Layout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  const isAdmin = session?.user.role === 'ADMIN';

  if (!isAdmin) redirect('/dashboard/bills');

  return <>{children}</>;
}

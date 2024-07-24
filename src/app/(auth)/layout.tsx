import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { ReactNode } from 'react';

export default async function Layout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  if (session) redirect('/');

  return (
    <main className='grid min-h-screen'>
      <section className='grid content-center p-4 text-black'>
        {children}
      </section>
    </main>
  );
}

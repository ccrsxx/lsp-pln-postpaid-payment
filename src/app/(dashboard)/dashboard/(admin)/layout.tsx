import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '../dashboard-sidebar';
import { DashboardHeader } from '../dashboard-header';
import type { ReactNode } from 'react';

export default async function Layout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  const isAdmin = session?.user.role === 'ADMIN';

  if (!isAdmin) redirect('/login');

  return (
    <TooltipProvider>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <Sidebar />
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
          <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
            <DashboardHeader />
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

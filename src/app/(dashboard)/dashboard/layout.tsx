import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { ReactNode } from 'react';

export default function Layout({
  children
}: {
  children: ReactNode;
}): JSX.Element {
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

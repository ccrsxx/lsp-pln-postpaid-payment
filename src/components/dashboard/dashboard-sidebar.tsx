'use client';

import Link from 'next/link';
import {
  Users2,
  History,
  Package2,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/hooks/use-user';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import type { Role } from '@prisma/client';

type SidebarItem = {
  href: string;
  role: Role;
  Icon: typeof Settings;
  label: string;
};

const sidebarItems: SidebarItem[] = [
  {
    href: '/dashboard/users',
    Icon: Users2,
    role: 'ADMIN',
    label: 'Users'
  },
  {
    href: '/dashboard/payments',
    Icon: ShoppingCart,
    role: 'ADMIN',
    label: 'Payments'
  },
  {
    href: '/dashboard/bills',
    Icon: Package2,
    role: 'USER',
    label: 'Bills'
  },
  {
    href: '/dashboard/history',
    Icon: History,
    role: 'USER',
    label: 'History'
  }
];

export function Sidebar(): JSX.Element {
  const { user } = useUser();

  const pathname = usePathname();

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <TooltipProvider>
        <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
          <Link
            href='#'
            className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
          >
            <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
            <span className='sr-only'>Acme Inc</span>
          </Link>
          {sidebarItems.map(({ Icon, label, href, role }) => {
            const isShown = user?.role === role;

            if (!isShown) return null;

            return (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                      pathname === href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Icon className='h-5 w-5' />
                    <span className='sr-only'>{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
              >
                <Settings className='h-5 w-5' />
                <span className='sr-only'>Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { Home, Package2, Settings, ShoppingCart, Users2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

const sidebarItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    Icon: Home
  },
  {
    href: '/dashboard/users',
    label: 'Customers',
    Icon: Users2
  },
  {
    href: '/dashboard/orders',
    label: 'Orders',
    Icon: ShoppingCart
  }
] as const;

export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
        <Link
          href='#'
          className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
        >
          <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
          <span className='sr-only'>Acme Inc</span>
        </Link>
        {sidebarItems.map(({ Icon, label, href }) => (
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
        ))}
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
    </aside>
  );
}

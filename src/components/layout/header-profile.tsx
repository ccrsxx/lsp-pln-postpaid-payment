'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useUser } from '@/lib/hooks/use-user';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

export function HeaderProfile(): JSX.Element {
  const { user } = useUser();

  const handleLogout = (): void => void signOut();

  const { name, email, image } = user ?? {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='overflow-hidden rounded-full'
        >
          <Image
            src={image ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt='Avatar'
            className='overflow-hidden rounded-full'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuLabel className='-mt-2'>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href='/dashboard'>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/use-user';
import { Button } from '../ui/button';
import { HeaderProfile } from './header-profile';

export function Header(): JSX.Element {
  const router = useRouter();

  const { user } = useUser();

  const handleLogin = (): void => router.push('/login');

  return (
    <header className='layout my-4 flex w-full items-center justify-between shadow-lg'>
      <div className='flex items-center gap-2'>
        <Link href='/'>
          <Image src='/logo.svg' width={48} height={48} alt='Logo' />
        </Link>
        <div>
          <h1 className='font-bold'>PLN Postpaid Payment</h1>
          <p className='-mt-1 text-sm text-gray-200'>
            at{' '}
            <a
              className='custom-underline'
              href='https://risalamin.com'
              target='_blank'
            >
              risalamin.com
            </a>
          </p>
        </div>
      </div>
      <div>
        {user ? (
          <HeaderProfile />
        ) : (
          <Button
            className='flex items-center gap-2 font-semibold'
            type='submit'
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

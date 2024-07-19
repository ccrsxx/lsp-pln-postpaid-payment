import Image from 'next/image';
import Link from 'next/link';
import { SiGoogle } from 'react-icons/si';
import { MdLogout } from 'react-icons/md';
import { auth, signIn, signOut } from '@/auth';
import { Button } from '../ui/button';

export async function Header(): Promise<JSX.Element> {
  const session = await auth();

  const user = session?.user;

  const handleLogin = async (): Promise<void> => {
    'use server';

    await signIn('google');
  };

  const handleLogout = async (): Promise<void> => {
    'use server';

    await signOut();
  };

  const formAction = user ? handleLogout : handleLogin;

  return (
    <header className='my-4 flex items-center justify-between shadow-lg'>
      <div className='flex items-center gap-2'>
        <Link href='/'>
          <Image src='/logo.svg' width={48} height={48} alt='Logo' />
        </Link>
        <div>
          <h1 className='font-bold'>Link</h1>
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
        <form action={formAction}>
          {user ? (
            <Button
              type='submit'
              className='flex items-center gap-2 font-semibold'
            >
              <MdLogout />
              Log out, {user.name}
            </Button>
          ) : (
            <Button
              className='flex items-center gap-2 font-semibold'
              type='submit'
            >
              <SiGoogle />
              Sign in
            </Button>
          )}
        </form>
      </div>
    </header>
  );
}

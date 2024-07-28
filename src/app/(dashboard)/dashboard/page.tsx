import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Home(): Promise<unknown> {
  const session = await auth();

  if (session?.user.role === 'USER') redirect('/dashboard/bills');

  return redirect('/dashboard/users');
}

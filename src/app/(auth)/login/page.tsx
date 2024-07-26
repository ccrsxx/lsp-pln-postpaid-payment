'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl
} from '@/components/ui/form';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginSchema } from './schema';
import { loginUser } from './actions';

export default function Login(): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const handleLoginGoogle = (): void => void signIn('google');

  const onSubmit = (data: LoginSchema): void => {
    startTransition(() => {
      toast.promise(loginUser(data), {
        loading: 'Login...',
        success: (res) => {
          if ('error' in res) throw new Error(res.error);

          window.location.href = '/';

          return res.success;
        },
        error: (err) => {
          if (err instanceof Error) return err.message;

          return 'An error occurred';
        }
      });
    });
  };

  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='m@example.com'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
        <Button
          variant='outline'
          className='mt-4 w-full'
          onClick={handleLoginGoogle}
        >
          Login with Google
        </Button>
        <p className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='underline'>
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

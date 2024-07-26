'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createUser } from './actions';
import { createUserSchema, type CreateUserSchema } from './schema';

type CreateUserFormProps = {
  rateVariants: string[];
};

export function CreateUserForm({
  rateVariants
}: CreateUserFormProps): JSX.Element {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema)
  });

  const onSubmit = (data: CreateUserSchema): void => {
    startTransition(() => {
      toast.promise(createUser(data), {
        loading: 'Creating...',
        success: (res) => {
          if ('error' in res) throw new Error(res.error);

          router.replace('/dashboard/users');

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
    <Form {...form}>
      <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Ami' disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rateVariant'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Variant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a rate variant' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rateVariants.map((name) => (
                    <SelectItem value={name} key={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
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
        <div className='ml-auto flex gap-4'>
          <Button type='button' disabled={isPending}>
            <Link href='/dashboard/users'>Cancel</Link>
          </Button>
          <Button type='submit' disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}

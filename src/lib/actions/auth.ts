import type { User } from '@prisma/client';

type UserWithRateVariant = Pick<
  User,
  'name' | 'email' | 'password' | 'kwhNumber'
> & {
  rateVariant?: string;
};

export async function createNewUser(props: UserWithRateVariant): Promise<User> {
  return await prisma.user.create({
    data: {
      name: props.name,
      email: props.email,
      password: props.password,
      kwhNumber: props.kwhNumber,
      rateVariant: {
        connect: { name: props.rateVariant ?? '900 VA' }
      },
      usage: {
        create: {
          initialKwh: 0
        }
      }
    }
  });
}

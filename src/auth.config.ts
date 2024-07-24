import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './lib/db';
import type { LoginSchema } from './app/(auth)/login/schema';
import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const { email } = credentials as LoginSchema;

        const userFromEmail = await prisma.user.findFirst({
          where: { email }
        });

        return userFromEmail;
      }
    })
  ]
} satisfies NextAuthConfig;

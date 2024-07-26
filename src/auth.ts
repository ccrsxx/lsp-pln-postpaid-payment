import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUniqueKwhNumber } from '@/app/actions/common';
import { prisma } from './lib/db';
import authConfig from './auth.config';
import { createNewUser } from './app/actions/auth';
import type { Role } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Additional user fields. */
      id: string;
      role: Role;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      const userEmail = user?.email;

      if (!userEmail) return false;

      const isSignInFromGoogle = account?.provider === 'google';

      const userFromEmail = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      const shouldBackfillRateVariant = isSignInFromGoogle && !userFromEmail;

      if (shouldBackfillRateVariant) {
        const uniqueKwhNumber = await getUniqueKwhNumber();

        await createNewUser({
          name: user?.name ?? '',
          email: userEmail,
          password: '',
          kwhNumber: uniqueKwhNumber
        });
      }

      return true;
    },
    async session({ session }): Promise<typeof session> {
      const userEmail = session.user.email;

      const userFromEmail = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true, role: true, image: true }
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (userFromEmail) {
        session.user.id = userFromEmail.id;
        session.user.role = userFromEmail.role;
        session.user.image = userFromEmail.image;
      }

      return session;
    }
  },
  ...authConfig
});

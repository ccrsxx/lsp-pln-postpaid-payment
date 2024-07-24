import NextAuth, { type DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/db';
import authConfig from './auth.config';
import { getUniqueKwhNumber } from './lib/helper';
import type { User } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Additional user fields. */
      role: User['role'];
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

        await prisma.user.create({
          data: {
            name: user.name,
            email: userEmail,
            image: user.image,
            kwhNumber: uniqueKwhNumber,
            RateVariant: {
              connect: {
                name: '900 VA'
              }
            }
          }
        });
      }

      return true;
    },
    async session({ token, session }): Promise<typeof session> {
      const userId = token.sub;

      const userFromUserId = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (userFromUserId) session.user.role = userFromUserId.role;

      return session;
    }
  },
  ...authConfig
});

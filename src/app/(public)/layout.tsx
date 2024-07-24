import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import type { ReactNode } from 'react';

export default function Layout({
  children
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

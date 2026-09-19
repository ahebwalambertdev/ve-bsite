'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConsentBanner } from '@/components/layout/consent-banner';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="w-full h-full min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 w-full overflow-x-hidden">{children}</div>
      <Footer />
      <ConsentBanner />
    </>
  );
}

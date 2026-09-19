'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = React.useState(false);
  const pathname = usePathname();

  // Do not show consent banner on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  React.useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('ve_consent_choice');
    if (!consentChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ve_consent_choice', 'granted');
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ve_consent_choice', 'denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and referral consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="mx-auto max-w-4xl rounded-lg bg-carbon-black text-snow p-5 shadow-elevated border border-neutral-800 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
        <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
          <p>
            We use cookieless measurement and referral tracking to improve your shopping experience
            under the Uganda Data Protection and Privacy Act (DPPA 2019). Read our{' '}
            <Link href="/legal/privacy" className="underline hover:text-snow">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDecline} className="text-snow hover:bg-neutral-800">
            Decline
          </Button>
          <Button variant="accent" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

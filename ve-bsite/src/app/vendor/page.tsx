import type { Metadata } from 'next';
import { VendorApplicationClient } from '@/components/vendor/vendor-application-client';

export const metadata: Metadata = {
  title: 'Apply as a Ve-ndor — Boutique Onboarding for Kampala Fashion',
  description:
    'Apply to sell on Ve. Free shop counter pickups across Kampala, guaranteed Mobile Money payouts, and zero monthly fees.',
  openGraph: {
    title: 'Apply as a Ve-ndor — Kampala Fashion Boutique Application',
    description:
      'Join verified Kampala boutiques on Ve. We pick up from your counter and send payouts straight to your phone.',
    url: 'https://www.veapp.store/vendor',
  },
  alternates: {
    canonical: '/vendor',
  },
};

export default function VendorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Ve-ndor Boutique Application',
    description: 'Boutique onboarding application for Kampala fashion sellers on Ve.',
    url: 'https://www.veapp.store/vendor',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VendorApplicationClient />
    </div>
  );
}

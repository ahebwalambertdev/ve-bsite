import type { Metadata } from 'next';
import Link from 'next/link';
import { AppDownloadClient } from '@/components/app/app-download-client';
import { Card } from '@/components/ui/card';
import { Sparkles, Camera, Bike, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Join the Waiting List — Ve Mobile App Coming Soon',
  description:
    'The Ve mobile app is coming soon to iOS & Android. Join the waiting list for early access to Try-On, verified Kampala boutiques, and safe doorstep delivery.',
  openGraph: {
    title: 'Join the Waiting List — Ve Mobile App (Coming Soon)',
    description: 'Boutique fashion, Try-On, and safe doorstep delivery across Kampala. Coming soon.',
    url: 'https://www.veapp.store/app',
  },
};

export default function AppPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      {/* Hero Download Section with Client Detection & QR */}
      <AppDownloadClient />

      {/* 3 Core Experience Pillars */}
      <section className="space-y-10 pt-8 border-t border-soft-linen">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-carbon-black font-normal tracking-tight">
            What to expect when we launch
          </h2>
          <p className="text-sm text-carbon-black/70 mt-2">
            Built from the ground up for how Kampala actually shops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <Card className="p-6 bg-snow border-soft-linen hover:border-dusty-olive/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 text-carbon-black flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black mb-2">
              1. Scroll &amp; Discover
            </h3>
            <p className="text-sm text-carbon-black/70 leading-relaxed">
              No endless search bars. Scroll real video clips from verified Kampala boutiques and independent thrift curators.
            </p>
          </Card>

          {/* Pillar 2 */}
          <Card className="p-6 bg-snow border-soft-linen hover:border-dusty-olive/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 text-carbon-black flex items-center justify-center mb-5">
              <Camera className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black mb-2">
              2. Try-On
            </h3>
            <p className="text-sm text-carbon-black/70 leading-relaxed">
              Take one photo in private. See how any dress, jacket, or jeans looks on your shape so you know it fits before spending money. Every new account receives free try-on looks to start.
            </p>
          </Card>

          {/* Pillar 3 */}
          <Card className="p-6 bg-snow border-soft-linen hover:border-dusty-olive/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 text-carbon-black flex items-center justify-center mb-5">
              <Bike className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black mb-2">
              3. Check Before You Pay
            </h3>
            <p className="text-sm text-carbon-black/70 leading-relaxed">
              Our rider brings your package to your door and waits while you check the fabric and seams. You&apos;re always protected by easy 48-hour returns.
            </p>
          </Card>
        </div>
      </section>

      {/* System Requirements & FAQ Micro-Bar */}
      <section className="bg-soft-linen/30 border border-soft-linen rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-carbon-black">
              Questions about early access or device compatibility?
            </h3>
            <p className="text-xs text-carbon-black/65">
              Ve is currently in private development. The app will launch across Kampala on Android 8+ and iOS 15+, optimized for low-data 3G connections.
            </p>
          </div>
          <Link
            href="/faq#device-compatibility"
            className="inline-flex items-center text-xs font-semibold text-dusty-olive-dark hover:underline flex-shrink-0"
          >
            Read App FAQ <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Store, 
  Banknote, 
  Bike, 
  Sparkles, 
  Camera, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Mail, 
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become a Ve-ndor — Kampala Fashion Boutiques & Designers',
  description:
    'Grow your fashion boutique on Ve. Quick Mobile Money payouts, zero delivery headaches, catalog tagging, and easy returns.',
  openGraph: {
    title: 'Become a Ve-ndor — Sell on Ve in Kampala',
    description: 'Quick payouts, reliable deliveries, and sizing for Kampala fashion houses.',
    url: 'https://www.veapp.store/sell',
  },
  alternates: {
    canonical: '/sell',
  },
};

import { CONTACT_CONFIG } from '@/lib/contact';
import { getCmsData } from '@/lib/cms/cms-service';

export const revalidate = 60;

export default async function SellPage() {
  const cmsData = await getCmsData();
  const vendor = cmsData.vendorStrip;

  const whatsappUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Team, I run a fashion business in Kampala and want to learn about becoming a Ve-ndor'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl">
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-carbon-black tracking-tight leading-[1.1]">
          {vendor?.title || 'Sell where Kampala shops.'}
        </h1>

        <p className="text-base sm:text-xl text-carbon-black/75 leading-relaxed">
          {vendor?.description ||
            "Ahead of our upcoming Kampala public launch, we're onboarding premier boutiques and creators. Stop bargaining in inboxes and hustling with deliveries. We bring you verified buyers, send riders to collect packages from your shop, and send your earnings straight to your phone."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link href="/vendor">
            <Button variant="primary" size="md">
              {vendor?.primaryCtaText || 'Become a Ve-ndor'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="md">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-dusty-olive" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>

        <div className="text-xs text-carbon-black/60 pt-1 flex items-center gap-2">
          <span>Early merchant onboarding open · Fast boutique approval</span>
        </div>
      </section>

      {/* 4 Core Merchant Value Pillars (Simple & Non-Technical) */}
      <section className="space-y-12">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-carbon-black font-normal tracking-tight">
            Built to solve Kampala boutique headaches
          </h2>
          <p className="text-sm text-carbon-black/70 mt-2">
            No complex software or confusing terms. Just practical tools built for real shop owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Value 1: Never Double-Sell */}
          <Card className="p-8 bg-snow border-soft-linen space-y-4">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black">
              <Layers className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-carbon-black">
              Never Double-Sell a Piece
            </h3>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              When you sell an item across your shop counter, it automatically updates on Ve so an online buyer never orders the same piece.
            </p>
          </Card>

          {/* Value 2: Free Counter Pickups */}
          <Card className="p-8 bg-snow border-soft-linen space-y-4">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black">
              <Bike className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-carbon-black">
              Free Shop Counter Pickups
            </h3>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              Never haggle with street riders again. When an order lands, our rider comes to your shop counter, collects the package, and delivers it safely across Kampala.
            </p>
          </Card>

          {/* Value 3: Direct Mobile Money Payouts */}
          <Card className="p-8 bg-snow border-soft-linen space-y-4">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black">
              <Banknote className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-carbon-black">
              Direct Mobile Money Payouts
            </h3>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              No fake SMS screenshots. When a customer orders, payment is secured. Once the rider delivers, money lands directly in your MTN or Airtel line.
            </p>
          </Card>

          {/* Value 4: Clean Photos With Your Phone */}
          <Card className="p-8 bg-snow border-soft-linen space-y-4">
            <div className="w-12 h-12 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black">
              <Camera className="w-6 h-6 text-dusty-olive" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-carbon-black">
              Clean Photos With Your Phone
            </h3>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              Snap clothes on a hanger or mannequin in your shop. Ve automatically cleans up cluttered backgrounds into crisp catalog photos.
            </p>
          </Card>
        </div>
      </section>

      {/* Transparent Pricing & Everything Included */}
      <section className="space-y-12 pt-8 border-t border-soft-linen">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-carbon-black font-normal tracking-tight">
            Fair pricing. Keep your margins.
          </h2>
          <p className="text-sm text-carbon-black/70 mt-2">
            Zero upfront joining fees or recurring subscription traps. You only pay a commission when you make a verified sale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Performance Commission */}
          <Card className="p-8 bg-snow border-2 border-dusty-olive shadow-subtle flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-dusty-olive-dark font-semibold">
                Performance Based
              </div>
              <div className="font-serif text-4xl font-semibold text-carbon-black">
                From 6% <span className="text-base font-sans font-normal text-carbon-black/60">commission</span>
              </div>
              <p className="text-sm text-carbon-black/75 leading-relaxed">
                Commission ranges between 6% and 15% depending on your item category. As your boutique builds consistent order volume and great buyer reviews, your rate drops.
              </p>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-carbon-black/80">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Zero sign-up costs or monthly fees to get started</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Direct payouts to your MTN or Airtel line upon delivery</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Feed placement earned through reliability, not paid ads</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link href="/vendor" className="inline-block">
                <Button variant="primary" size="md">
                  Apply as a Ve-ndor
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: What Every Boutique Gets */}
          <Card className="p-8 bg-snow border border-soft-linen flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-dusty-olive-dark font-semibold">
                Built For You
              </div>
              <h3 className="font-serif text-2xl font-semibold text-carbon-black">
                Everything you need to sell
              </h3>
              <p className="text-sm text-carbon-black/75 leading-relaxed">
                We handle the delivery hustle, payment collection, and photo styling so you can focus on great fashion.
              </p>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-carbon-black/80">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Free doorstep package collection from your shop</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Try-On previews on shoppers&apos; phones to minimize returns</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Instant background cleanup for clean catalog photos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Simple phone tool so stock and cash always match</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button variant="secondary" size="md">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-dusty-olive" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Direct Escalation / Support Card */}
      <section className="bg-carbon-black text-snow rounded-2xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
            Have specific questions before applying?
          </h2>
          <p className="text-sm text-snow/75 leading-relaxed">
            Our merchant onboarding team is based in Kampala. We can visit your store, review your catalog, and get you set up quickly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="accent" size="md">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Chat on WhatsApp
            </Button>
          </a>

          <a
            href={`mailto:${CONTACT_CONFIG.emails.support}`}
            className="inline-flex items-center justify-center text-xs font-medium text-snow/80 hover:text-snow h-9 px-4 rounded-md border border-snow/20 hover:border-snow/40 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5 text-dusty-olive-light" />
            Email: {CONTACT_CONFIG.emails.support}
          </a>
        </div>
      </section>
    </div>
  );
}

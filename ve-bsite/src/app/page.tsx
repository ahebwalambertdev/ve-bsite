import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardSplitAccordion, type CardSplitAccordionItemData } from '@/components/ui/card-split-accordion';
import { ShieldCheck, Sparkles, Truck, Camera, Store, HelpCircle } from 'lucide-react';

import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { getCmsData } from '@/lib/cms/cms-service';

export const revalidate = 60; // ISR revalidation cache

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const cmsData = await getCmsData();

  // Filter CMS FAQs for Home display & AEO Schema
  const featuredFaqs = (cmsData.faqs || [])
    .filter((f) => f.isPublished && f.isFeaturedHome)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Map CMS FAQs to CardSplitAccordion format
  const homeFaqItems: CardSplitAccordionItemData[] = featuredFaqs.map((item) => {
    let IconComponent = HelpCircle;
    if (item.iconName === 'ShieldCheck') IconComponent = ShieldCheck;
    if (item.iconName === 'Truck') IconComponent = Truck;
    if (item.iconName === 'Camera') IconComponent = Camera;
    if (item.iconName === 'Store') IconComponent = Store;
    if (item.iconName === 'Sparkles') IconComponent = Sparkles;

    return {
      id: item.id,
      title: item.question,
      icon: <IconComponent className="w-5 h-5 text-dusty-olive" />,
      content: <span>{item.answer}</span>,
    };
  });

  // AEO Structured FAQ Schema for Google AI Overviews, Bing Copilot & ChatGPT
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: featuredFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-snow text-carbon-black">
      {/* Structured FAQ Schema for Answer Engine Optimization */}
      {featuredFaqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Optional Top Announcement Bar */}
      {cmsData.announcementBar?.enabled && (
        <div className="bg-carbon-black text-snow text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-neutral-800">
          <span>{cmsData.announcementBar.text}</span>
          {cmsData.announcementBar.linkText && (
            <Link
              href={cmsData.announcementBar.linkUrl || '/app'}
              className="underline text-dusty-olive-light hover:text-snow transition-colors"
            >
              {cmsData.announcementBar.linkText} →
            </Link>
          )}
        </div>
      )}

      {/* 1. HERO SECTION (Dynamic from CMS) */}
      <HeroSection dynamicContent={cmsData.hero} />

      {/* 2. CRAFTED PRIMITIVES & HOW IT WORKS PREVIEW */}
      <HowItWorksSection data={cmsData.howItWorks} />

      {/* 3. FREQUENTLY ASKED QUESTIONS PREVIEW (§10.2) */}
      <section className="py-20 bg-snow border-b border-soft-linen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-carbon-black">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-600">
              Clear, simple answers on payments, delivery, and returns.
            </p>
          </div>

          <CardSplitAccordion
            items={homeFaqItems}
            defaultOpenId={homeFaqItems[0]?.id || null}
          />

          <div className="text-center pt-4">
            <Link href="/faq">
              <Button variant="outline" size="sm">
                More FAQs →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. VENDOR TEASER STRIP (§4.2) */}
      <section className="py-16 bg-soft-linen/50 border-b border-soft-linen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-carbon-black text-snow p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-elevated">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-snow">
                {cmsData.vendorStrip.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {cmsData.vendorStrip.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/vendor">
                <Button variant="accent" size="md">
                  {cmsData.vendorStrip.primaryCtaText || 'Become a Ve-ndor'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

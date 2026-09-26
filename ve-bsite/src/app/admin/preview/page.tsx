'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteCmsData } from '@/lib/cms/types';
import { DEFAULT_CMS_DATA } from '@/lib/cms/defaults';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';

// Components for preview
import { HeroSection } from '@/components/home/hero-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { CardSplitAccordion, CardSplitAccordionItemData } from '@/components/ui/card-split-accordion';
import { Card } from '@/components/ui/card';
import { AspectContainer } from '@/components/ui/aspect-container';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Logo } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';
import { CopyEmailButton } from '@/components/ui/copy-email-button';
import { InboxesDropdown } from '@/components/contact/inboxes-dropdown';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Play, 
  Camera, 
  Store, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Bike, 
  Banknote, 
  MessageCircle, 
  Check, 
  Users, 
  ArrowLeft, 
  Smartphone, 
  RotateCcw,
  Mail,
  MapPin,
  Clock,
  Building2,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Heart,
  BookOpen
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact';

export default function AdminPreviewPage() {
  const searchParams = useSearchParams();
  const initialRoute = searchParams.get('route') || '/';

  const [cmsData, setCmsData] = useState<SiteCmsData>(DEFAULT_CMS_DATA);
  const [currentRoute, setCurrentRoute] = useState<string>(initialRoute);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'shopper' | 'vendor'>('shopper');
  const [selectedJournalCategory, setSelectedJournalCategory] = useState<string>('All');

  // Synchronize with URL search param changes
  useEffect(() => {
    const routeFromParam = searchParams.get('route') || '/';
    setCurrentRoute(routeFromParam);
  }, [searchParams]);

  // Handle postMessage communication with Visual Studio parent window
  useEffect(() => {
    // Notify parent window that preview frame is ready
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'CMS_DRAFT_UPDATE') {
        setCmsData(event.data.payload);
      } else if (event.data.type === 'NAVIGATE_TO_ROUTE') {
        const targetRoute = event.data.route || '/';
        setCurrentRoute(targetRoute);
        const newPreviewUrl = `/admin/preview?route=${encodeURIComponent(targetRoute)}`;
        window.history.replaceState({ route: targetRoute }, '', newPreviewUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Intercept navigation clicks in the web portal to notify the parent side editor
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Handle internal site links: e.g. "/contact", "/legal/terms", "/faq", "/#how-it-works", "/"
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Skip assets, svg downloads, and api routes
        if (
          anchor.hasAttribute('download') ||
          href.startsWith('/images') ||
          href.startsWith('/icons') ||
          href.startsWith('/assets') ||
          href.startsWith('/api')
        ) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const url = new URL(href, window.location.origin);
        const targetPath = url.pathname || '/';
        const targetHash = url.hash;

        setCurrentRoute(targetPath);
        const newPreviewUrl = `/admin/preview?route=${encodeURIComponent(targetPath)}${targetHash}`;
        window.history.pushState({ route: targetPath }, '', newPreviewUrl);

        // Notify parent studio window to synchronize side editor
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'PORTAL_NAVIGATED',
              route: targetPath,
              hash: targetHash,
              href: href,
            },
            '*'
          );
        }

        if (targetHash) {
          const el = document.querySelector(targetHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Handle browser back/forward within preview frame
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const route = params.get('route') || '/';
      setCurrentRoute(route);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'PORTAL_NAVIGATED',
            route: route,
          },
          '*'
        );
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Map CMS FAQs for Homepage
  const homeFaqItems: CardSplitAccordionItemData[] = (cmsData.faqs || [])
    .filter((f) => f.isPublished && f.isFeaturedHome)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      let IconComponent = HelpCircle;
      if (item.iconName === 'ShieldCheck') IconComponent = ShieldCheck;
      if (item.iconName === 'Truck') IconComponent = Truck;
      if (item.iconName === 'Camera') IconComponent = Camera;
      if (item.iconName === 'Store') IconComponent = Store;
      if (item.iconName === 'Sparkles') IconComponent = Sparkles;
      if (item.iconName === 'RotateCcw') IconComponent = RotateCcw;

      return {
        id: item.id,
        title: item.question,
        icon: <IconComponent className="w-5 h-5 text-dusty-olive" />,
        content: <span>{item.answer}</span>,
      };
    });

  // Group FAQs by category for Support & FAQ page
  const allPublishedFaqs = (cmsData.faqs || [])
    .filter((f) => f.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const faqCategories = Array.from(new Set(allPublishedFaqs.map((f) => f.category || 'General')));

  const whatsappUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Team, I have a question about the Ve marketplace in Kampala'
  );

  // Safe data fallbacks
  const aboutData = cmsData.about || DEFAULT_CMS_DATA.about;
  const contactData = cmsData.contact || DEFAULT_CMS_DATA.contact;
  const pressData = cmsData.press || DEFAULT_CMS_DATA.press;
  const termsData = cmsData.legalTerms || DEFAULT_CMS_DATA.legalTerms;
  const privacyData = cmsData.legalPrivacy || DEFAULT_CMS_DATA.legalPrivacy;
  const journalData = cmsData.journal || DEFAULT_CMS_DATA.journal;

  const filteredJournalArticles = selectedJournalCategory && selectedJournalCategory !== 'All'
    ? JOURNAL_ARTICLES.filter((a) => a.category.toLowerCase().includes(selectedJournalCategory.toLowerCase()))
    : JOURNAL_ARTICLES;

  return (
    <div className="min-h-screen bg-snow text-carbon-black flex flex-col no-scrollbar">
      {/* Hide scrollbar for realistic mobile & tablet frame screens */}
      <style>{`
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        ::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
        }
      `}</style>

      {/* Top Announcement Banner if enabled */}
      {cmsData.announcementBar?.enabled && (
        <div className="bg-carbon-black text-snow text-xs py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-neutral-800">
          <span>{cmsData.announcementBar.text}</span>
          {cmsData.announcementBar.linkText && (
            <Link
              href={cmsData.announcementBar.linkUrl || '/app'}
              className="underline cursor-pointer text-dusty-olive-light hover:text-snow transition-colors"
            >
              {cmsData.announcementBar.linkText} →
            </Link>
          )}
        </div>
      )}

      {/* ============================================================
          ROUTE: /app (App / Waitlist)
         ============================================================ */}
      {currentRoute === '/app' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              Private Beta Access · Kampala
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-tight">
              {cmsData.waitlist.title}{' '}
              <span className="italic">{cmsData.waitlist.titleItalic}</span>
            </h1>
            <p className="text-base text-carbon-black/75 max-w-2xl leading-relaxed">
              {cmsData.waitlist.description}
            </p>
          </div>

          {/* Interactive Waitlist Join Box Preview */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-soft-linen shadow-sm space-y-6 max-w-2xl">
            <div className="flex items-center gap-2 p-1 bg-soft-linen/40 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setSelectedRole('shopper')}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                  selectedRole === 'shopper'
                    ? 'bg-carbon-black text-snow shadow-xs'
                    : 'text-carbon-black/70'
                }`}
              >
                Shopper Early Access
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('vendor')}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                  selectedRole === 'vendor'
                    ? 'bg-carbon-black text-snow shadow-xs'
                    : 'text-carbon-black/70'
                }`}
              >
                Boutique Onboarding
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="MTN / Airtel Mobile Money Number"
                disabled
                className="flex-1 text-xs p-3 rounded-lg border border-soft-linen bg-snow text-neutral-500"
              />
              <Button variant="primary" size="md" className="shrink-0">
                Join Waiting List <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            <div className="pt-2 border-t border-soft-linen space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Exclusive Beta Perks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cmsData.waitlist.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-carbon-black/80">
                    <CheckCircle2 className="w-4 h-4 text-dusty-olive shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Card className="p-6 bg-snow border-soft-linen">
              <div className="w-10 h-10 rounded-lg bg-soft-linen flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-dusty-olive" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-carbon-black mb-1.5">
                1. Scroll &amp; Discover
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Scroll real short video clips from verified Kampala boutiques and thrift curators.
              </p>
            </Card>

            <Card className="p-6 bg-snow border-soft-linen">
              <div className="w-10 h-10 rounded-lg bg-soft-linen flex items-center justify-center mb-4">
                <Camera className="w-5 h-5 text-dusty-olive" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-carbon-black mb-1.5">
                2. Try-On on Your Phone
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Snap a private photo to see how outfits look on you before ordering.
              </p>
            </Card>

            <Card className="p-6 bg-snow border-soft-linen">
              <div className="w-10 h-10 rounded-lg bg-soft-linen flex items-center justify-center mb-4">
                <Bike className="w-5 h-5 text-dusty-olive" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-carbon-black mb-1.5">
                3. Fast Delivery &amp; Easy Returns
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Orders arrive fast at your door across Kampala, backed by protected payments and easy 48-hour returns.
              </p>
            </Card>
          </div>

          {/* System Requirements Note */}
          <div className="p-6 bg-soft-linen/30 border border-soft-linen rounded-xl flex items-center gap-4">
            <Smartphone className="w-6 h-6 text-dusty-olive shrink-0" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              {cmsData.waitlist.systemRequirementsNote}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /sell (Become a Ve-ndor)
         ============================================================ */}
      {currentRoute === '/sell' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              Kampala Boutique Merchant Network
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-tight">
              {cmsData.vendorStrip.title}
            </h1>
            <p className="text-base text-carbon-black/75 leading-relaxed">
              {cmsData.vendorStrip.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={cmsData.vendorStrip.primaryCtaLink || '/sell'}>
                <Button variant="primary" size="md">
                  {cmsData.vendorStrip.primaryCtaText} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <a
                href={cmsData.vendorStrip.secondaryCtaLink || 'https://veapp.store/vendor'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="md">
                  {cmsData.vendorStrip.secondaryCtaText}
                </Button>
              </a>
            </div>
          </div>

          {/* 4 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <Card className="p-6 bg-snow border-soft-linen space-y-3">
              <Banknote className="w-6 h-6 text-dusty-olive" />
              <h3 className="font-serif text-xl font-semibold text-carbon-black">
                Predictable Mobile Money Payouts
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                No fake SMS screenshots. Payments are protected and disburse directly to your MTN or Airtel wallet upon confirmed delivery.
              </p>
            </Card>

            <Card className="p-6 bg-snow border-soft-linen space-y-3">
              <Bike className="w-6 h-6 text-dusty-olive" />
              <h3 className="font-serif text-xl font-semibold text-carbon-black">
                End-to-End Boda Logistics
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Trained Ve riders collect orders directly from your boutique counter. You never have to negotiate with stage bodas again.
              </p>
            </Card>

            <Card className="p-6 bg-snow border-soft-linen space-y-3">
              <Camera className="w-6 h-6 text-dusty-olive" />
              <h3 className="font-serif text-xl font-semibold text-carbon-black">
                Fewer Returns with Try-On
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Shoppers see how your outfits look on them through Try-On before ordering, helping them buy with confidence.
              </p>
            </Card>

            <Card className="p-6 bg-snow border-soft-linen space-y-3">
              <Store className="w-6 h-6 text-dusty-olive" />
              <h3 className="font-serif text-xl font-semibold text-carbon-black">
                No Upfront Subscription Fees
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Joining Ve is free. We only charge a small performance commission when an item is successfully delivered and kept.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /faq (Support & FAQ)
         ============================================================ */}
      {currentRoute === '/faq' && (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
          <div className="text-center space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-carbon-black">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-neutral-600 max-w-xl mx-auto">
              Clear, transparent answers on payments, delivery, sizing, and boutique onboarding.
            </p>
          </div>

          {/* Grouped Accordions by Category */}
          <div className="space-y-10">
            {faqCategories.map((category) => {
              const categoryItems: CardSplitAccordionItemData[] = allPublishedFaqs
                .filter((f) => f.category === category)
                .map((f) => {
                  let IconComponent = HelpCircle;
                  if (f.iconName === 'ShieldCheck') IconComponent = ShieldCheck;
                  if (f.iconName === 'Truck') IconComponent = Truck;
                  if (f.iconName === 'Camera') IconComponent = Camera;
                  if (f.iconName === 'Store') IconComponent = Store;
                  if (f.iconName === 'RotateCcw') IconComponent = RotateCcw;

                  return {
                    id: f.id,
                    title: f.question,
                    icon: <IconComponent className="w-5 h-5 text-dusty-olive" />,
                    content: <span>{f.answer}</span>,
                  };
                });

              return (
                <div key={category} className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-carbon-black border-b border-soft-linen pb-2">
                    {category}
                  </h3>
                  <CardSplitAccordion items={categoryItems} />
                </div>
              );
            })}
          </div>

          {/* Persistent WhatsApp Escalation Card */}
          <div className="p-8 rounded-2xl bg-soft-linen/40 border border-soft-linen flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif text-xl font-semibold text-carbon-black">
                Still have questions?
              </h4>
              <p className="text-xs text-neutral-600">
                Chat directly with our Kampala support desk on WhatsApp for fast assistance.
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="accent" size="md">
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /team (Team)
         ============================================================ */}
      {currentRoute === '/team' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              The Humans Behind Ve
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-carbon-black">
              Our Kampala Team
            </h1>
            <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
              Meet the founders, operators, curators, and engineers building Kampala’s trusted fashion marketplace and Try-On ecosystem.
            </p>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(cmsData.team || []).map((member) => (
              <Card key={member.id} className="overflow-hidden bg-white border-soft-linen shadow-xs">
                <AspectContainer ratio="4/5">
                  <div className="relative w-full h-full bg-soft-linen/60 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-dusty-olive" />
                    )}
                  </div>
                </AspectContainer>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-carbon-black">
                      {member.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-dusty-olive/15 text-dusty-olive-dark font-medium">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {member.bio}
                  </p>
                  {member.socialTwitter && (
                    <div className="pt-2">
                      <a
                        href={member.socialTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-dusty-olive-dark hover:underline font-medium"
                      >
                        Twitter / X →
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Careers / Contact Strip */}
          <div className="rounded-2xl bg-carbon-black text-snow p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-snow">
                Want to build with us in Kampala?
              </h3>
              <p className="text-xs text-neutral-300 max-w-lg leading-relaxed">
                We are always seeking talented mobile engineers, fashion curators, and operations leads.
              </p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="accent" size="md">
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Chat With the Team
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /about (About Ve - Full Live Preview)
         ============================================================ */}
      {currentRoute === '/about' && (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
          {/* Manifesto Headline */}
          <div className="space-y-4 text-left">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              {aboutData.badge}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-[1.15]">
              {aboutData.manifestoHeadline}
              <br />
              <span className="italic text-dusty-olive-dark">{aboutData.manifestoItalic}</span>
            </h1>
            <p className="text-base sm:text-lg text-carbon-black/80 leading-relaxed font-light">
              {aboutData.manifestoDescription}
            </p>
          </div>

          {/* Core Problem Breakdown */}
          <section className="space-y-6 pt-8 border-t border-soft-linen">
            <h2 className="font-serif text-2xl sm:text-3xl text-carbon-black font-semibold">
              {aboutData.problemTitle}
            </h2>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              {aboutData.problemDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {aboutData.problemPoints.map((point) => (
                <Card key={point.id} className="p-5 bg-snow border-soft-linen space-y-1.5">
                  <h3 className="font-serif text-base font-semibold text-carbon-black">
                    {point.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {point.text}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Operational Solution Pillars */}
          <section className="space-y-6 pt-8 border-t border-soft-linen">
            <h2 className="font-serif text-2xl sm:text-3xl text-carbon-black font-semibold">
              {aboutData.solutionTitle}
            </h2>
            <p className="text-sm text-carbon-black/75 leading-relaxed">
              {aboutData.solutionDescription}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {aboutData.pillars.map((pillar) => {
                let PillarIcon = Sparkles;
                if (pillar.iconName === 'ShieldCheck') PillarIcon = ShieldCheck;
                if (pillar.iconName === 'Truck') PillarIcon = Truck;
                if (pillar.iconName === 'Camera') PillarIcon = Camera;
                if (pillar.iconName === 'Heart') PillarIcon = Heart;

                return (
                  <Card key={pillar.id} className="p-6 bg-snow border-soft-linen space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black">
                      <PillarIcon className="w-5 h-5 text-dusty-olive" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-carbon-black">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Coupled Team Cards Grid */}
          <section className="space-y-6 pt-8 border-t border-soft-linen">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-carbon-black">The Humans Behind Ve</h2>
              <Link href="/team" className="text-xs font-semibold text-dusty-olive-dark hover:underline">
                View Full Team →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(cmsData.team || []).map((member) => (
                <Card key={member.id} className="overflow-hidden bg-white border-soft-linen shadow-xs">
                  <AspectContainer ratio="4/5">
                    <div className="relative w-full h-full bg-soft-linen/60 flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-12 h-12 text-dusty-olive" />
                      )}
                    </div>
                  </AspectContainer>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-bold text-carbon-black">
                        {member.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-dusty-olive/15 text-dusty-olive-dark font-medium">
                        {member.role}
                      </span>
                    </div>
                    {member.bio && (
                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ============================================================
          ROUTE: /contact (Contact & Escalations)
         ============================================================ */}
      {currentRoute === '/contact' && (
        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              {contactData.badge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
              {contactData.headline}
            </h1>
            <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
              {contactData.subheadline}
            </p>
          </div>

          {/* Primary WhatsApp Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Support */}
            <Card className="p-8 bg-snow border-soft-linen flex flex-col justify-between space-y-6 shadow-subtle">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-carbon-black">
                  {contactData.supportCardTitle}
                </h2>
                <p className="text-sm text-carbon-black/70 leading-relaxed">
                  {contactData.supportCardDescription}
                </p>
                <div className="flex items-center gap-2 text-xs text-carbon-black/60 pt-2">
                  <Clock className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>{contactData.supportCardHours}</span>
                </div>
              </div>

              <div className="pt-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="primary" size="md">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    {contactData.supportCardCtaText}
                  </Button>
                </a>
              </div>
            </Card>

            {/* Merchant Onboarding */}
            <Card className="p-8 bg-snow border-soft-linen flex flex-col justify-between space-y-6 shadow-subtle">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
                  <Store className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-carbon-black">
                  {contactData.merchantCardTitle}
                </h2>
                <p className="text-sm text-carbon-black/70 leading-relaxed">
                  {contactData.merchantCardDescription}
                </p>
                <div className="flex items-center gap-2 text-xs text-carbon-black/60 pt-2">
                  <Clock className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>{contactData.merchantCardHours}</span>
                </div>
              </div>

              <div className="pt-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="secondary" size="md">
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-dusty-olive" />
                    {contactData.merchantCardCtaText}
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Email Directory & Operations Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Email Directory as Dropdown */}
            <Card className="p-6 bg-snow border-soft-linen md:col-span-2 shadow-subtle">
              <InboxesDropdown
                title={contactData.inboxesTitle}
                inboxes={contactData.inboxes}
              />
            </Card>

            {/* Operations & Coverage */}
            <Card className="p-6 bg-snow border-soft-linen space-y-4 flex flex-col justify-between shadow-subtle">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
                  <div className="w-6 h-6 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span>{contactData.officeTitle}</span>
                </div>

                <div className="space-y-1.5 text-xs text-carbon-black/80">
                  <div className="font-semibold text-carbon-black">{contactData.officeName}</div>
                  <p className="leading-relaxed text-neutral-600">{contactData.officeAddress}</p>
                  <p className="text-[11px] text-dusty-olive-dark font-mono pt-1">{contactData.officeHours}</p>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 border-t border-soft-linen pt-2">
                {contactData.officeNote}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /press (Press & Media Kit)
         ============================================================ */}
      {currentRoute === '/press' && (
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              {pressData.badge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
              {pressData.title}
            </h1>
            <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
              {pressData.description}
            </p>
          </div>

          {/* Company Boilerplate */}
          <section className="space-y-4 pt-6 border-t border-soft-linen">
            <h2 className="font-serif text-2xl font-semibold text-carbon-black">
              {pressData.boilerplateTitle}
            </h2>
            <Card className="p-6 bg-snow border-soft-linen space-y-3 text-sm text-carbon-black/85 leading-relaxed">
              <p>{pressData.boilerplateText}</p>
            </Card>
          </section>

          {/* Color Palette Tokens */}
          <section className="space-y-6 pt-6 border-t border-soft-linen">
            <h2 className="font-serif text-2xl font-semibold text-carbon-black">
              {pressData.paletteTitle}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pressData.palette.map((color) => (
                <div
                  key={color.name}
                  className="p-4 rounded-xl border border-soft-linen space-y-3 bg-snow"
                >
                  <div
                    className="w-full h-14 rounded-lg border border-carbon-black/10 shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <div className="font-semibold text-xs text-carbon-black">{color.name}</div>
                    <div className="text-[11px] font-mono text-carbon-black/60">{color.hex}</div>
                    <div className="text-[10px] text-carbon-black/50 mt-1">{color.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Assets & Logo Marks */}
          <section className="space-y-6 pt-6 border-t border-soft-linen">
            <h2 className="font-serif text-2xl font-semibold text-carbon-black">
              Brand Marks &amp; Assets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-snow border-soft-linen space-y-4">
                <div className="h-24 bg-snow rounded-xl border border-soft-linen flex items-center justify-center">
                  <Logo className="h-10 w-auto" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-carbon-black">Primary Wordmark (Dark on Snow)</span>
                  <a
                    href="/icons/ve-logo-dark.svg"
                    download="ve-logo-dark.svg"
                    className="text-dusty-olive-dark hover:underline font-mono flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG Download
                  </a>
                </div>
              </Card>

              <Card className="p-6 bg-carbon-black text-snow border-carbon-black space-y-4">
                <div className="h-24 bg-carbon-black rounded-xl border border-carbon-black/40 flex items-center justify-center">
                  <Logo inverted className="h-10 w-auto" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-snow">Inverted Wordmark (Snow on Carbon)</span>
                  <a
                    href="/icons/ve-logo-white.svg"
                    download="ve-logo-white.svg"
                    className="text-dusty-olive-light hover:underline font-mono flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG Download
                  </a>
                </div>
              </Card>
            </div>
          </section>

          {/* Media Contact Strip */}
          <div className="p-6 rounded-xl bg-soft-linen/30 border border-soft-linen flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-carbon-black">Direct Press Inquiries</span>
              <p className="text-xs text-neutral-600">Interviews, commentary, and high-res asset requests</p>
            </div>
            <CopyEmailButton email={pressData.inquiriesEmail} showEmailText variant="pill" className="text-dusty-olive-dark" />
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /legal/terms (Terms of Service)
         ============================================================ */}
      {currentRoute === '/legal/terms' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sticky TOC Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-12 self-start">
              <div className="p-6 bg-snow border border-soft-linen rounded-2xl shadow-subtle space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
                  <FileText className="w-4 h-4 text-dusty-olive" />
                  <span>Table of Contents</span>
                </div>

                <nav className="space-y-2 text-xs text-carbon-black/75">
                  {termsData.sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block hover:text-dusty-olive-dark transition-colors truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-soft-linen text-[11px] text-carbon-black/50">
                  Related Document:{' '}
                  <Link href="/legal/privacy" className="text-dusty-olive-dark font-medium underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </aside>

            {/* Legal Text Content */}
            <main className="lg:col-span-8 space-y-12">
              <header className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-xs font-medium text-carbon-black/60 hover:text-carbon-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Home
                </Link>

                <div className="space-y-2">
                  <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight">
                    {termsData.title}
                  </h1>
                  <p className="text-xs text-carbon-black/60 font-mono">
                    Effective Date: {termsData.effectiveDate} · Version {termsData.version} · Governing Jurisdiction: {termsData.jurisdiction}
                  </p>
                </div>
              </header>

              <article className="space-y-10 text-sm leading-relaxed text-carbon-black/85">
                {termsData.sections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="space-y-3 pt-6 border-t border-soft-linen">
                    <h2 className="font-serif text-xl font-semibold text-carbon-black">
                      {sec.title}
                    </h2>
                    {sec.paragraphs.map((para, pIndex) => (
                      <p key={pIndex}>{para}</p>
                    ))}
                  </section>
                ))}
              </article>
            </main>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /legal/privacy (Privacy Policy)
         ============================================================ */}
      {currentRoute === '/legal/privacy' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sticky TOC Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-12 self-start">
              <div className="p-6 bg-snow border border-soft-linen rounded-2xl shadow-subtle space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
                  <Lock className="w-4 h-4 text-dusty-olive" />
                  <span>Privacy Sections</span>
                </div>

                <nav className="space-y-2 text-xs text-carbon-black/75">
                  {privacyData.sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block hover:text-dusty-olive-dark transition-colors truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-soft-linen text-[11px] text-carbon-black/50">
                  Related Document:{' '}
                  <Link href="/legal/terms" className="text-dusty-olive-dark font-medium underline">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </aside>

            {/* Legal Text Content */}
            <main className="lg:col-span-8 space-y-12">
              <header className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-xs font-medium text-carbon-black/60 hover:text-carbon-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Home
                </Link>

                <div className="space-y-2">
                  <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight">
                    {privacyData.title}
                  </h1>
                  <p className="text-xs text-carbon-black/60 font-mono">
                    Effective Date: {privacyData.effectiveDate} · Version {privacyData.version} · {privacyData.complianceBadge}
                  </p>
                </div>
              </header>

              <article className="space-y-10 text-sm leading-relaxed text-carbon-black/85">
                {privacyData.sections.map((sec) => (
                  <section key={sec.id} id={sec.id} className="space-y-3 pt-6 border-t border-soft-linen">
                    <h2 className="font-serif text-xl font-semibold text-carbon-black">
                      {sec.title}
                    </h2>
                    {sec.paragraphs.map((para, pIndex) => (
                      <p key={pIndex}>{para}</p>
                    ))}
                  </section>
                ))}
              </article>
            </main>
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: /journal (Ve Journal)
         ============================================================ */}
      {currentRoute === '/journal' && (
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
              Editorial &amp; Culture
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
              {journalData.title}
            </h1>
            <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
              {journalData.description}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-b border-soft-linen pb-6">
            {journalData.categories.map((cat) => {
              const isSelected = selectedJournalCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedJournalCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-dusty-olive text-snow'
                      : 'bg-soft-linen/50 text-carbon-black/80 hover:bg-soft-linen'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredJournalArticles.map((article) => (
              <div key={article.slug} className="group flex flex-col justify-between">
                <Card className="h-full bg-snow border-soft-linen group-hover:border-dusty-olive transition-all flex flex-col justify-between p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="olive" size="sm">
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[11px] text-carbon-black/60 font-medium">
                        <Clock className="w-3.5 h-3.5 text-dusty-olive" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h2 className="font-serif text-xl font-semibold text-carbon-black group-hover:text-dusty-olive-dark transition-colors leading-snug">
                      {article.title}
                    </h2>

                    <p className="text-xs text-carbon-black/70 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="text-[11px] text-carbon-black/50 font-medium pt-1">
                      {new Date(article.publishedAt).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-soft-linen flex items-center justify-between text-xs font-semibold text-dusty-olive-dark">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          ROUTE: / (Homepage Default)
         ============================================================ */}
      {(currentRoute === '/' || (![
        '/app',
        '/sell',
        '/faq',
        '/team',
        '/about',
        '/contact',
        '/press',
        '/legal/terms',
        '/legal/privacy',
        '/journal',
      ].includes(currentRoute))) && (
        <div className="flex-1">
          {/* 1. HERO SECTION */}
          <HeroSection
            onOpenDemo={() => setIsDemoModalOpen(true)}
            dynamicContent={cmsData.hero}
          />

          {/* 2. CRAFTED PRIMITIVES (HOW IT WORKS) */}
          <HowItWorksSection data={cmsData.howItWorks} />

          {/* 3. FAQ SECTION WITH CARD SPLIT ACCORDION */}
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
            </div>
          </section>

          {/* 4. VENDOR TEASER STRIP */}
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
                  <Link href={cmsData.vendorStrip.primaryCtaLink || '/sell'}>
                    <Button variant="accent" size="md">
                      {cmsData.vendorStrip.primaryCtaText}
                    </Button>
                  </Link>
                  <a
                    href={cmsData.vendorStrip.secondaryCtaLink || 'https://veapp.store/vendor'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="md"
                      className="border-neutral-700 bg-transparent text-snow hover:bg-neutral-800"
                    >
                      {cmsData.vendorStrip.secondaryCtaText.replace(/→\s*$/, '').trim()} →
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Demo Modal Preview */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title={cmsData.hero.demoVideoTitle}
      >
        <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
          <p>{cmsData.hero.demoVideoDescription}</p>
          <AspectContainer ratio="video">
            <div className="absolute inset-0 bg-carbon-black flex flex-col items-center justify-center text-snow p-6 text-center">
              <Play className="h-10 w-10 text-dusty-olive mb-2" />
              <span className="text-xs font-medium">Ve Interactive Preview</span>
            </div>
          </AspectContainer>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md">
              {cmsData.hero.primaryCtaText}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

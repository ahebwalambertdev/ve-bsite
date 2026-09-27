import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Team1 } from '@/components/ui/team-1';
import { ArrowRight, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Ve — Why We Built Ve',
  description:
    'Why we built Ve: no more sizing guesswork, disappearing riders, or lost mobile money in Kampala. Real boutique fashion, verified trust.',
  openGraph: {
    title: 'About Ve — Rebuilding Fashion Trust in Kampala',
    description: 'Ve is Kampala’s fashion discovery and Try-On marketplace.',
    url: 'https://www.veapp.store/about',
  },
  alternates: {
    canonical: '/about',
  },
};

import { getCmsData } from '@/lib/cms/cms-service';
import type { TeamMemberData } from '@/lib/cms/types';
import type { SocialLink } from '@/components/ui/team-1';

export const revalidate = 60;

export default async function AboutPage() {
  const cmsData = await getCmsData();

  const teamMembers = (cmsData.team || []).map((m: TeamMemberData) => {
    const socials: SocialLink[] = [];
    if (m.socialTwitter) socials.push({ icon: 'twitter' as const, url: m.socialTwitter });
    if (m.socialLinkedin) socials.push({ icon: 'linkedin' as const, url: m.socialLinkedin });
    if (m.socialEmail) socials.push({ icon: 'email' as const, url: m.socialEmail.startsWith('mailto:') ? m.socialEmail : `mailto:${m.socialEmail}` });
    return {
      id: m.id,
      name: m.name,
      role: m.role,
      image: m.image,
      bio: m.bio,
      socials: socials.length > 0 ? socials : undefined,
    };
  });
  const aboutData = cmsData.about || {
    badge: 'Our Story & Mission',
    manifestoHeadline: 'Africa has the most vibrant fashion in the world.',
    manifestoItalic: "Buying it online shouldn't feel like gambling.",
    manifestoDescription:
      'We founded Ve because everyone in Kampala has an Online shopping horror story: sending Mobile Money before anything arrives, waiting days for a delivery that never comes, or opening a parcel to find a completely wrong size or even item from what was advertised.',
    problemTitle: 'Why Buying Clothes on Instagram & WhatsApp Broke Down',
    problemDescription:
      'Across Kampala, thousands of talented designers and boutique owners run their shops over WhatsApp and Instagram DMs. But without real buyer protections, every order feels risky:',
    problemPoints: [
      {
        id: 'sizing',
        title: 'Sizing Guesswork',
        text: 'UK, US, and European size tags rarely match real bodies or tailored clothes. Shoppers guess, and clothes often arrive too tight or too loose.',
      },
      {
        id: 'screenshot',
        title: 'The "Send Screenshot" Trap',
        text: 'Sellers ask for Mobile Money upfront before anything ships. If the package doesn’t show up, you are left with zero recourse.',
      },
      {
        id: 'delivery',
        title: 'Delivery Headaches',
        text: 'Random street riders get lost, damage clothes in the rain, or demand extra cash when they reach your gate.',
      },
      {
        id: 'returns',
        title: 'No Returns or Refunds',
        text: 'When an outfit doesn’t fit or looks nothing like the photo, sellers rarely accept returns or refund your money.',
      },
    ],
    solutionTitle: 'How Ve Protects You Every Step of the Way',
    solutionDescription:
      'Polite customer care isn’t enough to build trust. We built real guarantees into how every order is bought, tested, and delivered:',
    pillars: [
      {
        id: 'p1',
        title: 'Try-On on Your Phone',
        description:
          'See how clothes look on you before ordering. Preview outfits right on your phone so you can shop with confidence.',
        iconName: 'Sparkles',
      },
      {
        id: 'p2',
        title: 'Protected Payments',
        description:
          'Pay with MTN MoMo, Airtel Money, or card. We hold your payment safe until your order is delivered.',
        iconName: 'ShieldCheck',
      },
      {
        id: 'p3',
        title: 'Fast Delivery & Easy Returns',
        description:
          'Orders arrive fast at your door across Kampala, backed by simple 48-hour returns if you need a different size.',
        iconName: 'Truck',
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      {/* Manifesto Headline */}
      <section className="space-y-6 text-left">
        <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
          {aboutData.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-carbon-black tracking-tight leading-[1.15]">
          {aboutData.manifestoHeadline}
          <br />
          <span className="italic text-dusty-olive-dark">{aboutData.manifestoItalic}</span>
        </h1>

        <p className="text-lg sm:text-xl text-carbon-black/80 leading-relaxed font-light">
          {aboutData.manifestoDescription}
        </p>
      </section>

      {/* The Core Problem */}
      <section className="space-y-6 pt-8 border-t border-soft-linen">
        <h2 className="font-serif text-2xl sm:text-3xl text-carbon-black font-semibold">
          {aboutData.problemTitle}
        </h2>

        <div className="space-y-4 text-base text-carbon-black/75 leading-relaxed">
          <p>
            {aboutData.problemDescription}
          </p>

          <ul className="list-disc pl-6 space-y-2 text-carbon-black/80">
            {aboutData.problemPoints.map((point) => (
              <li key={point.id}>
                <strong>{point.title}:</strong> {point.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The Operational Fix */}
      <section className="space-y-6 pt-8 border-t border-soft-linen">
        <h2 className="font-serif text-2xl sm:text-3xl text-carbon-black font-semibold">
          {aboutData.solutionTitle}
        </h2>

        <p className="text-base text-carbon-black/75 leading-relaxed">
          {aboutData.solutionDescription}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {aboutData.pillars.map((pillar) => {
            let PillarIcon = Sparkles;
            if (pillar.iconName === 'ShieldCheck') PillarIcon = ShieldCheck;
            if (pillar.iconName === 'Heart') PillarIcon = Heart;
            if (pillar.iconName === 'MapPin') PillarIcon = MapPin;

            return (
              <Card key={pillar.id} className="p-6 bg-snow border-soft-linen space-y-3">
                <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black">
                  <PillarIcon className="w-5 h-5 text-dusty-olive" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-carbon-black">{pillar.title}</h3>
                <p className="text-xs text-carbon-black/70 leading-relaxed">
                  {pillar.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Team Section (Watermelon UI with Ve DNA) */}
      <Team1 members={teamMembers.length > 0 ? teamMembers : undefined} className="py-0" />

      {/* Founder's Letter */}
      <section className="bg-soft-linen/25 border border-soft-linen rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dusty-olive text-snow flex items-center justify-center font-serif font-bold text-lg">
            A
          </div>
          <div>
            <div className="text-base font-semibold text-carbon-black">Ahebwa</div>
            <div className="text-xs text-carbon-black/60">Founder, Ve Ecosystem · Kampala</div>
          </div>
        </div>

        <div className="space-y-4 font-serif text-base sm:text-lg text-carbon-black/85 leading-relaxed italic">
          <p>
            “When we started building Ve, everyone warned us: ‘E-commerce doesn't work in Uganda. People only buy in person at Owino or downtown.’ But our generation isn't refusing to buy online because they don't want to; they are refusing because the existing platforms refuse to protect them.”
          </p>
          <p>
            “Our commitment is total buyer and seller protection. We hold your payment safe until your order is delivered to your door, let you inspect your package before paying, and guarantee hassle-free returns. That is the only way genuine trust is earned.”
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link href="/app">
            <Button variant="primary" size="md">
              Join Waiting List
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <Link href="/vendor">
            <Button variant="outline" size="md">
              Become a Ve-ndor
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

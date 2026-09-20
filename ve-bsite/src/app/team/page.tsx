import type { Metadata } from 'next';
import Link from 'next/link';
import { Team1, type SocialLink } from '@/components/ui/team-1';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact';
import { getCmsData } from '@/lib/cms/cms-service';
import { TeamMemberData } from '@/lib/cms/types';

export const metadata: Metadata = {
  title: 'Our Team — The Humans Building Ve | Kampala',
  description:
    'Meet the founders, engineers, curators, and logistics operators building Kampala’s trusted fashion marketplace and Try-On ecosystem.',
  openGraph: {
    title: 'Our Team — Ve Fashion Marketplace',
    description: 'The Kampala team building trusted fashion commerce with Try-On and escrow protection.',
    url: 'https://www.veapp.store/team',
  },
};

export const revalidate = 60;

export default async function TeamPage() {
  const cmsData = await getCmsData();
  const whatsappUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Team, I would love to connect with your team in Kampala'
  );

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

  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-carbon-black/60 hover:text-carbon-black transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Home
        </Link>
      </div>

      {/* Main Team Component (Watermelon UI with Ve DNA) */}
      <Team1 members={teamMembers.length > 0 ? teamMembers : undefined} className="pt-0 pb-16 sm:pb-20" />

      {/* Cross-Link & Join Us Strip */}
      <section className="border-t border-soft-linen py-16 bg-soft-linen/25">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-carbon-black text-snow p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-elevated">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-snow">
                Want to build with us in Kampala?
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                We are always looking for passionate operators, mobile engineers, and fashion curators who care deeply about solving trust in East African e-commerce.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" size="md">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  Chat With the Team
                </Button>
              </a>
              <Link href="/about">
                <Button variant="outline" size="md" className="border-neutral-700 bg-transparent text-snow hover:bg-neutral-800">
                  Read Our Story
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

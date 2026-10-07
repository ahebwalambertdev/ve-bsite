'use client';

import * as React from 'react';
import Image from 'next/image';
import { Twitter, Linkedin, Github, Dribbble, Globe, Mail, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SocialIconType = 'twitter' | 'linkedin' | 'github' | 'dribbble' | 'website' | 'email';

export interface SocialLink {
  icon: SocialIconType;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  socials?: SocialLink[];
}

export interface Team1Props {
  badge?: string;
  heading?: string;
  description?: string;
  members?: TeamMember[];
  className?: string;
}

const IconMap: Record<SocialIconType, React.ElementType> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  dribbble: Dribbble,
  website: Globe,
  email: Mail,
};

function TeamSocialButton({
  social,
  memberName,
}: {
  social: SocialLink;
  memberName: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const isEmail = social.icon === 'email' || social.url.startsWith('mailto:');
  const cleanEmail = isEmail ? social.url.replace(/^mailto:/, '') : '';
  const Icon = IconMap[social.icon] || Globe;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEmail && cleanEmail) {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(cleanEmail).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
      }
    }
  };

  return (
    <a
      href={social.url}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-full text-snow backdrop-blur-sm transition-all focus:ring-2 focus:ring-dusty-olive focus:outline-none',
        copied
          ? 'bg-emerald-600 text-snow scale-110'
          : 'bg-snow/15 hover:bg-snow hover:text-carbon-black'
      )}
      aria-label={
        copied
          ? `Copied ${memberName}'s email`
          : isEmail
          ? `Email ${memberName} (${cleanEmail}) — clicks to mail & copies to clipboard`
          : `Visit ${memberName}'s ${social.icon}`
      }
      title={
        copied
          ? `Copied ${cleanEmail} to clipboard!`
          : isEmail
          ? `Email ${cleanEmail} (click to open & copy)`
          : undefined
      }
    >
      {copied ? <Check className="h-3.5 w-3.5 text-snow" /> : <Icon className="h-3.5 w-3.5" />}
    </a>
  );
}

export const DEFAULT_VE_TEAM: TeamMember[] = [
  {
    id: 'ahebwa',
    name: 'Lambert Ahebwa',
    role: 'Founder, CEO & Product Owner',
    image: '/images/streetwear-sun.jpg',
    bio: 'Leading product vision, trust architecture, and commercial execution for Kampala’s fashion culture.',
    socials: [
      { icon: 'twitter', url: 'https://twitter.com' },
      { icon: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    id: 'frontend-lead',
    name: 'Lordin Mayiga',
    role: 'Front End Designer',
    image: '/images/portrait-close.jpg',
    bio: 'Designing and building intuitive, responsive web and mobile interfaces for fashion discovery and boutique management in Kampala.',
    socials: [
      { icon: 'linkedin', url: 'https://linkedin.com' },
      { icon: 'email', url: 'mailto:info@veapp.store' },
    ],
  },
  {
    id: 'backend-dev-1',
    name: 'Joseph Kajjabwangu',
    role: 'Backend Developer',
    image: '/images/streetwear-look.jpg',
    bio: 'Engineering high-resilience database architecture, escrow payment state machines, and real-time backend infrastructure.',
    socials: [
      { icon: 'github', url: 'https://github.com' },
      { icon: 'twitter', url: 'https://twitter.com' },
    ],
  },
  {
    id: 'backend-dev-2',
    name: 'Ryan Watts',
    role: 'Backend Developer',
    image: '/images/court-depth.jpg',
    bio: 'Architecting serverless edge functions, courier dispatch APIs, and robust mobile money integrations across Kampala.',
    socials: [
      { icon: 'linkedin', url: 'https://linkedin.com' },
      { icon: 'email', url: 'mailto:support@veapp.store' },
    ],
  },
];

export function Team1({
  badge,
  heading = 'The Humans Behind Ve',
  description = 'A Kampala-based team of operators, curators, and engineers building the trusted foundation for East African fashion commerce.',
  members = DEFAULT_VE_TEAM,
  className,
}: Team1Props) {
  return (
    <section className={cn('py-16 sm:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Block with Ve DNA */}
        <div className="mb-12 sm:mb-16 max-w-2xl text-left space-y-3">
          {badge && (
            <div className="inline-flex items-center rounded-full border border-soft-linen bg-snow px-3 py-1 text-xs font-semibold text-dusty-olive-dark">
              {badge}
            </div>
          )}
          {heading && (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-carbon-black tracking-tight leading-[1.15]">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed font-sans">
              {description}
            </p>
          )}
        </div>

        {/* Interactive Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-soft-linen bg-carbon-black shadow-subtle focus-within:ring-2 focus-within:ring-dusty-olive focus-within:ring-offset-2 transition-all hover:border-dusty-olive/60"
              tabIndex={0}
            >
              {/* Member Portrait */}
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Masked Backdrop Blur on Hover/Focus */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 backdrop-blur-md transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100 pointer-events-none"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to top, black 15%, transparent 75%)',
                  maskImage:
                    'linear-gradient(to top, black 15%, transparent 75%)',
                }}
              />

              {/* Dark Gradient Veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/35 to-transparent opacity-80 transition-opacity duration-500 group-focus-within:opacity-95 group-hover:opacity-95" />

              {/* Content Card with Smooth Height Reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-snow">
                <div className="z-10 space-y-1">
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-snow">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-dusty-olive">
                    {member.role}
                  </p>

                  <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-3 pt-2">
                        {member.bio && (
                          <p className="line-clamp-3 text-xs leading-relaxed text-snow/80 font-sans">
                            {member.bio}
                          </p>
                        )}
                        {member.socials && member.socials.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            {member.socials.map((social, idx) => (
                              <TeamSocialButton
                                key={idx}
                                social={social}
                                memberName={member.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team1;

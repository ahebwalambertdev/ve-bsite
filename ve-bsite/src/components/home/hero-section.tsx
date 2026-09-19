'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { HeroContent } from '@/lib/cms/types';
import { Modal } from '@/components/ui/modal';
import { AspectContainer } from '@/components/ui/aspect-container';

export interface HeroSectionProps {
  onOpenDemo?: () => void;
  dynamicContent?: HeroContent;
}

const DEFAULT_HERO_LOOKS = [
  {
    id: 'court-depth',
    label: 'Look 01 · Court Streetwear',
    image: '/images/court-depth.jpg',
  },
  {
    id: 'portrait-close',
    label: 'Look 02 · Editorial Beauty',
    image: '/images/portrait-close.jpg',
  },
  {
    id: 'streetwear-sun',
    label: 'Look 03 · Sunlit Walk',
    image: '/images/streetwear-sun.jpg',
  },
];

export function HeroSection({ onOpenDemo, dynamicContent }: HeroSectionProps) {
  const looks = dynamicContent?.looks && dynamicContent.looks.length > 0
    ? dynamicContent.looks
    : DEFAULT_HERO_LOOKS;

  const [activeLookIndex, setActiveLookIndex] = React.useState(0);
  const [internalModalOpen, setInternalModalOpen] = React.useState(false);

  const handleDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
    } else {
      setInternalModalOpen(true);
    }
  };

  // Auto-cycle smoothly between background images every 7 seconds
  React.useEffect(() => {
    if (looks.length <= 1) return;
    const timer = setInterval(() => {
      setActiveLookIndex((current) => {
        const remaining = looks.map((_, i) => i).filter((i) => i !== current);
        const nextIndex = remaining[Math.floor(Math.random() * remaining.length)];
        return nextIndex;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [looks]);

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-carbon-black pt-20 sm:pt-24">
      {/* Background Images with Silky 1.4s Cross-Fade & Ken-Burns Motion */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {looks.map((look, index) => {
          const isActive = index === activeLookIndex;
          return (
            <div
              key={look.id}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={look.image}
                alt={look.label}
                fill
                priority={index === 0}
                quality={92}
                sizes="100vw"
                className="w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
          );
        })}

        {/* Balanced Luminous Scrim (§Keeps editorial photos vibrant while guaranteeing WCAG AAA text readability) */}
        {/* Layer 1: Subtle base tint */}
        <div className="absolute inset-0 z-20 bg-carbon-black/25" />

        {/* Layer 2: Directional vertical gradient - soft dark at top for transparent header, luminous center, dark at bottom */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-carbon-black/60 via-carbon-black/15 to-carbon-black/80" />

        {/* Layer 3: Central radial spotlight to guarantee typography legibility */}
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_transparent_75%)]" />
      </div>

      {/* Spacer below transparent header */}
      <div className="h-10 sm:h-16" />

      {/* Main Centered Content: Clean Typographical Layout (Zero Eyebrow Badges) */}
      <div className="relative z-30 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex w-full flex-col items-center space-y-5 sm:space-y-7"
        >
          {/* Stacked Mega Headings */}
          <h1 className="flex flex-col items-center text-center text-snow tracking-tight select-none">
            <span
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-bold leading-[1.08] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)' }}
            >
              {dynamicContent?.megaHeadingLine1 || 'Fashion Found.'}
            </span>
            <span
              className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-[1.12] text-snow/95 pt-1.5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)' }}
            >
              {dynamicContent?.megaHeadingLine2 || 'The first time shopping online feels safe.'}
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="max-w-xl mx-auto text-sm sm:text-base md:text-lg text-snow/90 leading-relaxed font-sans px-2"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95)' }}
          >
            {dynamicContent?.subHeadline ||
              'The Ve mobile app is coming soon. See how clothes look on you before you order, and pay only after you check your delivery.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link href={dynamicContent?.primaryCtaLink || '/app'}>
              <Button
                variant="primary"
                size="md"
                className="bg-snow text-carbon-black hover:bg-snow/90 shadow-elevated border border-snow font-semibold px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm"
              >
                {dynamicContent?.primaryCtaText || 'Join Waiting List'}
              </Button>
            </Link>

            <Link href={dynamicContent?.secondaryCtaLink || '/sell'}>
              <Button
                variant="outline"
                size="md"
                className="border-snow/40 text-snow bg-carbon-black/40 hover:bg-carbon-black/60 backdrop-blur-md font-semibold transition-colors px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm"
              >
                {dynamicContent?.secondaryCtaText || 'Become a Ve-ndor'}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="md"
              onClick={handleDemoClick}
              className="text-snow/90 hover:text-snow hover:bg-snow/15 backdrop-blur-sm text-xs font-semibold transition-colors px-4 py-2.5"
            >
              <Play className="h-3.5 w-3.5 text-dusty-olive-light mr-1.5" />
              See Preview
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#how-it-works"
          className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-snow/80 hover:text-snow transition-colors cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          <span>Scroll to Discover</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 animate-bounce text-dusty-olive-light" />
        </a>
      </div>

      {/* Internal Demo Modal */}
      <Modal
        isOpen={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
        title={dynamicContent?.demoVideoTitle || 'Experience Ve in Action'}
      >
        <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
          <p>
            {dynamicContent?.demoVideoDescription ||
              'Ve is built for Kampala’s vibrant fashion culture. Our mobile app combines video discovery with Try-On sizing right on your phone.'}
          </p>
          <AspectContainer ratio="video">
            <div className="absolute inset-0 bg-carbon-black flex flex-col items-center justify-center text-snow p-6 text-center">
              <Play className="h-10 w-10 text-dusty-olive mb-2" />
              <span className="text-xs font-medium">Ve Interactive Preview</span>
              <span className="text-[10px] text-neutral-400 pt-1">WebP Video Modal Player</span>
            </div>
          </AspectContainer>
          <div className="pt-2 flex justify-end">
            <Link href={dynamicContent?.primaryCtaLink || '/app'}>
              <Button variant="primary" size="md">
                {dynamicContent?.primaryCtaText || 'Join Waiting List'}
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </section>
  );
}

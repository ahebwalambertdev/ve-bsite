'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Transition,
} from 'motion/react';
import { Camera, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HowItWorksContent, HowItWorksStep } from '@/lib/cms/types';

interface HowItWorksSectionProps {
  data: HowItWorksContent;
}

// Spring physics configuration for tactile, organic bounce entrance
const BOUNCE_SPRING: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 18,
  mass: 0.9,
};

const SWIPE_SPRING: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 30,
};

// Slightly larger mobile card dimensions keeping 3:4 aspect ratio (330px width × 440px height)
const ITEM_WIDTH = 330;
const GAP = 16;
const CONTAINER_WIDTH = ITEM_WIDTH + GAP;
const DRAG_BUFFER = 35;
const VELOCITY_THRESHOLD = 400;

const STEP_IMAGES = [
  '/images/how-it-works-discover.jpeg',
  '/images/how-it-works-tryon.jpg',
  '/images/how-it-works-pay.jpg',
];

/**
 * Shared card interior with background image, layered gradient scrims, and front text overlay
 */
function StepCardContent({ step, index }: { step: HowItWorksStep; index: number }) {
  const imageSrc = step.image || STEP_IMAGES[index] || STEP_IMAGES[0];
  const isViewfinderStep = index === 1;

  return (
    <>
      {/* 1. Background Image with gentle hover scale */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-carbon-black">
        <Image
          src={imageSrc}
          alt={step.title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 360px, (max-width: 1200px) 33vw, 400px"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>

      {/* 2. Layered Scrims for Optimal Editorial Typography Contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-carbon-black/50 via-transparent to-transparent h-28 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-carbon-black/95 via-carbon-black/80 via-45% to-transparent pointer-events-none" />

      {/* Viewfinder visual accent for Step 2 (Virtual Try-on) */}
      {isViewfinderStep && (
        <div className="absolute inset-x-8 top-14 bottom-36 z-10 pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity duration-300">
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white rounded-tl-sm drop-shadow" />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white rounded-tr-sm drop-shadow" />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white rounded-bl-sm drop-shadow" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white rounded-br-sm drop-shadow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="w-5 h-5 text-snow drop-shadow" />
          </div>
        </div>
      )}

      {/* 3. Card Content Layer (Typography overlayed in front at bottom) */}
      <div className="relative z-20 flex h-full w-full flex-col justify-end p-6 sm:p-7 select-none">
        <div className="space-y-2.5">
          <h3 className="font-serif text-2xl sm:text-[28px] font-bold tracking-tight text-snow leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {step.title}
          </h3>
          <p className="text-xs sm:text-sm text-snow/90 font-sans leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
            {step.description}
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * Mobile Swipeable Card Item with 3D perspective rotation and 3:4 Aspect Ratio
 */
interface MobileSwipeCardProps {
  step: HowItWorksStep;
  index: number;
  x: ReturnType<typeof useMotionValue<number>>;
  itemCount: number;
}

function MobileSwipeCard({ step, index, x, itemCount }: MobileSwipeCardProps) {
  const nextIndex = Math.min(index + 1, itemCount - 1);
  const prevIndex = Math.max(index - 1, 0);

  const range = [
    (-100 * (index + 1) * CONTAINER_WIDTH) / 100,
    (-100 * index * CONTAINER_WIDTH) / 100,
    (-100 * (index - 1) * CONTAINER_WIDTH) / 100,
  ];
  // Subtle 12° 3D tilt while swiping
  const outputRange = [nextIndex ? 12 : 12, 0, prevIndex ? -12 : -12];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      style={{
        width: ITEM_WIDTH,
        rotateY,
        flexShrink: 0,
      }}
      transition={SWIPE_SPRING}
      className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-soft-linen/50 bg-carbon-black shadow-elevated cursor-grab active:cursor-grabbing transition-shadow active:shadow-2xl"
    >
      <StepCardContent step={step} index={index} />
    </motion.div>
  );
}

export function HowItWorksSection({ data }: HowItWorksSectionProps) {
  const steps = data?.steps || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasUserSwiped, setHasUserSwiped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically swipe to next card every 7 seconds until user manually swipes
  useEffect(() => {
    if (hasUserSwiped || steps.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % steps.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [hasUserSwiped, steps.length]);

  const handleDragStart = useCallback(() => {
    // De-activate auto-swipe immediately once user interacts
    setHasUserSwiped(true);
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setHasUserSwiped(true);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [steps.length]);

  const handleDotClick = useCallback((i: number) => {
    setHasUserSwiped(true);
    setCurrentIndex(i);
  }, []);

  const leftConstraint = -((ITEM_WIDTH + GAP) * (steps.length - 1));

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-snow border-b border-soft-linen overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center space-y-4 mb-14 sm:mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-carbon-black">
            {data.sectionTitle}
          </h2>
          <p className="text-neutral-600 text-base">
            {data.sectionSubtitle}
          </p>
        </motion.div>

        {/* DESKTOP & TABLET VIEW: 3-Column Grid of 3:4 Cards with Staggered Scroll-In Bounce */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {steps.map((step, index) => (
            <motion.div
              key={step.stepNumber || index}
              initial={{ opacity: 0, y: 60, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
              transition={{
                ...BOUNCE_SPRING,
                delay: index * 0.16,
              }}
              whileHover={{
                y: -8,
                transition: { type: 'spring', stiffness: 350, damping: 25 },
              }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-soft-linen/50 bg-carbon-black shadow-elevated transition-all duration-300 hover:shadow-2xl hover:border-dusty-olive/30"
            >
              <StepCardContent step={step} index={index} />
            </motion.div>
          ))}
        </div>

        {/* MOBILE VIEW: Tactile 3:4 Card-Swipe Carousel with Auto-Swipe and 3D Rotation */}
        <div className="block md:hidden">
          {mounted ? (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={BOUNCE_SPRING}
              className="flex flex-col items-center justify-center"
            >
              <div
                className="relative overflow-visible py-2"
                style={{ width: ITEM_WIDTH }}
              >
                <motion.div
                  className="flex touch-pan-y"
                  drag="x"
                  dragConstraints={{ left: leftConstraint, right: 0 }}
                  dragElastic={0.15}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  style={{
                    gap: GAP,
                    perspective: 1000,
                    perspectiveOrigin: `${currentIndex * ITEM_WIDTH + ITEM_WIDTH / 2}px 50%`,
                    x,
                  }}
                  animate={{ x: -(currentIndex * CONTAINER_WIDTH) }}
                  transition={SWIPE_SPRING}
                >
                  {steps.map((step, index) => (
                    <MobileSwipeCard
                      key={step.stepNumber || index}
                      step={step}
                      index={index}
                      x={x}
                      itemCount={steps.length}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Dots Pagination */}
              <div className="mt-6 flex items-center justify-center gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDotClick(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 cursor-pointer',
                      currentIndex === i
                        ? 'w-7 bg-carbon-black'
                        : 'w-2 bg-soft-linen hover:bg-neutral-400'
                    )}
                  />
                ))}
              </div>

            </motion.div>
          ) : (
            // SSR Fallback with exact 3:4 aspect ratio
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.stepNumber || index}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-soft-linen/50 bg-carbon-black shadow-elevated"
                >
                  <StepCardContent step={step} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

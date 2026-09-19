'use client';

import * as React from 'react';
import { motion } from 'motion/react';

export interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick?: () => void;
  isTransparent?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function AnimatedHamburger({
  isOpen,
  onClick,
  isTransparent = false,
  className = '',
  ariaLabel,
}: AnimatedHamburgerProps) {
  // Determine bar color
  // When transparent header and drawer is closed: white (#fffaf6 / text-snow)
  // When drawer is open or solid header: dark carbon black (#252525)
  const isWhite = isTransparent && !isOpen;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={ariaLabel || (isOpen ? 'Close navigation menu' : 'Open navigation menu')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive cursor-pointer select-none ${
        isWhite
          ? 'hover:bg-snow/15 active:bg-snow/20 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
          : 'hover:bg-soft-linen/60 active:bg-soft-linen'
      } ${className}`}
    >
      <div className="w-5 h-4 relative flex items-center justify-center pointer-events-none">
        {/* Top bar */}
        <motion.span
          animate={
            isOpen
              ? { rotate: 45, y: 0 }
              : { rotate: 0, y: -6 }
          }
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          className={`absolute h-[2px] w-5 rounded-full transition-colors duration-200 ${
            isWhite ? 'bg-snow' : 'bg-carbon-black'
          }`}
        />

        {/* Middle bar */}
        <motion.span
          animate={
            isOpen
              ? { opacity: 0, scaleX: 0, x: -4 }
              : { opacity: 1, scaleX: 1, x: 0 }
          }
          transition={{ duration: 0.16 }}
          className={`absolute h-[2px] w-5 rounded-full transition-colors duration-200 ${
            isWhite ? 'bg-snow' : 'bg-carbon-black'
          }`}
        />

        {/* Bottom bar */}
        <motion.span
          animate={
            isOpen
              ? { rotate: -45, y: 0 }
              : { rotate: 0, y: 6 }
          }
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
          className={`absolute h-[2px] w-5 rounded-full transition-colors duration-200 ${
            isWhite ? 'bg-snow' : 'bg-carbon-black'
          }`}
        />
      </div>
    </motion.button>
  );
}

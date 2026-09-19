'use client';

import * as React from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface CopyEmailButtonProps {
  email: string;
  className?: string;
  buttonClassName?: string;
  showEmailText?: boolean;
  showMailIcon?: boolean;
  variant?: 'ghost' | 'pill' | 'subtle';
  ariaLabel?: string;
}

export function CopyEmailButton({
  email,
  className,
  buttonClassName,
  showEmailText = false,
  showMailIcon = false,
  variant = 'subtle',
  ariaLabel,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email to clipboard', err);
    }
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      {showEmailText && (
        <a
          href={`mailto:${email}`}
          className="hover:underline transition-colors focus:outline-none"
          aria-label={`Send email to ${email}`}
        >
          <span className="font-mono text-inherit">
            {showMailIcon && <Mail className="inline w-3.5 h-3.5 mr-1 -mt-0.5 opacity-75" />}
            {email}
          </span>
        </a>
      )}

      <div className="relative inline-flex items-center">
        <motion.button
          type="button"
          onClick={handleCopy}
          whileTap={{ scale: 0.86 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          className={cn(
            'relative inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-dusty-olive',
            variant === 'subtle' &&
              (copied
                ? 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                : 'text-neutral-400 hover:text-snow hover:bg-neutral-800 bg-neutral-900/70 border border-neutral-700/60'),
            variant === 'pill' &&
              (copied
                ? 'text-emerald-700 bg-emerald-100/90 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                : 'text-dusty-olive-dark hover:text-carbon-black bg-soft-linen/60 hover:bg-soft-linen border border-soft-linen'),
            variant === 'ghost' &&
              (copied
                ? 'text-emerald-600 bg-emerald-50 border border-emerald-300'
                : 'text-neutral-400 hover:text-carbon-black hover:bg-neutral-100 border border-transparent'),
            buttonClassName
          )}
          title={copied ? 'Email copied!' : `Copy ${email}`}
          aria-label={ariaLabel || (copied ? `Email address ${email} copied` : `Copy email address ${email}`)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 45, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="flex items-center justify-center"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Copy className="w-3 h-3 opacity-75 group-hover:opacity-100" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Floating animated feedback badge */}
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 2, scale: 0.85 }}
              animate={{ opacity: 1, y: -22, scale: 1 }}
              exit={{ opacity: 0, y: -26, scale: 0.85 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-1 px-1.5 py-0.5 rounded text-[9px] font-semibold font-sans bg-carbon-black text-snow shadow-lg whitespace-nowrap z-40 border border-neutral-700/70"
            >
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

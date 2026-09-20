'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  X, 
  MessageCircle, 
  Sparkles, 
  Store, 
  BookOpen, 
  Users, 
  HelpCircle, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  Instagram,
  Mail,
  Check
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { CONTACT_CONFIG } from '@/lib/contact';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedHamburger } from './animated-hamburger';
import { cn } from '@/lib/utils';

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.179-.176.201-.351.226-.652.075-1.804-.903-2.983-1.605-4.17-3.64-.313-.538.313-.499.897-1.668.075-.15.038-.276-.038-.426-.075-.15-.677-1.63-.928-2.232-.244-.588-.493-.508-.677-.518-.175-.008-.376-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.511s1.079 2.913 1.229 3.114c.15.2 2.122 3.24 5.14 4.545 2.155.931 2.99.932 4.048.775.642-.096 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.201-.577-.351z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.892.524 3.664 1.434 5.178L2 22l4.982-1.408A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167a8.13 8.13 0 0 1-4.148-1.127l-.297-.176-3.08.87.877-3.003-.193-.308A8.138 8.138 0 1 1 12 20.167z" />
    </svg>
  );
}

function HelpEmailIconAction({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyOrMail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        window.location.href = `mailto:${email}`;
      }
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <motion.button
        type="button"
        onClick={handleCopyOrMail}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        title={copied ? 'Email copied email' : `Copy ${email}`}
        aria-label={copied ? 'Email address copied' : `Copy ${email}`}
        className="inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer group p-1 -m-1"
      >
        <span className="transition-colors font-medium text-neutral-500 group-hover:text-carbon-black">
          help
        </span>
        <div className={cn(
          'w-5 h-5 flex items-center justify-center rounded transition-colors',
          copied ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-carbon-black'
        )}>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-emerald-600" />
              </motion.span>
            ) : (
              <motion.span
                key="mail"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="flex items-center justify-center"
              >
                <Mail className="w-3 h-3" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Floating feedback badge */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 2, scale: 0.85 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.85 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-1 px-1.5 py-0.5 rounded text-[9px] font-semibold font-sans bg-carbon-black text-snow shadow-lg whitespace-nowrap z-50 border border-neutral-700/70"
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.96-4.52V8.92a8.28 8.28 0 0 0 4.81 1.54v-3.77z" />
    </svg>
  );
}

function XIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links?: { href: string; label: string }[];
  cta?: { text: string; href: string };
}

export function MobileDrawer({ isOpen, onClose, cta }: MobileDrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const whatsappUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Support, I am reaching out from the mobile site menu'
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with fade transition */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-carbon-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide Drawer: GPU-composited spring transition */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-[85%] max-w-sm h-full min-h-dvh bg-snow border-l border-soft-linen flex flex-col justify-between shadow-elevated overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-soft-linen">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center"
                  aria-label="Ve Home"
                >
                  <Logo className="h-6 w-auto" />
                </Link>
                <AnimatedHamburger
                  isOpen={true}
                  onClick={onClose}
                  ariaLabel="Close navigation menu"
                />
              </div>

              {/* Group 1: Marketplace & Shopping */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-dusty-olive font-semibold">
                  Marketplace
                </div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/#how-it-works"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-dusty-olive" />
                  <span>How Ve Works</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/sell"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-dusty-olive" />
                  <span>Become a Ve-ndor</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/journal"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-dusty-olive" />
                  <span>Ve Journal</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </nav>
          </div>

          {/* Group 2: Company & Trust */}
          <div className="space-y-2 pt-2 border-t border-soft-linen/50">
            <div className="text-[10px] font-mono uppercase tracking-widest text-dusty-olive font-semibold">
              Company &amp; Trust
            </div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-dusty-olive" />
                  <span>About Ve (Our Story)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/team"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-dusty-olive" />
                  <span>Our Kampala Team</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/press"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-dusty-olive" />
                  <span>Press &amp; Media Kit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </nav>
          </div>

          {/* Group 3: Support & Contact */}
          <div className="space-y-2 pt-2 border-t border-soft-linen/50">
            <div className="text-[10px] font-mono uppercase tracking-widest text-dusty-olive font-semibold">
              Support &amp; Legal
            </div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/faq"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-dusty-olive" />
                  <span>Customer FAQ</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-carbon-black hover:bg-soft-linen/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-dusty-olive" />
                  <span>Contact &amp; Escalations</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Actions & Support Strip */}
        <div className="p-6 bg-soft-linen/25 border-t border-soft-linen space-y-4">
          {/* Primary CTA Button */}
          <Link
            href={cta?.href || '/app'}
            onClick={onClose}
            className="flex items-center justify-center font-sans font-semibold text-sm rounded-lg h-10 px-4 w-full bg-carbon-black text-snow shadow-subtle hover:bg-neutral-800 active:bg-black select-none transition-all duration-160 active:scale-[0.97] cursor-pointer"
          >
            {cta?.text || 'Join Waiting List'}
          </Link>

          {/* Social Icons, WhatsApp, and Help Email on the same line */}
          <div className="pt-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-[#25D366] transition-colors"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/veapp.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-carbon-black transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@veapp.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-carbon-black transition-colors"
                aria-label="TikTok"
                title="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/veapp.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-carbon-black transition-colors"
                aria-label="X"
                title="X"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Help Email Icon with "help" before the email icon */}
            <HelpEmailIconAction email={CONTACT_CONFIG.emails.help} />
          </div>

          {/* Terms & Privacy Policy placed at the bottom */}
          <div className="pt-2 border-t border-soft-linen/60 flex flex-col items-center gap-1.5 text-xs text-neutral-500">
            <div className="flex items-center gap-3">
              <Link
                href="/legal/terms"
                onClick={onClose}
                className="hover:text-carbon-black hover:underline transition-colors"
              >
                Terms of Service
              </Link>
              <span>·</span>
              <Link
                href="/legal/privacy"
                onClick={onClose}
                className="hover:text-carbon-black hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Operating digitally across Kampala, Uganda
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>,
document.body
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Users, Phone, HelpCircle, FileText, Lock, Palette, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MoreDropdownProps {
  isTransparent?: boolean;
}

const MORE_LINKS = [
  {
    group: 'Ecosystem & Story',
    items: [
      {
        href: '/about',
        label: 'About Ve',
        description: 'Our story & mission to fix online shopping',
        icon: Users,
      },
      {
        href: '/team',
        label: 'Our Team',
        description: 'Meet the founders & operators in Kampala',
        icon: ShieldCheck,
      },
      {
        href: '/press',
        label: 'Press & Media Kit',
        description: 'Brand colors, logo assets & boilerplate',
        icon: Palette,
      },
    ],
  },
  {
    group: 'Support & Legal',
    items: [
      {
        href: '/contact',
        label: 'Contact & Escalations',
        description: 'Direct WhatsApp support & official inboxes',
        icon: Phone,
      },
      {
        href: '/faq',
        label: 'Customer FAQ',
        description: 'Protected payments, delivery & try-on',
        icon: HelpCircle,
      },
      {
        href: '/legal/terms',
        label: 'Terms of Service',
        description: 'Marketplace guarantees & conditions',
        icon: FileText,
      },
      {
        href: '/legal/privacy',
        label: 'Privacy Policy',
        description: 'DPPA 2019 data protection compliance',
        icon: Lock,
      },
    ],
  },
];

export function MoreDropdown({ isTransparent = false }: MoreDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Close on Escape or click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close when pathname changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Check if any sub-link is active
  const isAnyActive = [
    '/about',
    '/team',
    '/press',
    '/contact',
    '/faq',
    '/legal/terms',
    '/legal/privacy',
  ].some((p) => pathname === p || pathname?.startsWith(p));

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More navigation links"
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive rounded-sm select-none cursor-pointer py-1 ${
          isTransparent
            ? 'text-snow/90 hover:text-snow drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
            : isAnyActive
            ? 'text-dusty-olive-dark font-semibold'
            : 'text-neutral-700 hover:text-carbon-black'
        }`}
      >
        <span>More</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ backgroundColor: '#ffffff' }}
            className="absolute -right-10 md:right-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-[460px] max-w-[calc(100vw-2rem)] bg-white border border-[#E2DDD5] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.06)] p-4 z-50 text-carbon-black"
          >
            <div className="grid grid-cols-2 gap-4">
              {MORE_LINKS.map((section) => (
                <div key={section.group} className="space-y-2">
                  <div className="px-2 text-[11px] font-mono uppercase tracking-wider text-dusty-olive-dark font-bold">
                    {section.group}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsOpen(false)}
                          className={`group flex items-start gap-2.5 p-2 rounded-xl transition-all duration-150 ${
                            isActive
                              ? 'bg-soft-linen/70 font-semibold'
                              : 'hover:bg-[#F5F2EC]'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-soft-linen/70 flex items-center justify-center text-dusty-olive-dark group-hover:scale-105 group-hover:bg-dusty-olive group-hover:text-snow transition-all shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-carbon-black flex items-center justify-between">
                              <span className="truncate">{item.label}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-dusty-olive-dark shrink-0" />
                            </div>
                            <div className="text-[11px] text-neutral-600 line-clamp-1 leading-snug">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-footer inside dropdown */}
            <div className="mt-3 pt-3 border-t border-soft-linen flex items-center justify-between px-2 text-[11px] text-neutral-600 font-medium">
              <span>Operating across Greater Kampala</span>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-dusty-olive-dark font-semibold hover:underline flex items-center gap-1"
              >
                <span>Need Support?</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

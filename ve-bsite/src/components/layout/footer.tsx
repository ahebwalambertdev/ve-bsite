'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT_CONFIG } from '@/lib/contact';
import { Logo } from '@/components/ui/logo';
import { DEFAULT_CMS_DATA } from '@/lib/cms/defaults';
import { SocialLinkConfig, NavLinkItem, NavigationConfig } from '@/lib/cms/types';
import * as React from 'react';

import { Instagram } from 'lucide-react';
import { CopyEmailButton } from '@/components/ui/copy-email-button';

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

interface FooterProps {
  initialNav?: NavigationConfig;
}

export function Footer({ initialNav }: FooterProps = {}) {
  const pathname = usePathname();

  const [socialLinks, setSocialLinks] = React.useState<SocialLinkConfig>(
    initialNav?.socialLinks || DEFAULT_CMS_DATA.navigation?.socialLinks || {
      whatsappUrl: 'https://wa.me/256781602159',
      instagramUrl: 'https://instagram.com/veapp.store',
      tiktokUrl: 'https://tiktok.com/@veapp.store',
      twitterUrl: 'https://twitter.com/veapp.store',
      supportEmail: CONTACT_CONFIG.emails.info,
      vendorEmail: CONTACT_CONFIG.emails.support,
    }
  );

  const [footerLinks, setFooterLinks] = React.useState<NavLinkItem[]>(
    initialNav?.footerLinks || DEFAULT_CMS_DATA.navigation?.footerLinks || [
      { id: 'how-it-works', label: 'How Ve Works', href: '/#how-it-works' },
      { id: 'sell', label: 'Become a Ve-ndor', href: '/sell' },
      { id: 'app', label: 'Join Waiting List (Coming Soon)', href: '/app' },
      { id: 'about', label: 'About Ve', href: '/about' },
      { id: 'team', label: 'Our Team', href: '/team' },
      { id: 'journal', label: 'Ve Journal', href: '/journal' },
    ]
  );

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_DRAFT_UPDATE' && event.data.payload?.navigation) {
        if (event.data.payload.navigation.socialLinks) {
          setSocialLinks(event.data.payload.navigation.socialLinks);
        }
        if (event.data.payload.navigation.footerLinks) {
          setFooterLinks(event.data.payload.navigation.footerLinks);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Do not render public footer on admin management pages (allow only inside preview frame)
  if (pathname?.startsWith('/admin') && pathname !== '/admin/preview') {
    return null;
  }

  const generalEmail =
    socialLinks.supportEmail &&
    !socialLinks.supportEmail.includes('ve.ug') &&
    !socialLinks.supportEmail.includes('veapp.ug')
      ? socialLinks.supportEmail
      : CONTACT_CONFIG.emails.info;

  return (
    <footer className="w-full bg-carbon-black text-snow border-t border-neutral-800 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Manifesto Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-block hover:opacity-90 transition-opacity"
              aria-label="Ve Home"
            >
              <Logo inverted className="h-7 w-auto" />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Kampala’s fashion marketplace. Apparel, footwear, and accessories, delivered to your
              door, with protected payments and easy returns.
            </p>
            <div className="pt-1 text-xs text-neutral-500">
              Operating digitally across Kampala, Uganda. Doorstep verification &amp; rider dispatch.
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dusty-olive font-sans">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              {footerLinks.map((link) => (
                <li key={link.id || link.href}>
                  <Link href={link.href} prefetch={true} className="hover:text-snow transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dusty-olive font-sans">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/faq" prefetch={true} className="hover:text-snow transition-colors">
                  Customer FAQ
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" prefetch={true} className="hover:text-snow transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" prefetch={true} className="hover:text-snow transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/press" prefetch={true} className="hover:text-snow transition-colors">
                  Press & Media Kit
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-snow transition-colors">
                  Contact & Escalations
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Escalation Column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-dusty-olive font-sans">
              Connect With Us
            </h4>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Have a question or need instant support in Kampala?
            </p>
            <a
              href={socialLinks.whatsappUrl || CONTACT_CONFIG.getWhatsappUrl('Hi Ve Team, I have an inquiry')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-dusty-olive text-snow text-xs font-semibold hover:bg-[#6e7d66] transition-transform active:scale-95 shadow-subtle"
            >
              Chat on WhatsApp
            </a>
            <div className="pt-2 text-xs text-neutral-400 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">General</div>
                <CopyEmailButton email={generalEmail} showEmailText className="text-[11px]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">Support</div>
                <CopyEmailButton email={CONTACT_CONFIG.emails.help} showEmailText className="text-[11px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Sub-footer with Social Icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Ve Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a
              href={socialLinks.instagramUrl || 'https://www.instagram.com/veapp.store'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-snow text-neutral-400 transition-colors group"
              aria-label="Follow Ve on Instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-neutral-400 group-hover:text-snow transition-colors" />
              <span>Instagram</span>
            </a>
            <a
              href={socialLinks.tiktokUrl || 'https://www.tiktok.com/@veapp.store'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-snow text-neutral-400 transition-colors group"
              aria-label="Follow Ve on TikTok"
            >
              <TikTokIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-snow transition-colors" />
              <span>TikTok</span>
            </a>
            {socialLinks.twitterUrl && (
              <a
                href={socialLinks.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-snow text-neutral-400 transition-colors group"
                aria-label="Follow Ve on X"
              >
                <XIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-snow transition-colors" />
                <span>X</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from './mobile-drawer';
import { Logo } from '@/components/ui/logo';
import { MoreDropdown } from './more-dropdown';
import { AnimatedHamburger } from './animated-hamburger';

import { DEFAULT_CMS_DATA } from '@/lib/cms/defaults';
import { NavLinkItem, HeaderCtaConfig, NavigationConfig } from '@/lib/cms/types';

const FALLBACK_NAV_LINKS: NavLinkItem[] = [
  { id: 'how-it-works', href: '/#how-it-works', label: 'How Ve Works' },
  { id: 'sell', href: '/vendor', label: 'Become a Ve-ndor' },
  { id: 'journal', href: '/journal', label: 'Journal' },
];

interface HeaderProps {
  initialNav?: NavigationConfig;
}

export function Header({ initialNav }: HeaderProps = {}) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isHomePreview, setIsHomePreview] = React.useState(false);
  const pathname = usePathname();

  const [navLinks, setNavLinks] = React.useState<NavLinkItem[]>(
    initialNav?.headerLinks || DEFAULT_CMS_DATA.navigation?.headerLinks || FALLBACK_NAV_LINKS
  );
  const [headerCta, setHeaderCta] = React.useState<HeaderCtaConfig>(
    initialNav?.headerCta || DEFAULT_CMS_DATA.navigation?.headerCta || { text: 'Join Waiting List', href: '/app' }
  );

  // Listen for real-time live CMS draft updates in the preview frame
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CMS_DRAFT_UPDATE' && event.data.payload?.navigation) {
        const nav = event.data.payload.navigation;
        if (nav.headerLinks) setNavLinks(nav.headerLinks);
        if (nav.headerCta) setHeaderCta(nav.headerCta);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  React.useEffect(() => {
    if (pathname === '/admin/preview') {
      const params = new URLSearchParams(window.location.search);
      const route = params.get('route');
      const isHome = !route || route === '/';
      setIsHomePreview(isHome);
    } else {
      setIsHomePreview(false);
    }
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHome = pathname === '/' || isHomePreview;
  // Transparent only on homepage before scrolling past the hero
  const isTransparent = isHome && !isScrolled;

  // Do not render public navigation on admin management pages (allow only inside preview frame)
  if (pathname?.startsWith('/admin') && pathname !== '/admin/preview') {
    return null;
  }

  // Normalize destination URL so anchors from subpages route back to home
  const targetHref = React.useMemo(() => {
    const raw = headerCta.href?.trim() || '/app';
    if (raw.startsWith('#') && pathname !== '/') {
      return `/${raw}`;
    }
    return raw;
  }, [headerCta.href, pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'bg-snow/90 backdrop-blur-md border-b border-soft-linen shadow-subtle'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logomark */}
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive rounded-sm"
            aria-label="Ve Home"
          >
            <Logo
              inverted={isTransparent}
              className={`h-6 w-auto transition-colors duration-300 ${
                isTransparent ? 'drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks
              .filter((link) => !['team', 'faq', 'about', 'press', 'contact', 'legal'].includes(link.id || ''))
              .map((link) => (
                <Link
                  key={link.id || link.href}
                  href={link.href}
                  prefetch={true}
                  className={`text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive rounded-sm ${
                    isTransparent
                      ? 'text-snow/90 hover:text-snow drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
                      : 'text-neutral-700 hover:text-carbon-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            <MoreDropdown isTransparent={isTransparent} />
          </nav>

          {/* Desktop Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href={targetHref}
              className={`hidden sm:inline-flex items-center justify-center font-sans font-semibold text-xs rounded-md h-8 px-3.5 select-none transition-all duration-160 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive cursor-pointer ${
                isTransparent
                  ? 'bg-snow text-carbon-black hover:bg-snow/90 border border-snow shadow-elevated font-semibold'
                  : 'bg-carbon-black text-snow shadow-subtle hover:bg-neutral-800 active:bg-black'
              }`}
            >
              {headerCta.text || 'Join Waiting List'}
            </Link>

            {/* Mobile Menu Animated Hamburger */}
            <div className="md:hidden -mr-1.5">
              <AnimatedHamburger
                isOpen={isDrawerOpen}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                isTransparent={isTransparent}
                ariaLabel={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for non-homepage views so content is not covered by fixed header */}
      {!isHome && <div className="h-16 w-full shrink-0" />}

      {/* Mobile Menu Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        links={navLinks}
        cta={headerCta}
      />
    </>
  );
}

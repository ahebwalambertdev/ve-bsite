'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  BarChart3, 
  BookOpen, 
  Sliders, 
  LogOut,
  ExternalLink 
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Waitlist Leads', icon: Users },
  { href: '/admin/vendors', label: 'Vendor Applications', icon: Store },
  { href: '/admin/analytics', label: 'Survey Analytics', icon: BarChart3 },
  { href: '/admin/journal', label: 'Journal Posts', icon: BookOpen },
  { href: '/admin/studio', label: 'Visual Studio', icon: Sliders },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <header className="border-b border-soft-linen bg-snow/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Section Indicator */}
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/dashboard" 
              className="font-serif text-lg font-bold text-carbon-black tracking-tight flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-dusty-olive inline-block" />
              Ve Admin
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-carbon-black text-snow shadow-xs'
                        : 'text-neutral-600 hover:text-carbon-black hover:bg-soft-linen/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Tools: View Live Site & Logout */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-carbon-black transition-colors px-2 py-1 rounded"
              title="Open public website in new tab"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Nav */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-soft-linen/50 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-colors ${
                  isActive
                    ? 'bg-carbon-black text-snow'
                    : 'text-neutral-600 hover:text-carbon-black bg-snow'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

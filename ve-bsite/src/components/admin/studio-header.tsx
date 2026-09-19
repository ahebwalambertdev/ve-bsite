'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  Monitor,
  Tablet,
  Smartphone,
  UploadCloud,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface StudioHeaderProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  hasUnsavedChanges: boolean;
  isPublishing: boolean;
  onPublish: () => void;
  onDiscard: () => void;
  lastPublishedTime?: string;
}

export interface StudioRoute {
  path: string;
  label: string;
  group: 'Ecosystem' | 'Support & Legal';
}

export const STUDIO_ROUTES: StudioRoute[] = [
  { path: '/', label: 'Homepage', group: 'Ecosystem' },
  { path: '/app', label: 'App / Waitlist', group: 'Ecosystem' },
  { path: '/sell', label: 'Become a Ve-ndor', group: 'Ecosystem' },
  { path: '/about', label: 'About Ve', group: 'Ecosystem' },
  { path: '/team', label: 'Team', group: 'Ecosystem' },
  { path: '/journal', label: 'Ve Journal', group: 'Ecosystem' },
  { path: '/faq', label: 'Support & FAQ', group: 'Support & Legal' },
  { path: '/contact', label: 'Contact & Escalations', group: 'Support & Legal' },
  { path: '/press', label: 'Press & Media Kit', group: 'Support & Legal' },
  { path: '/legal/terms', label: 'Terms of Service', group: 'Support & Legal' },
  { path: '/legal/privacy', label: 'Privacy Policy', group: 'Support & Legal' },
];

export function StudioHeader({
  currentRoute,
  onRouteChange,
  viewportMode,
  onViewportChange,
  hasUnsavedChanges,
  isPublishing,
  onPublish,
  onDiscard,
  lastPublishedTime,
}: StudioHeaderProps) {
  const normalizedRoute = currentRoute.split('?')[0].split('#')[0] || '/';

  return (
    <header className="h-16 w-full border-b border-soft-linen bg-snow px-4 sm:px-6 flex items-center justify-between gap-4 select-none z-30 shrink-0">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center" title="Exit Studio to ve.ug">
          <Logo className="h-5 w-auto" />
        </Link>
        <div className="h-5 w-px bg-soft-linen" />
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold text-carbon-black">
            Visual CMS Studio
          </span>
        </div>
      </div>

      {/* Center: Route Switcher & Device Toggles */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Screen Selector Dropdown + Quick Pills */}
        <div className="flex items-center gap-2">
          {/* Grouped Select Picker for All 11 Screens */}
          <div className="relative flex items-center">
            <select
              value={normalizedRoute}
              onChange={(e) => onRouteChange(e.target.value)}
              className="bg-soft-linen/50 text-carbon-black border border-soft-linen rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-dusty-olive cursor-pointer hover:bg-soft-linen/70 transition-colors pr-7 appearance-none"
              title="Select any website screen to edit and preview"
            >
              <optgroup label="Ecosystem Screens">
                {STUDIO_ROUTES.filter((r) => r.group === 'Ecosystem').map((r) => (
                  <option key={r.path} value={r.path}>
                    {r.label} ({r.path})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Support & Legal Screens">
                {STUDIO_ROUTES.filter((r) => r.group === 'Support & Legal').map((r) => (
                  <option key={r.path} value={r.path}>
                    {r.label} ({r.path})
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-carbon-black/50 text-[10px]">
              ▼
            </div>
          </div>

          {/* Quick primary route pills on wider screens */}
          <div className="hidden xl:flex items-center gap-1 p-1 bg-soft-linen/50 rounded-lg border border-soft-linen">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/faq', label: 'FAQ' },
              { path: '/contact', label: 'Contact' },
              { path: '/legal/terms', label: 'Terms' },
            ].map((r) => (
              <button
                key={r.path}
                type="button"
                onClick={() => onRouteChange(r.path)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  normalizedRoute === r.path
                    ? 'bg-snow text-carbon-black shadow-xs font-semibold'
                    : 'text-carbon-black/60 hover:text-carbon-black'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Device Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-soft-linen/50 rounded-lg border border-soft-linen">
          <button
            type="button"
            onClick={() => onViewportChange('desktop')}
            title="Desktop Viewport (100%)"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${viewportMode === 'desktop'
                ? 'bg-snow text-dusty-olive-dark shadow-sm'
                : 'text-carbon-black/50 hover:text-carbon-black'
              }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewportChange('tablet')}
            title="Tablet Viewport (768px)"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${viewportMode === 'tablet'
                ? 'bg-snow text-dusty-olive-dark shadow-sm'
                : 'text-carbon-black/50 hover:text-carbon-black'
              }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewportChange('mobile')}
            title="Mobile Viewport (390px)"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${viewportMode === 'mobile'
                ? 'bg-snow text-dusty-olive-dark shadow-sm'
                : 'text-carbon-black/50 hover:text-carbon-black'
              }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Actions: Draft Status & Publish */}
      <div className="flex items-center gap-3">
        {hasUnsavedChanges ? (
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unpublished draft
            </span>
            <button
              type="button"
              onClick={onDiscard}
              className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Discard
            </button>
          </div>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-dusty-olive" />
            Synced
          </span>
        )}

        <Button
          variant="primary"
          size="sm"
          disabled={isPublishing || !hasUnsavedChanges}
          onClick={onPublish}
          className="font-semibold shadow-elevated"
        >
          <UploadCloud className="w-4 h-4 mr-1.5" />
          {isPublishing ? 'Publishing...' : 'Publish to Live'}
        </Button>

        <a
          href={currentRoute}
          target="_blank"
          rel="noopener noreferrer"
          title="Open live site in new tab"
          className="p-2 text-neutral-500 hover:text-carbon-black rounded-md hover:bg-soft-linen/50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        <div className="h-5 w-px bg-soft-linen" />

        <button
          type="button"
          onClick={async () => {
            try {
              await fetch('/api/admin/logout', { method: 'POST' });
              window.location.href = '/admin/login';
            } catch {
              window.location.href = '/admin/login';
            }
          }}
          title="Sign out of Studio"
          className="p-2 text-neutral-400 hover:text-red-600 rounded-md hover:bg-soft-linen/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

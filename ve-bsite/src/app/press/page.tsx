import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { getCmsData } from '@/lib/cms/cms-service';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Press & Media Kit — Ve Brand Assets & Boilerplate',
  description:
    'Official brand assets, logo downloads, color palette codes, and company boilerplate for press and media partners covering Ve in Uganda.',
  openGraph: {
    title: 'Ve Press & Media Kit',
    description: 'Official logos, brand colors, and company overview.',
    url: 'https://veapp.store/press',
  },
};

export default async function PressPage() {
  const cmsData = await getCmsData();
  const press = cmsData.press;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        {press.badge && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-dusty-olive-dark bg-dusty-olive/10 px-3 py-1 rounded-full">
            {press.badge}
          </span>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
          {press.title}
        </h1>
        <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
          {press.description}
        </p>
      </div>

      {/* Company Boilerplate */}
      <section className="space-y-4 pt-6 border-t border-soft-linen">
        <h2 className="font-serif text-2xl font-semibold text-carbon-black">
          {press.boilerplateTitle || 'Company Boilerplate'}
        </h2>
        <Card className="p-6 bg-snow border-soft-linen space-y-3 text-sm text-carbon-black/85 leading-relaxed">
          <p>
            <strong>About Ve:</strong> {press.boilerplateText}
          </p>
        </Card>
      </section>

      {/* Color Palette Tokens */}
      <section className="space-y-6 pt-6 border-t border-soft-linen">
        <h2 className="font-serif text-2xl font-semibold text-carbon-black">
          {press.paletteTitle || 'Official Color Palette'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(press.palette || []).map((color) => (
            <div
              key={color.name}
              className="p-4 rounded-xl border border-soft-linen space-y-3 bg-snow"
            >
              <div
                className="w-full h-14 rounded-lg border border-carbon-black/10 shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <div className="font-semibold text-xs text-carbon-black">{color.name}</div>
                <div className="text-[11px] font-mono text-carbon-black/60">{color.hex}</div>
                <div className="text-[10px] text-carbon-black/50 mt-1">{color.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Assets & Logo Marks */}
      <section className="space-y-6 pt-6 border-t border-soft-linen">
        <h2 className="font-serif text-2xl font-semibold text-carbon-black">
          Brand Marks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-6 bg-snow border-soft-linen space-y-4">
            <div className="h-24 bg-snow rounded-xl border border-soft-linen flex items-center justify-center">
              <Logo className="h-10 w-auto" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-carbon-black">Primary Wordmark (Dark on Snow)</span>
              <a
                href="/icons/ve-logo-dark.svg"
                download="ve-logo-dark.svg"
                className="text-dusty-olive-dark hover:underline font-mono flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                SVG Download
              </a>
            </div>
          </Card>

          <Card className="p-6 bg-carbon-black text-snow border-carbon-black space-y-4">
            <div className="h-24 bg-carbon-black rounded-xl border border-carbon-black/40 flex items-center justify-center">
              <Logo inverted className="h-10 w-auto" />
            </div>
            <div className="flex items-center justify-between text-xs text-snow/80">
              <span className="font-medium text-snow">Inverted Wordmark (Snow on Carbon)</span>
              <a
                href="/icons/ve-logo-light.svg"
                download="ve-logo-light.svg"
                className="text-dusty-olive-light hover:underline font-mono flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                SVG Download
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Media Contact Card */}
      <section className="p-6 bg-soft-linen/30 border border-soft-linen rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-carbon-black">Media & Interview Inquiries</h3>
          <p className="text-xs text-carbon-black/65">
            For founder interviews, high-resolution imagery, or commentary on Ugandan social commerce:
          </p>
        </div>
        <a href={`mailto:${press.inquiriesEmail || 'info@veapp.store'}`}>
          <Button variant="primary" size="md">
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Email Press
          </Button>
        </a>
      </section>
    </div>
  );
}

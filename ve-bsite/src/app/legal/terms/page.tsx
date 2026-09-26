import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { getCmsData } from '@/lib/cms/cms-service';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Terms of Service — Ve Fashion Marketplace',
  description:
    'Official Terms of Service governing buyers, merchants, delivery couriers, payment protections, and platform usage in Uganda.',
  openGraph: {
    title: 'Ve Terms of Service',
    description: 'Buyer and merchant agreements, payment protection terms, and delivery liability.',
    url: 'https://www.veapp.store/legal/terms',
  },
  alternates: {
    canonical: '/legal/terms',
  },
};

export default async function TermsPage() {
  const cmsData = await getCmsData();
  const terms = cmsData.legalTerms;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky TOC Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24 self-start">
          <div className="p-6 bg-snow border border-soft-linen rounded-2xl shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
              <FileText className="w-4 h-4 text-dusty-olive" />
              <span>Table of Contents</span>
            </div>

            <nav className="space-y-2 text-xs text-carbon-black/75">
              {(terms.sections || []).map((section, idx) => (
                <a
                  key={section.id || idx}
                  href={`#${section.id}`}
                  className="block hover:text-dusty-olive-dark transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-soft-linen text-[11px] text-carbon-black/50">
              Related Document:{' '}
              <Link href="/legal/privacy" className="text-dusty-olive-dark font-medium underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </aside>

        {/* Legal Text Content */}
        <main className="lg:col-span-8 space-y-12">
          <header className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center text-xs font-medium text-carbon-black/60 hover:text-carbon-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Home
            </Link>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight">
                {terms.title}
              </h1>
              <p className="text-xs text-carbon-black/60 font-mono">
                Effective Date: {terms.effectiveDate} · Version {terms.version} · Governing Jurisdiction: {terms.jurisdiction}
              </p>
            </div>
          </header>

          <article className="space-y-10 text-sm leading-relaxed text-carbon-black/85">
            {(terms.sections || []).map((section, idx) => (
              <section
                key={section.id || idx}
                id={section.id}
                className="space-y-3 pt-6 border-t border-soft-linen scroll-mt-24"
              >
                <h2 className="font-serif text-xl font-semibold text-carbon-black">
                  {section.title}
                </h2>
                {(section.paragraphs || []).map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
        </main>
      </div>
    </div>
  );
}

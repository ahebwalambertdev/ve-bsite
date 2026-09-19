import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJournalArticles, getJournalArticleBySlug } from '@/lib/journal-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

export const revalidate = 86400; // Daily ISR

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getJournalArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found — Ve Journal' };
  }

  return {
    title: `${article.title} — Ve Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://veapp.store/journal/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Schema.org Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: 'Ve Editorial Desk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ve Technologies Ltd',
      logo: {
        '@type': 'ImageObject',
        url: 'https://veapp.store/icons/ve-logo-dark.svg',
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: `https://veapp.store/journal/${article.slug}`,
  };

  const shareText = encodeURIComponent(`Read on Ve Journal: "${article.title}"`);
  const whatsappShareUrl = `https://wa.me/?text=${shareText}%20https://veapp.store/journal/${article.slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/journal"
          className="inline-flex items-center text-xs font-medium text-carbon-black/60 hover:text-carbon-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Journal
        </Link>

        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-medium text-dusty-olive-dark hover:underline"
        >
          <Share2 className="w-3.5 h-3.5 mr-1" />
          Share on WhatsApp
        </a>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-[1.15]">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-carbon-black/65 pt-2">
          <span className="flex items-center gap-1 font-medium">
            <User className="w-3.5 h-3.5 text-dusty-olive" />
            {article.author}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-dusty-olive" />
            {article.readTime}
          </span>
          <span>·</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString('en-UG', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* Executive TL;DR Callout (AEO Inverted Pyramid §9.4) */}
      <div className="p-6 rounded-2xl bg-soft-linen/35 border-l-4 border-dusty-olive text-carbon-black space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-dusty-olive-dark flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Executive Key Takeaway (TL;DR)
        </div>
        <p className="text-sm font-medium leading-relaxed">
          {article.tldr}
        </p>
      </div>

      {/* Article Sections */}
      <article className="space-y-12 text-carbon-black/85 leading-relaxed">
        {article.content.map((sec, idx) => (
          <section key={idx} className="space-y-6 pt-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-carbon-black">
              {sec.sectionHeading}
            </h2>

            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-base text-carbon-black/80 leading-relaxed">
                {p}
              </p>
            ))}

            {/* Markdown Table if present */}
            {sec.table && (
              <div className="overflow-x-auto my-6 rounded-xl border border-soft-linen shadow-subtle">
                <table className="w-full text-left text-xs border-collapse bg-snow">
                  <thead>
                    <tr className="bg-soft-linen/40 border-b border-soft-linen">
                      {sec.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="py-3 px-4 font-semibold text-carbon-black">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.table.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`border-b border-soft-linen/50 ${
                          rIdx % 2 === 1 ? 'bg-soft-linen/15' : ''
                        }`}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-3 px-4 text-carbon-black/75">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Step Sequence if present */}
            {sec.steps && (
              <ol className="space-y-3 pl-2 my-4">
                {sec.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3 text-sm text-carbon-black/80">
                    <span className="w-6 h-6 rounded-full bg-soft-linen text-carbon-black font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {/* Callout if present */}
            {sec.callout && (
              <div className="p-4 bg-soft-linen/25 rounded-xl border border-soft-linen text-xs space-y-1">
                <div className="font-semibold text-carbon-black">{sec.callout.title}</div>
                <p className="text-carbon-black/70">{sec.callout.body}</p>
              </div>
            )}
          </section>
        ))}
      </article>

      {/* In-Article Conversion Handoff */}
      <footer className="pt-12 border-t border-soft-linen">
        <Card className="p-8 bg-carbon-black text-snow rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-semibold">
              Experience the future of fashion in Kampala
            </h3>
            <p className="text-xs sm:text-sm text-snow/75 max-w-md">
              The Ve mobile app is coming soon to iOS &amp; Android. Join the waiting list for early access and Try-On previews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/app">
              <Button variant="accent" size="md">
                Join Waiting List
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="outline" size="md" className="border-neutral-700 bg-transparent text-snow hover:bg-neutral-800">
                Become a Ve-ndor
              </Button>
            </Link>
          </div>
        </Card>
      </footer>
    </div>
  );
}

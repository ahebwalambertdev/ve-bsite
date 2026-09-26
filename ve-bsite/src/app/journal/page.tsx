import type { Metadata } from 'next';
import Link from 'next/link';
import { getJournalArticles } from '@/lib/journal-data';
import { getCmsData } from '@/lib/cms/cms-service';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Ve Journal — Kampala Fashion, Sizing Science & Boutique Culture',
  description:
    'Editorial insights, sizing guides, delivery logistics, and behind-the-scenes profiles of Kampala independent designers and boutiques.',
  openGraph: {
    title: 'The Ve Journal — Fashion Culture & Sizing in Kampala',
    description: 'Boutique spotlights, fit guides, and Ugandan street fashion culture.',
    url: 'https://www.veapp.store/journal',
  },
};

interface JournalPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const { page, category } = await searchParams;
  const [articles, cmsData] = await Promise.all([
    getJournalArticles(),
    getCmsData(),
  ]);

  const journal = cmsData.journal;

  const filteredArticles = category
    ? articles.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()))
    : articles;

  const categories = ['All', ...(journal.categories || []).filter((c) => c !== 'All')];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
          {journal.title}
        </h1>
        <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
          {journal.description}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-soft-linen pb-6">
        {categories.map((cat) => {
          const isSelected = (!category && cat === 'All') || category === cat;
          const href = cat === 'All' ? '/journal' : `/journal?category=${encodeURIComponent(cat)}`;
          return (
            <Link key={cat} href={href}>
              <Badge
                variant={isSelected ? 'olive' : 'neutral'}
                className="cursor-pointer transition-all hover:border-dusty-olive"
              >
                {cat}
              </Badge>
            </Link>
          );
        })}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/journal/${article.slug}`}
            className="group flex flex-col justify-between"
          >
            <Card className="h-full bg-snow border-soft-linen group-hover:border-dusty-olive transition-all flex flex-col justify-between p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-carbon-black/60 font-medium">
                  <Clock className="w-3.5 h-3.5 text-dusty-olive" />
                  <span>{article.readTime}</span>
                  <span>·</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h2 className="font-serif text-xl font-semibold text-carbon-black group-hover:text-dusty-olive-dark transition-colors leading-snug">
                  {article.title}
                </h2>

                <p className="text-xs text-carbon-black/70 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-soft-linen flex items-center justify-between text-xs font-semibold text-dusty-olive-dark">
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

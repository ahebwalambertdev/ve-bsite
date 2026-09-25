import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminNav } from '@/components/admin/admin-nav';
import { JournalEditor } from '@/components/admin/journal-editor';
import { getServiceSupabase } from '@/lib/supabase';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';

export const metadata: Metadata = {
  title: 'Edit Journal Article — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default async function EditJournalArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getServiceSupabase();

  let initialPost = null;

  if (id.startsWith('static-')) {
    const idx = parseInt(id.replace('static-', ''), 10) - 1;
    const article = JOURNAL_ARTICLES[idx];
    if (article) {
      initialPost = {
        id,
        title: article.title,
        slug: article.slug,
        body: article.content.map(c => `## ${c.sectionHeading}\n\n${c.paragraphs.join('\n\n')}`).join('\n\n'),
        excerpt: article.excerpt,
        author: article.author,
        cover_image_url: article.coverImage,
        category: article.category,
        read_time_minutes: parseInt(article.readTime, 10) || 4,
        is_published: true,
      };
    }
  } else {
    const { data } = await supabase
      .from('journal_posts')
      .select('*')
      .eq('id', id)
      .single();

    initialPost = data;
  }

  if (!initialPost) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            Edit Journal Article
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Update content, tags, author details, or publication status.
          </p>
        </div>

        <JournalEditor initialPost={initialPost} postId={id} />
      </main>
    </div>
  );
}

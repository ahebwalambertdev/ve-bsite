import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizeText } from '@/lib/sanitize';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('journal_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // If table doesn't have custom posts yet, return baseline from journal-data mapped to post format
      const fallbackPosts = JOURNAL_ARTICLES.map((article, idx) => ({
        id: `static-${idx + 1}`,
        title: article.title,
        slug: article.slug,
        body: article.content.map(c => `## ${c.sectionHeading}\n\n${c.paragraphs.join('\n\n')}`).join('\n\n'),
        excerpt: article.excerpt,
        author: article.author,
        cover_image_url: article.coverImage,
        category: article.category,
        read_time_minutes: parseInt(article.readTime, 10) || 4,
        is_published: true,
        published_at: article.publishedAt,
        created_at: new Date(article.publishedAt).toISOString(),
        updated_at: new Date(article.publishedAt).toISOString(),
      }));

      return NextResponse.json({ success: true, data: data && data.length > 0 ? data : fallbackPosts });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_journal_get] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not fetch journal posts.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = sanitizeText(body.title, 200);
    let slug = sanitizeText(body.slug, 120).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const bodyText = typeof body.body === 'string' ? body.body : '';
    const excerpt = sanitizeText(body.excerpt, 300);
    const author = sanitizeText(body.author, 100) || 'Ve Editorial Team';
    const coverImageUrl = sanitizeText(body.cover_image_url || body.coverImageUrl, 500);
    const category = sanitizeText(body.category, 60) || 'Ecosystem';
    const readTimeMinutes = Math.max(1, parseInt(body.read_time_minutes || body.readTimeMinutes || '4', 10));
    const isPublished = Boolean(body.is_published ?? body.isPublished);

    if (!title || !bodyText) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required.' },
        { status: 400 }
      );
    }

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`;
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('journal_posts')
      .insert({
        title,
        slug,
        body: bodyText,
        excerpt: excerpt || null,
        author,
        cover_image_url: coverImageUrl || null,
        category,
        read_time_minutes: readTimeMinutes,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .select('*')
      .single();

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_journal_create] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to create journal post.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Journal article created successfully.',
      data,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_journal_post_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizeText } from '@/lib/sanitize';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    // Check if it's a static fallback id
    if (id.startsWith('static-')) {
      const idx = parseInt(id.replace('static-', ''), 10) - 1;
      const article = JOURNAL_ARTICLES[idx];
      if (article) {
        return NextResponse.json({
          success: true,
          data: {
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
            published_at: article.publishedAt,
            created_at: new Date(article.publishedAt).toISOString(),
            updated_at: new Date(article.publishedAt).toISOString(),
          },
        });
      }
    }

    const { data, error } = await supabase
      .from('journal_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Article not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_journal_get_single] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not fetch article.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const title = sanitizeText(body.title, 200);
    const slug = sanitizeText(body.slug, 120).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const bodyText = typeof body.body === 'string' ? body.body : '';
    const excerpt = sanitizeText(body.excerpt, 300);
    const author = sanitizeText(body.author, 100);
    const coverImageUrl = sanitizeText(body.cover_image_url || body.coverImageUrl, 500);
    const category = sanitizeText(body.category, 60);
    const readTimeMinutes = parseInt(body.read_time_minutes || body.readTimeMinutes || '4', 10);
    const isPublished = Boolean(body.is_published ?? body.isPublished);

    const supabase = getServiceSupabase();
    const updatePayload: Record<string, unknown> = {
      title,
      slug,
      body: bodyText,
      excerpt: excerpt || null,
      author: author || 'Ve Editorial Team',
      cover_image_url: coverImageUrl || null,
      category: category || 'Ecosystem',
      read_time_minutes: readTimeMinutes || 4,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    if (isPublished) {
      updatePayload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('journal_posts')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_journal_update] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to update article.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully.',
      data,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_journal_put_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('journal_posts')
      .delete()
      .eq('id', id);

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_journal_delete] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to delete article.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_journal_delete_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

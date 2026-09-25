import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '25', 10), 5), 100);
    const cursor = searchParams.get('cursor'); // created_at ISO string
    const platform = searchParams.get('platform');
    const role = searchParams.get('role');
    const search = searchParams.get('search')?.trim();

    const supabase = getServiceSupabase();

    // 1. Get total exact count
    let countQuery = supabase
      .from('waitlist_leads')
      .select('*', { count: 'exact', head: true });

    if (platform && platform !== 'all') {
      countQuery = countQuery.eq('platform', platform);
    }
    if (role && role !== 'all') {
      countQuery = countQuery.eq('role', role);
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,contact.ilike.%${search}%`);
    }

    const { count: totalCount } = await countQuery;

    // 2. Fetch paginated data using cursor (created_at)
    let dataQuery = supabase
      .from('waitlist_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      dataQuery = dataQuery.lt('created_at', cursor);
    }
    if (platform && platform !== 'all') {
      dataQuery = dataQuery.eq('platform', platform);
    }
    if (role && role !== 'all') {
      dataQuery = dataQuery.eq('role', role);
    }
    if (search) {
      dataQuery = dataQuery.or(`name.ilike.%${search}%,contact.ilike.%${search}%`);
    }

    const { data, error } = await dataQuery;

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_leads] Error ${errorId}:`, error.message);
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        nextCursor: null,
      });
    }

    const items = data || [];
    const hasMore = items.length > limit;
    const leads = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? leads[leads.length - 1]?.created_at : null;

    return NextResponse.json({
      success: true,
      data: leads,
      total: totalCount || 0,
      nextCursor,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_leads_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not fetch leads.' },
      { status: 500 }
    );
  }
}

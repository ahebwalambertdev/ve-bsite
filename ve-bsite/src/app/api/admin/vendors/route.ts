import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '25', 10), 5), 100);
    const cursor = searchParams.get('cursor');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const supabase = getServiceSupabase();

    // 1. Total exact count query
    let countQuery = supabase
      .from('vendor_applications')
      .select('*', { count: 'exact', head: true });

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }
    if (search) {
      countQuery = countQuery.or(
        `boutique_name.ilike.%${search}%,owner_name.ilike.%${search}%,whatsapp.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    const { count: totalCount } = await countQuery;

    // 2. Data query with cursor pagination
    let dataQuery = supabase
      .from('vendor_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      dataQuery = dataQuery.lt('created_at', cursor);
    }
    if (status && status !== 'all') {
      dataQuery = dataQuery.eq('status', status);
    }
    if (search) {
      dataQuery = dataQuery.or(
        `boutique_name.ilike.%${search}%,owner_name.ilike.%${search}%,whatsapp.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    const { data, error } = await dataQuery;

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_vendors] Error ${errorId}:`, error.message);
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        nextCursor: null,
      });
    }

    const items = data || [];
    const hasMore = items.length > limit;
    const vendors = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? vendors[vendors.length - 1]?.created_at : null;

    return NextResponse.json({
      success: true,
      data: vendors,
      total: totalCount || 0,
      nextCursor,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_vendors_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not fetch vendor applications.' },
      { status: 500 }
    );
  }
}

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

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get('id');

    let idsToDelete: string[] = [];
    if (queryId) {
      idsToDelete = [queryId];
    } else {
      const body = await req.json().catch(() => ({}));
      if (Array.isArray(body.ids)) {
        idsToDelete = body.ids.filter(Boolean);
      } else if (body.id) {
        idsToDelete = [body.id];
      }
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid lead ID(s) provided for deletion.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('waitlist_leads')
      .delete()
      .in('id', idsToDelete);

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_leads_delete] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to delete waitlist lead(s).' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: idsToDelete.length,
      deletedIds: idsToDelete,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_leads_delete_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not process delete request.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json().catch(() => ({}));
    const { id, ids, fieldsToClear, updates } = body;

    const targetIds: string[] = Array.isArray(ids)
      ? ids.filter(Boolean)
      : id
      ? [id]
      : [];

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No lead ID(s) specified for update.' },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {};

    // 1. Clear designated fields to null
    if (Array.isArray(fieldsToClear)) {
      const clearableFields = ['name', 'platform', 'role', 'referral_code'];
      for (const field of fieldsToClear) {
        if (clearableFields.includes(field)) {
          payload[field] = null;
        }
      }
    }

    // 2. Apply explicit updates
    if (updates && typeof updates === 'object') {
      const allowedFields = ['name', 'contact', 'platform', 'role', 'referral_code'];
      for (const [key, val] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          payload[key] = val === '' ? null : val;
        }
      }
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields provided to clear or update.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('waitlist_leads')
      .update(payload)
      .in('id', targetIds)
      .select('*');

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_leads_patch] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to update waitlist lead fields.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: targetIds.length,
      data,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_leads_patch_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not process update request.' },
      { status: 500 }
    );
  }
}

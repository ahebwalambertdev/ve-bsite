import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizeText } from '@/lib/sanitize';
import { VendorStatus } from '@/lib/types/database';

const VALID_STATUSES: VendorStatus[] = ['new', 'reviewing', 'approved', 'rejected'];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const status = body.status as VendorStatus;
    const notes = sanitizeText(body.notes, 500);

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vendor application status' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (body.notes !== undefined) {
      updatePayload.notes = notes || null;
    }

    const { error } = await supabase
      .from('vendor_applications')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[admin_vendor_status_update] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to update application status.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}.`,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_vendor_status_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizePhone, sanitizeText } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const boutiqueName = sanitizeText(body.boutiqueName || body.boutique_name, 120);
    const ownerName = sanitizeText(body.ownerName || body.owner_name, 100);
    const whatsapp = sanitizePhone(body.whatsapp);
    const location = sanitizeText(body.location, 100);
    const category = sanitizeText(body.category, 60);
    const socialHandle = sanitizeText(body.socialHandle || body.social_handle, 80);
    const stockSize = sanitizeText(body.stockSize || body.stock_size, 60);

    if (!boutiqueName || !whatsapp || !ownerName) {
      return NextResponse.json(
        { success: false, error: 'Boutique name, owner name, and WhatsApp number are required.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('vendor_applications')
      .insert({
        boutique_name: boutiqueName,
        owner_name: ownerName,
        whatsapp,
        location: location || null,
        category: category || null,
        social_handle: socialHandle || null,
        stock_size: stockSize || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[vendor_applications] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to record boutique application. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Boutique application received successfully.',
      id: data?.id,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[vendor_applications_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

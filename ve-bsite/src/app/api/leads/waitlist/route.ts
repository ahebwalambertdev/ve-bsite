import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizeContact, sanitizeText } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contact = sanitizeContact(body.contact);
    const name = sanitizeText(body.name, 100);
    const platform = sanitizeText(body.platform, 30);
    const role = sanitizeText(body.role, 30);
    const referralCode = sanitizeText(body.ref || body.referral_code, 50);

    if (!contact || contact.length < 3) {
      return NextResponse.json(
        { success: false, error: 'A valid email or phone number is required.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('waitlist_leads')
      .insert({
        name: name || null,
        contact,
        platform: platform || null,
        role: role || null,
        referral_code: referralCode || null,
      })
      .select('id')
      .single();

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[waitlist_leads] Error ${errorId}:`, error.message);
      // Return safe message without exposing Postgres error details
      return NextResponse.json(
        { success: false, error: 'Unable to save waitlist reservation. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully reserved your early access spot.',
      id: data?.id,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[waitlist_leads_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

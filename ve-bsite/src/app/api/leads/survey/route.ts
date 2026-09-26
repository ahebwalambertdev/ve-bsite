import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizeContact, sanitizeText } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contact = sanitizeContact(body.contact);
    const shoppingHabits = Array.isArray(body.shoppingHabits)
      ? body.shoppingHabits.map((item: unknown) => sanitizeText(item, 50)).filter(Boolean)
      : [];
    const currentPainpoints = Array.isArray(body.currentPainpoints)
      ? body.currentPainpoints.map((item: unknown) => sanitizeText(item, 80)).filter(Boolean)
      : [];
    const onlineFrustration = sanitizeText(body.onlineFrustration, 150);
    const styleCategories = Array.isArray(body.styleCategories)
      ? body.styleCategories.map((item: unknown) => sanitizeText(item, 50)).filter(Boolean)
      : [];
    const tryOnExcitement = sanitizeText(body.tryOnExcitement || body.veExcitement, 100);
    const veExcitement = sanitizeText(body.veExcitement || body.tryOnExcitement, 100);
    const deliveryArea = sanitizeText(body.deliveryArea, 100);
    const recommendedVendor = sanitizeText(body.recommendedVendor, 200);

    const supabase = getServiceSupabase();

    // 1. Try inserting with extended schema
    const payload: Record<string, unknown> = {
      contact: contact || null,
      shopping_habits: shoppingHabits,
      current_painpoints: currentPainpoints,
      online_frustration: onlineFrustration || null,
      style_categories: styleCategories,
      try_on_excitement: tryOnExcitement || null,
      ve_excitement: veExcitement || null,
      delivery_area: deliveryArea || null,
      recommended_vendor: recommendedVendor || null,
    };

    let { data, error } = await supabase
      .from('customer_surveys')
      .insert(payload)
      .select('id')
      .single();

    // 2. Graceful fallback if new columns don't exist yet on Supabase table
    if (error && (error.message.includes('column') || error.code === 'PGRST204')) {
      const fallbackPayload: Record<string, unknown> = {
        contact: contact || null,
        shopping_habits: shoppingHabits,
        online_frustration: [
          currentPainpoints.length ? `In-person: ${currentPainpoints.join(', ')}` : null,
          onlineFrustration ? `Online: ${onlineFrustration}` : null,
          recommendedVendor ? `Recommended: ${recommendedVendor}` : null,
        ]
          .filter(Boolean)
          .join(' | ') || null,
        style_categories: styleCategories,
        try_on_excitement: tryOnExcitement || null,
        delivery_area: deliveryArea || null,
      };

      const fallbackRes = await supabase
        .from('customer_surveys')
        .insert(fallbackPayload)
        .select('id')
        .single();

      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[customer_surveys] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Could not record survey preferences.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Survey preferences saved.',
      id: data?.id,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[customer_surveys_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

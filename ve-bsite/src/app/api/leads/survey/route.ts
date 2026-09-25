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
    const onlineFrustration = sanitizeText(body.onlineFrustration, 150);
    const styleCategories = Array.isArray(body.styleCategories)
      ? body.styleCategories.map((item: unknown) => sanitizeText(item, 50)).filter(Boolean)
      : [];
    const tryOnExcitement = sanitizeText(body.tryOnExcitement, 50);
    const deliveryArea = sanitizeText(body.deliveryArea, 100);

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('customer_surveys')
      .insert({
        contact: contact || null,
        shopping_habits: shoppingHabits,
        online_frustration: onlineFrustration || null,
        style_categories: styleCategories,
        try_on_excitement: tryOnExcitement || null,
        delivery_area: deliveryArea || null,
      })
      .select('id')
      .single();

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

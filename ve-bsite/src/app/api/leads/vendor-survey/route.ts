import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sanitizePhone, sanitizeText } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const boutiqueName = sanitizeText(body.boutiqueName, 120);
    const whatsapp = sanitizePhone(body.whatsapp);
    const inventoryTracking = sanitizeText(body.inventoryTracking, 100);
    const doubleSellingFrequency = sanitizeText(body.doubleSellingFrequency, 100);
    const deliveryMethod = sanitizeText(body.deliveryMethod, 100);
    const shrinkageIssue = sanitizeText(body.shrinkageIssue, 100);
    const photographyMethod = sanitizeText(body.photographyMethod, 100);
    const topToolDesired = sanitizeText(body.topToolDesired, 100);

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('vendor_operations_surveys')
      .insert({
        boutique_name: boutiqueName || null,
        whatsapp: whatsapp || null,
        inventory_tracking: inventoryTracking || null,
        double_selling_frequency: doubleSellingFrequency || null,
        delivery_method: deliveryMethod || null,
        shrinkage_issue: shrinkageIssue || null,
        photography_method: photographyMethod || null,
        top_tool_desired: topToolDesired || null,
      })
      .select('id')
      .single();

    if (error) {
      const errorId = crypto.randomUUID();
      console.error(`[vendor_operations_surveys] Error ${errorId}:`, error.message);
      return NextResponse.json(
        { success: false, error: 'Could not record vendor operations profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Vendor operations profile recorded.',
      id: data?.id,
    });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[vendor_operations_surveys_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { SurveyAnalyticsData } from '@/lib/types/database';

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 1. Fetch customer surveys
    const { data: customerSurveys, error: custError } = await supabase
      .from('customer_surveys')
      .select('shopping_habits, style_categories, delivery_area, online_frustration, try_on_excitement');

    if (custError) {
      console.warn('[admin_analytics] Customer surveys query warning:', custError.message);
    }

    // 2. Fetch vendor operations surveys
    const { data: vendorSurveys, error: vendError } = await supabase
      .from('vendor_operations_surveys')
      .select('inventory_tracking, double_selling_frequency, delivery_method, top_tool_desired');

    if (vendError) {
      console.warn('[admin_analytics] Vendor surveys query warning:', vendError.message);
    }

    const cSurveys = customerSurveys || [];
    const vSurveys = vendorSurveys || [];

    // Tally helpers
    const habitsMap = new Map<string, number>();
    const stylesMap = new Map<string, number>();
    const areasMap = new Map<string, number>();
    const frustrationsMap = new Map<string, number>();
    const excitementMap = new Map<string, number>();

    for (const s of cSurveys) {
      // Habits
      if (Array.isArray(s.shopping_habits)) {
        for (const h of s.shopping_habits) {
          if (h) habitsMap.set(h, (habitsMap.get(h) || 0) + 1);
        }
      }
      // Styles
      if (Array.isArray(s.style_categories)) {
        for (const cat of s.style_categories) {
          if (cat) stylesMap.set(cat, (stylesMap.get(cat) || 0) + 1);
        }
      }
      // Area
      if (s.delivery_area) {
        areasMap.set(s.delivery_area, (areasMap.get(s.delivery_area) || 0) + 1);
      }
      // Frustration
      if (s.online_frustration) {
        frustrationsMap.set(s.online_frustration, (frustrationsMap.get(s.online_frustration) || 0) + 1);
      }
      // Excitement
      if (s.try_on_excitement) {
        excitementMap.set(s.try_on_excitement, (excitementMap.get(s.try_on_excitement) || 0) + 1);
      }
    }

    // Vendor tallies
    const invMap = new Map<string, number>();
    const doubleMap = new Map<string, number>();
    const delMap = new Map<string, number>();
    const toolsMap = new Map<string, number>();

    for (const v of vSurveys) {
      if (v.inventory_tracking) invMap.set(v.inventory_tracking, (invMap.get(v.inventory_tracking) || 0) + 1);
      if (v.double_selling_frequency) doubleMap.set(v.double_selling_frequency, (doubleMap.get(v.double_selling_frequency) || 0) + 1);
      if (v.delivery_method) delMap.set(v.delivery_method, (delMap.get(v.delivery_method) || 0) + 1);
      if (v.top_tool_desired) toolsMap.set(v.top_tool_desired, (toolsMap.get(v.top_tool_desired) || 0) + 1);
    }

    const mapToArray = (m: Map<string, number>) =>
      Array.from(m.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const analyticsData: SurveyAnalyticsData = {
      shoppingHabits: mapToArray(habitsMap),
      styleCategories: mapToArray(stylesMap),
      deliveryAreas: mapToArray(areasMap),
      onlineFrustrations: mapToArray(frustrationsMap),
      tryOnExcitement: mapToArray(excitementMap),
      totalResponses: cSurveys.length,
      vendorOperations: {
        inventoryTracking: mapToArray(invMap),
        doubleSelling: mapToArray(doubleMap),
        deliveryMethods: mapToArray(delMap),
        topTools: mapToArray(toolsMap),
        totalResponses: vSurveys.length,
      },
    };

    return NextResponse.json({ success: true, data: analyticsData });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_analytics_handler] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not compute survey analytics.' },
      { status: 500 }
    );
  }
}

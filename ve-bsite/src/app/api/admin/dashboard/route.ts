import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { AdminDashboardStats } from '@/lib/types/database';

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 1. Fetch count of waitlist leads
    const waitlistCountPromise = supabase
      .from('waitlist_leads')
      .select('*', { count: 'exact', head: true });

    // 2. Fetch count of vendor applications (total and pending)
    const vendorCountPromise = supabase
      .from('vendor_applications')
      .select('*', { count: 'exact', head: true });

    const pendingVendorCountPromise = supabase
      .from('vendor_applications')
      .select('*', { count: 'exact', head: true })
      .in('status', ['new', 'reviewing']);

    // 3. Fetch count of customer surveys
    const customerSurveyCountPromise = supabase
      .from('customer_surveys')
      .select('*', { count: 'exact', head: true });

    // 4. Fetch count of vendor operations surveys
    const vendorSurveyCountPromise = supabase
      .from('vendor_operations_surveys')
      .select('*', { count: 'exact', head: true });

    // 5. Fetch count of journal posts
    const journalTotalPromise = supabase
      .from('journal_posts')
      .select('*', { count: 'exact', head: true });

    const journalPublishedPromise = supabase
      .from('journal_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    // 6. Fetch recent leads (last 5)
    const recentLeadsPromise = supabase
      .from('waitlist_leads')
      .select('id, name, contact, platform, role, referral_code, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // 7. Fetch recent vendors (last 5)
    const recentVendorsPromise = supabase
      .from('vendor_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const [
      waitlistRes,
      vendorRes,
      pendingVendorRes,
      customerSurveyRes,
      vendorSurveyRes,
      journalTotalRes,
      journalPublishedRes,
      recentLeadsRes,
      recentVendorsRes,
    ] = await Promise.allSettled([
      waitlistCountPromise,
      vendorCountPromise,
      pendingVendorCountPromise,
      customerSurveyCountPromise,
      vendorSurveyCountPromise,
      journalTotalPromise,
      journalPublishedPromise,
      recentLeadsPromise,
      recentVendorsPromise,
    ]);

    const stats: AdminDashboardStats = {
      totalWaitlist: waitlistRes.status === 'fulfilled' ? waitlistRes.value.count || 0 : 0,
      totalVendorApplications: vendorRes.status === 'fulfilled' ? vendorRes.value.count || 0 : 0,
      pendingVendorApplications: pendingVendorRes.status === 'fulfilled' ? pendingVendorRes.value.count || 0 : 0,
      totalCustomerSurveys: customerSurveyRes.status === 'fulfilled' ? customerSurveyRes.value.count || 0 : 0,
      totalVendorSurveys: vendorSurveyRes.status === 'fulfilled' ? vendorSurveyRes.value.count || 0 : 0,
      totalJournalPosts: journalTotalRes.status === 'fulfilled' ? journalTotalRes.value.count || 0 : 0,
      publishedJournalPosts: journalPublishedRes.status === 'fulfilled' ? journalPublishedRes.value.count || 0 : 0,
      recentLeads: recentLeadsRes.status === 'fulfilled' ? recentLeadsRes.value.data || [] : [],
      recentVendors: recentVendorsRes.status === 'fulfilled' ? recentVendorsRes.value.data || [] : [],
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (err: unknown) {
    const errorId = crypto.randomUUID();
    console.error(`[admin_dashboard_stats] Exception ${errorId}:`, err);
    return NextResponse.json(
      { success: false, error: 'Could not load dashboard statistics.' },
      { status: 500 }
    );
  }
}

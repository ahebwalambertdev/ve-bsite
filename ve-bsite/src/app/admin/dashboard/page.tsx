'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminDashboardStats } from '@/lib/types/database';
import { 
  Users, 
  Store, 
  BarChart3, 
  BookOpen, 
  Sliders, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  RefreshCw,
  Globe,
  Sparkles,
  Smartphone,
  Tag
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch stats');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching stats';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const gaPropertyId = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Top Welcome & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-carbon-black tracking-tight">
              Ecosystem Overview
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Real-time lead capture, merchant pipelines, consumer behavior surveys, and CMS control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-soft-linen bg-white text-xs font-medium text-neutral-700 hover:bg-soft-linen/50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* 1. Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Waitlist Card */}
          <Link href="/admin/leads" className="group">
            <Card className="p-5 bg-white border-soft-linen hover:border-dusty-olive/60 transition-all shadow-xs group-hover:shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  App Waitlist
                </span>
                <div className="w-8 h-8 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-carbon-black">
                  {isLoading ? '—' : stats?.totalWaitlist ?? 0}
                </span>
                <span className="text-[11px] text-neutral-500">signups</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-dusty-olive font-medium group-hover:underline">
                <span>View leads table</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>

          {/* Vendor Applications Card */}
          <Link href="/admin/vendors" className="group">
            <Card className="p-5 bg-white border-soft-linen hover:border-dusty-olive/60 transition-all shadow-xs group-hover:shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Vendor Pipeline
                </span>
                <div className="w-8 h-8 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive">
                  <Store className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-carbon-black">
                  {isLoading ? '—' : stats?.totalVendorApplications ?? 0}
                </span>
                <span className="text-[11px] text-neutral-500">applications</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-amber-700 font-medium">
                  {stats?.pendingVendorApplications ?? 0} pending review
                </span>
                <span className="text-dusty-olive font-medium group-hover:underline flex items-center gap-0.5">
                  Manage <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          </Link>

          {/* Survey Responses */}
          <Link href="/admin/analytics" className="group">
            <Card className="p-5 bg-white border-soft-linen hover:border-dusty-olive/60 transition-all shadow-xs group-hover:shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Survey Insights
                </span>
                <div className="w-8 h-8 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-carbon-black">
                  {isLoading ? '—' : (stats?.totalCustomerSurveys ?? 0) + (stats?.totalVendorSurveys ?? 0)}
                </span>
                <span className="text-[11px] text-neutral-500">responses</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-dusty-olive font-medium group-hover:underline">
                <span>View behavioral charts</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>

          {/* Journal Posts */}
          <Link href="/admin/journal" className="group">
            <Card className="p-5 bg-white border-soft-linen hover:border-dusty-olive/60 transition-all shadow-xs group-hover:shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Journal Articles
                </span>
                <div className="w-8 h-8 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-carbon-black">
                  {isLoading ? '—' : stats?.publishedJournalPosts ?? 0}
                </span>
                <span className="text-[11px] text-neutral-500">published</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-dusty-olive font-medium group-hover:underline">
                <span>Manage publications</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>
        </div>

        {/* 2. Quick Access Navigation Hub */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-carbon-black">
            Management Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Visual Studio CMS */}
            <Link href="/admin/studio" className="group">
              <Card className="p-6 bg-white border-soft-linen hover:border-dusty-olive/70 transition-all shadow-xs group-hover:shadow-subtle h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black mb-4">
                    <Sliders className="w-5 h-5 text-dusty-olive" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-carbon-black">
                    Visual Studio CMS
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Live split-screen website editor with multi-device viewport previews and draft persistence.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-dusty-olive group-hover:underline">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </Link>

            {/* Waitlist & Vendor Leads */}
            <Link href="/admin/leads" className="group">
              <Card className="p-6 bg-white border-soft-linen hover:border-dusty-olive/70 transition-all shadow-xs group-hover:shadow-subtle h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black mb-4">
                    <Users className="w-5 h-5 text-dusty-olive" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-carbon-black">
                    Waitlist &amp; Contact Records
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Filter early-access shoppers by mobile platform (Android / iOS), role, and export full CSVs.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-dusty-olive group-hover:underline">
                  <span>Open Leads Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </Link>

            {/* Survey Analytics */}
            <Link href="/admin/analytics" className="group">
              <Card className="p-6 bg-white border-soft-linen hover:border-dusty-olive/70 transition-all shadow-xs group-hover:shadow-subtle h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-carbon-black mb-4">
                    <BarChart3 className="w-5 h-5 text-dusty-olive" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-carbon-black">
                    Market &amp; Behavior Insights
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Interactive Recharts visualizations of consumer habits, shopping frustrations, and delivery zones.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-dusty-olive group-hover:underline">
                  <span>Explore Charts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* 3. Google Analytics 4 Integration Card */}
        <Card className="p-6 bg-gradient-to-r from-snow to-soft-linen/40 border-soft-linen shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
                  Live Traffic &amp; Acquisition
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-carbon-black">
                Google Analytics 4 &amp; Campaign Tracking
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Ve website traffic, referral campaigns, and conversion goals (waitlist signups, boutique applications) are monitored via property{' '}
                <code className="font-mono bg-soft-linen px-1.5 py-0.5 rounded text-carbon-black">
                  {gaPropertyId}
                </code>
                . Access real-time visitors, user acquisition channels, and search console impressions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md">
                  <span>Open GA4 Console</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>

              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="md">
                  <span>Search Console</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* 4. Recent Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Waitlist Leads */}
          <Card className="p-6 bg-white border-soft-linen shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
                <Users className="w-4 h-4 text-dusty-olive" />
                Recent Waitlist Signups
              </h3>
              <Link href="/admin/leads" className="text-xs text-dusty-olive font-medium hover:underline">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-soft-linen">
              {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                stats.recentLeads.map((lead) => (
                  <div key={lead.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-carbon-black">
                        {lead.name || 'Anonymous User'}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {lead.contact}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-soft-linen text-neutral-700">
                        {lead.platform || 'Web'}
                      </span>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No recent waitlist signups recorded yet.
                </div>
              )}
            </div>
          </Card>

          {/* Recent Vendor Applications */}
          <Card className="p-6 bg-white border-soft-linen shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
                <Store className="w-4 h-4 text-dusty-olive" />
                Recent Boutique Applications
              </h3>
              <Link href="/admin/vendors" className="text-xs text-dusty-olive font-medium hover:underline">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-soft-linen">
              {stats?.recentVendors && stats.recentVendors.length > 0 ? (
                stats.recentVendors.map((vendor) => (
                  <div key={vendor.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-carbon-black flex items-center gap-1.5">
                        <span>{vendor.boutique_name}</span>
                        <span className="text-[10px] font-medium text-neutral-500">
                          ({vendor.owner_name})
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {vendor.location || 'Kampala'} • {vendor.category || 'Apparel'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                        {vendor.status}
                      </span>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : '—'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No recent boutique applications recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { SurveyAnalyticsData } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  ShoppingBag, 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  Store,
  Truck
} from 'lucide-react';

const COLORS = [
  '#4A5568', // Carbon slate
  '#6B7280', // Neutral gray
  '#5C7C64', // Dusty Olive
  '#849B89', // Light Olive
  '#A0AEC0', // Soft slate
  '#CBD5E0', // Muted
];

export function SurveyCharts() {
  const [data, setData] = useState<SurveyAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) throw new Error('Failed to load survey analytics');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch analytics');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching analytics';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-neutral-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-dusty-olive" />
        <p className="text-sm">Synthesizing customer and boutique survey insights...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
        <p className="font-semibold">Unable to load survey charts</p>
        <p className="text-xs mt-1 text-red-600">{error || 'Unknown error'}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-3 text-xs underline font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Aggregation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-snow p-5 rounded-2xl border border-soft-linen shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-carbon-black flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-dusty-olive" />
            Kampala Market &amp; Behavior Insights
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Aggregated, privacy-safe analytics from {data.totalResponses} shopper surveys and{' '}
            {data.vendorOperations?.totalResponses || 0} boutique operational profiles.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-soft-linen rounded-lg hover:bg-soft-linen/50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Shopping Habits */}
        <Card className="p-6 bg-white border-soft-linen shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-dusty-olive" />
              How Kampala Shoppers Discover Fashion
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">Frequency Count</span>
          </div>

          <div className="h-64 w-full">
            {data.shoppingHabits.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                No habit survey records yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.shoppingHabits}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#4A5568' }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E232A',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.shoppingHabits.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* 2. Top Online Shopping Frustrations */}
        <Card className="p-6 bg-white border-soft-linen shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Biggest Frustrations with Social Shopping
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">Reported Issues</span>
          </div>

          <div className="h-64 w-full">
            {data.onlineFrustrations.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                No frustration survey records yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.onlineFrustrations}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#4A5568' }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E232A',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#5C7C64" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* 3. Delivery Areas Demand */}
        <Card className="p-6 bg-white border-soft-linen shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
              <MapPin className="w-4 h-4 text-dusty-olive" />
              Geographic Delivery Concentration
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">Kampala Neighborhoods</span>
          </div>

          <div className="h-64 w-full">
            {data.deliveryAreas.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                No delivery location records yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.deliveryAreas}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#4A5568' }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E232A',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#2D3748" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* 4. Style & Wardrobe Categories */}
        <Card className="p-6 bg-white border-soft-linen shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-semibold text-carbon-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-dusty-olive" />
              Most Desired Style Categories
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">Categories</span>
          </div>

          <div className="h-64 w-full">
            {data.styleCategories.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                No style category records yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.styleCategories}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#4A5568' }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E232A',
                      borderColor: '#374151',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#5C7C64" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* 5. Vendor Operational Friction Section */}
      {data.vendorOperations && (
        <div className="pt-6 border-t border-soft-linen">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-carbon-black flex items-center gap-2">
              <Store className="w-4 h-4 text-dusty-olive" />
              Boutique Merchant Operational Friction
            </h3>
            <p className="text-xs text-neutral-500">
              Direct insights from merchant onboarding on double-selling, inventory tracking, and courier issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inventory Tracking */}
            <Card className="p-5 bg-white border-soft-linen shadow-xs">
              <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">
                Inventory Tracking Method
              </h4>
              <div className="space-y-2">
                {data.vendorOperations.inventoryTracking.length === 0 ? (
                  <p className="text-xs text-neutral-400">No data</p>
                ) : (
                  data.vendorOperations.inventoryTracking.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600 truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono font-semibold text-carbon-black">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Double Selling */}
            <Card className="p-5 bg-white border-soft-linen shadow-xs">
              <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">
                Double-Selling Frequency
              </h4>
              <div className="space-y-2">
                {data.vendorOperations.doubleSelling.length === 0 ? (
                  <p className="text-xs text-neutral-400">No data</p>
                ) : (
                  data.vendorOperations.doubleSelling.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600 truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono font-semibold text-carbon-black">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Delivery Methods */}
            <Card className="p-5 bg-white border-soft-linen shadow-xs">
              <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-dusty-olive" /> Current Delivery Method
              </h4>
              <div className="space-y-2">
                {data.vendorOperations.deliveryMethods.length === 0 ? (
                  <p className="text-xs text-neutral-400">No data</p>
                ) : (
                  data.vendorOperations.deliveryMethods.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600 truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono font-semibold text-carbon-black">{item.count}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

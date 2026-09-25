'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WaitlistLead } from '@/lib/types/database';
import { CsvExportButton } from '@/components/admin/csv-export-button';
import { 
  Search, 
  RefreshCw, 
  Smartphone, 
  Apple, 
  Users, 
  Tag, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export function LeadsTable() {
  const [leads, setLeads] = useState<WaitlistLead[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [platform, setPlatform] = useState<string>('all');
  const [role, setRole] = useState<string>('all');
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchLeads = useCallback(
    async (targetCursor: string | null = null) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('limit', '25');
        if (targetCursor) params.set('cursor', targetCursor);
        if (platform !== 'all') params.set('platform', platform);
        if (role !== 'all') params.set('role', role);
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`/api/admin/leads?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load waitlist leads');

        const json = await res.json();
        if (json.success) {
          setLeads(json.data || []);
          setTotal(json.total || 0);
          setNextCursor(json.nextCursor || null);
        } else {
          throw new Error(json.error || 'Failed to fetch leads');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error fetching leads';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [platform, role, search]
  );

  useEffect(() => {
    setCursor(null);
    setCursorHistory([]);
    fetchLeads(null);
  }, [fetchLeads]);

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, cursor || '']);
      setCursor(nextCursor);
      fetchLeads(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, prev.length - 1));
      setCursor(prevCursor || null);
      fetchLeads(prevCursor || null);
    }
  };

  const csvColumns: { key: keyof WaitlistLead; header: string }[] = [
    { key: 'name', header: 'Full Name' },
    { key: 'contact', header: 'Phone / Email' },
    { key: 'platform', header: 'Device Platform' },
    { key: 'role', header: 'Interest Type' },
    { key: 'referral_code', header: 'Referral Code' },
    { key: 'created_at', header: 'Sign-up Timestamp' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Bar: Filters, Search, CSV Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-snow p-4 rounded-xl border border-soft-linen shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
            />
          </div>

          {/* Platform Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="py-1.5 px-2 bg-white border border-soft-linen rounded-lg text-xs focus:outline-none focus:border-dusty-olive"
            >
              <option value="all">All Platforms</option>
              <option value="android">Android</option>
              <option value="ios">iOS / iPhone</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="py-1.5 px-2 bg-white border border-soft-linen rounded-lg text-xs focus:outline-none focus:border-dusty-olive"
          >
            <option value="all">All Interests</option>
            <option value="shopper">Shoppers</option>
            <option value="vendor">Boutiques / Vendors</option>
          </select>
        </div>

        {/* Right Actions: Refresh & Export */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => fetchLeads(cursor)}
            disabled={isLoading}
            className="p-2 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/50 rounded-lg transition-colors border border-soft-linen"
            title="Refresh leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <CsvExportButton
            data={leads as unknown as Record<string, unknown>[]}
            filename="ve-waitlist-leads"
            columns={csvColumns as unknown as { key: string; header: string }[]}
            label="Export Leads CSV"
          />
        </div>
      </div>

      {/* Table Surface */}
      <Card className="border-soft-linen overflow-hidden bg-white shadow-xs">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs border-b border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchLeads(cursor)}
              className="underline font-semibold ml-2"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-soft-linen/40 text-neutral-600 border-b border-soft-linen select-none font-medium">
              <tr>
                <th className="py-3 px-4">Contact & User</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Interest</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-linen/60">
              {isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-dusty-olive" />
                    Loading early access reservations...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    No waitlist reservations match your current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-soft-linen/20 transition-colors">
                    {/* Contact & Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-carbon-black">
                        {lead.name || 'Anonymous Waitlist User'}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-500">
                        {lead.contact}
                      </div>
                    </td>

                    {/* Platform Badge */}
                    <td className="py-3 px-4">
                      {lead.platform === 'ios' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700">
                          <Apple className="w-3 h-3" /> iOS
                        </span>
                      ) : lead.platform === 'android' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Smartphone className="w-3 h-3" /> Android
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-soft-linen/60 text-neutral-600">
                          {lead.platform || 'Not Specified'}
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className="capitalize text-neutral-700 font-medium">
                        {lead.role || 'Shopper'}
                      </span>
                    </td>

                    {/* Referral Code */}
                    <td className="py-3 px-4">
                      {lead.referral_code ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-dusty-olive/10 text-dusty-olive-dark px-2 py-0.5 rounded">
                          <Tag className="w-3 h-3" />
                          {lead.referral_code}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-UG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination & Counts */}
        <div className="p-3 bg-snow border-t border-soft-linen flex items-center justify-between text-xs text-neutral-600">
          <div>
            Showing <span className="font-semibold text-carbon-black">{leads.length}</span> of{' '}
            <span className="font-semibold text-carbon-black">{total}</span> total leads
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={cursorHistory.length === 0 || isLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-soft-linen bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-soft-linen/40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={!nextCursor || isLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-soft-linen bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-soft-linen/40 transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

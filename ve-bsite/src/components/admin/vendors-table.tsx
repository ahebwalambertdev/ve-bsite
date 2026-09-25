'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VendorApplication, VendorStatus } from '@/lib/types/database';
import { CsvExportButton } from '@/components/admin/csv-export-button';
import { 
  Search, 
  RefreshCw, 
  Store, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export function VendorsTable() {
  const [vendors, setVendors] = useState<VendorApplication[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVendors = useCallback(
    async (targetCursor: string | null = null) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('limit', '25');
        if (targetCursor) params.set('cursor', targetCursor);
        if (status !== 'all') params.set('status', status);
        if (search.trim()) params.set('search', search.trim());

        const res = await fetch(`/api/admin/vendors?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load vendor applications');

        const json = await res.json();
        if (json.success) {
          setVendors(json.data || []);
          setTotal(json.total || 0);
          setNextCursor(json.nextCursor || null);
        } else {
          throw new Error(json.error || 'Failed to fetch vendor applications');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error fetching vendor applications';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [status, search]
  );

  useEffect(() => {
    setCursor(null);
    setCursorHistory([]);
    fetchVendors(null);
  }, [fetchVendors]);

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, cursor || '']);
      setCursor(nextCursor);
      fetchVendors(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory((prev) => prev.slice(0, prev.length - 1));
      setCursor(prevCursor || null);
      fetchVendors(prevCursor || null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: VendorStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/vendors/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      // Optimistic state update
      setVendors((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
    } catch (err) {
      console.error('[Vendor status update failed]', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const csvColumns: { key: keyof VendorApplication; header: string }[] = [
    { key: 'boutique_name', header: 'Boutique Name' },
    { key: 'owner_name', header: 'Owner Name' },
    { key: 'whatsapp', header: 'WhatsApp Number' },
    { key: 'location', header: 'Location / Arcade' },
    { key: 'category', header: 'Specialty Category' },
    { key: 'stock_size', header: 'Inventory Stock Size' },
    { key: 'social_handle', header: 'Social Handle' },
    { key: 'status', header: 'Application Status' },
    { key: 'created_at', header: 'Application Date' },
  ];

  const getStatusBadge = (s: VendorStatus) => {
    switch (s) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> New
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3 h-3" /> Reviewing
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-snow p-4 rounded-xl border border-soft-linen shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search boutique, owner, WhatsApp, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-1.5 px-2 bg-white border border-soft-linen rounded-lg text-xs focus:outline-none focus:border-dusty-olive"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Applications</option>
              <option value="reviewing">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => fetchVendors(cursor)}
            disabled={isLoading}
            className="p-2 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/50 rounded-lg transition-colors border border-soft-linen"
            title="Refresh applications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <CsvExportButton
            data={vendors as unknown as Record<string, unknown>[]}
            filename="ve-vendor-applications"
            columns={csvColumns as unknown as { key: string; header: string }[]}
            label="Export Applications CSV"
          />
        </div>
      </div>

      {/* Table Surface */}
      <Card className="border-soft-linen overflow-hidden bg-white shadow-xs">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs border-b border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchVendors(cursor)}
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
                <th className="py-3 px-4">Boutique & Owner</th>
                <th className="py-3 px-4">Location & Social</th>
                <th className="py-3 px-4">Category & Stock</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4">Direct Contact</th>
                <th className="py-3 px-4">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-linen/60">
              {isLoading && vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-dusty-olive" />
                    Loading boutique applications...
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No vendor applications found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => {
                  const whatsappClean = vendor.whatsapp.replace(/[^\d]/g, '');
                  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                    `Hi ${vendor.owner_name}, this is the Ve Merchant Onboarding team regarding your application for "${vendor.boutique_name}".`
                  )}`;

                  return (
                    <tr key={vendor.id} className="hover:bg-soft-linen/20 transition-colors">
                      {/* Boutique & Owner */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-carbon-black flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-dusty-olive flex-shrink-0" />
                          <span>{vendor.boutique_name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Owner: <span className="font-medium text-neutral-700">{vendor.owner_name}</span>
                        </div>
                      </td>

                      {/* Location & Social */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-neutral-700">
                          <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                          <span>{vendor.location || 'Kampala (Unspecified)'}</span>
                        </div>
                        {vendor.social_handle && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                            <Instagram className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                            <span>{vendor.social_handle}</span>
                          </div>
                        )}
                      </td>

                      {/* Category & Stock */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-800">
                          {vendor.category || 'Fashion Apparel'}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                          <Package className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                          <span>{vendor.stock_size || 'Standard inventory'}</span>
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(vendor.status)}
                          <select
                            value={vendor.status}
                            disabled={updatingId === vendor.id}
                            onChange={(e) =>
                              handleStatusChange(vendor.id, e.target.value as VendorStatus)
                            }
                            className="text-[11px] py-1 px-1.5 bg-white border border-soft-linen rounded focus:outline-none focus:border-dusty-olive"
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* Direct WhatsApp CTA */}
                      <td className="py-3 px-4">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded transition-colors"
                          title="Chat with boutique owner on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                        {vendor.created_at
                          ? new Date(vendor.created_at).toLocaleDateString('en-UG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-snow border-t border-soft-linen flex items-center justify-between text-xs text-neutral-600">
          <div>
            Showing <span className="font-semibold text-carbon-black">{vendors.length}</span> of{' '}
            <span className="font-semibold text-carbon-black">{total}</span> total applications
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

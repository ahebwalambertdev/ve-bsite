'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WaitlistLead } from '@/lib/types/database';
import { CsvExportButton } from '@/components/admin/csv-export-button';
import {
  Search,
  RefreshCw,
  Smartphone,
  Apple,
  Monitor,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  Sliders,
  Check,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal & Action States
  const [managingLead, setManagingLead] = useState<WaitlistLead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<WaitlistLead | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manage Fields Form State (within managingLead modal)
  const [editName, setEditName] = useState<string>('');
  const [editContact, setEditContact] = useState<string>('');
  const [editPlatform, setEditPlatform] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('');
  const [editReferralCode, setEditReferralCode] = useState<string>('');

  useEffect(() => {
    if (managingLead) {
      setEditName(managingLead.name || '');
      setEditContact(managingLead.contact || '');
      setEditPlatform(managingLead.platform || '');
      setEditRole(managingLead.role || '');
      setEditReferralCode(managingLead.referral_code || '');
    }
  }, [managingLead]);

  // Clear feedback message automatically
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

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
          setSelectedIds(new Set()); // Reset selections on new page fetch
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

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === leads.length && leads.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 1. Delete Single Lead
  const handleConfirmDeleteSingle = async () => {
    if (!leadToDelete) return;
    setIsProcessingAction(true);
    const targetId = leadToDelete.id;

    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(targetId)}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete lead.');
      }

      // Optimistic removal
      setLeads((prev) => prev.filter((l) => l.id !== targetId));
      setTotal((prev) => Math.max(0, prev - 1));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
      setFeedbackMessage({
        type: 'success',
        text: `Successfully deleted lead "${leadToDelete.contact}" from waitlist.`,
      });
      setLeadToDelete(null);
      if (managingLead?.id === targetId) setManagingLead(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete lead.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 2. Batch Delete Selected Leads
  const handleConfirmBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessingAction(true);
    const ids = Array.from(selectedIds);

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete selected leads.');
      }

      setLeads((prev) => prev.filter((l) => !selectedIds.has(l.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      setSelectedIds(new Set());
      setShowBatchDeleteModal(false);
      setFeedbackMessage({
        type: 'success',
        text: `Successfully deleted ${ids.length} lead(s) from waitlist.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete selected leads.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 3. Clear Specific Field(s) on Single Lead
  const handleClearField = async (leadId: string, fieldName: 'name' | 'platform' | 'role' | 'referral_code') => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          fieldsToClear: [fieldName],
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed to clear ${fieldName}.`);
      }

      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, [fieldName]: null } : l))
      );
      if (managingLead && managingLead.id === leadId) {
        setManagingLead((prev) => (prev ? { ...prev, [fieldName]: null } : null));
        if (fieldName === 'name') setEditName('');
        if (fieldName === 'platform') setEditPlatform('');
        if (fieldName === 'role') setEditRole('');
        if (fieldName === 'referral_code') setEditReferralCode('');
      }

      setFeedbackMessage({
        type: 'success',
        text: `Cleared "${fieldName}" field successfully.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Could not clear ${fieldName}.`;
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 4. Clear All Optional Fields on Single Lead
  const handleClearAllOptionalFields = async (leadId: string) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          fieldsToClear: ['name', 'platform', 'role', 'referral_code'],
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to clear optional fields.');
      }

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, name: null, platform: null, role: null, referral_code: null }
            : l
        )
      );
      if (managingLead && managingLead.id === leadId) {
        setManagingLead((prev) =>
          prev
            ? { ...prev, name: null, platform: null, role: null, referral_code: null }
            : null
        );
        setEditName('');
        setEditPlatform('');
        setEditRole('');
        setEditReferralCode('');
      }

      setFeedbackMessage({
        type: 'success',
        text: 'All optional fields cleared (set to null).',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not clear optional fields.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 5. Batch Clear Specific Field across Selected Leads
  const handleBatchClearField = async (fieldName: 'name' | 'referral_code') => {
    if (selectedIds.size === 0) return;
    setIsProcessingAction(true);
    const ids = Array.from(selectedIds);

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids,
          fieldsToClear: [fieldName],
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed to clear ${fieldName} for selected leads.`);
      }

      setLeads((prev) =>
        prev.map((l) => (selectedIds.has(l.id) ? { ...l, [fieldName]: null } : l))
      );

      setFeedbackMessage({
        type: 'success',
        text: `Cleared "${fieldName}" for ${ids.length} selected lead(s).`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Could not clear ${fieldName}.`;
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // 6. Save Edits from Field Management Modal
  const handleSaveModalEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingLead) return;
    setIsProcessingAction(true);

    try {
      const updates = {
        name: editName.trim() || null,
        contact: editContact.trim(),
        platform: editPlatform || null,
        role: editRole || null,
        referral_code: editReferralCode.trim() || null,
      };

      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: managingLead.id,
          updates,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save changes.');
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === managingLead.id ? { ...l, ...updates } : l))
      );
      setManagingLead(null);
      setFeedbackMessage({
        type: 'success',
        text: 'Lead data fields updated successfully.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save updates.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessingAction(false);
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
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div
          role="status"
          className={`p-3 rounded-xl text-xs flex items-center justify-between border transition-all animate-in fade-in slide-in-from-top-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:bg-black/5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: Filters, Search, Batch Actions & Export */}
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
              className="py-1.5 px-2 bg-white border border-soft-linen rounded-lg text-xs focus:outline-none focus:border-dusty-olive cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="android">Android</option>
              <option value="ios">iOS / iPhone</option>
              <option value="desktop">Desktop / Web</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="py-1.5 px-2 bg-white border border-soft-linen rounded-lg text-xs focus:outline-none focus:border-dusty-olive cursor-pointer"
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
            className="p-2 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/50 rounded-lg transition-colors border border-soft-linen cursor-pointer"
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

      {/* Batch Action Bar (Visible when rows are checked) */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-neutral-900 text-snow rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded text-[11px]">
              {selectedIds.size} of {leads.length} selected
            </span>
            <span className="text-neutral-300 hidden sm:inline">Bulk actions on selected waiting list leads:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBatchClearField('name')}
              disabled={isProcessingAction}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors cursor-pointer text-[11px]"
            >
              Clear Names
            </button>
            <button
              onClick={() => handleBatchClearField('referral_code')}
              disabled={isProcessingAction}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors cursor-pointer text-[11px]"
            >
              Clear Codes
            </button>
            <button
              onClick={() => setShowBatchDeleteModal(true)}
              disabled={isProcessingAction}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedIds.size})
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-neutral-400 hover:text-white px-2 py-1 text-[11px] underline cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table Surface */}
      <Card className="border-soft-linen overflow-hidden bg-white shadow-xs">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs border-b border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchLeads(cursor)}
              className="underline font-semibold ml-2 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-soft-linen/40 text-neutral-600 border-b border-soft-linen select-none font-medium">
              <tr>
                {/* Master Checkbox */}
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={leads.length > 0 && selectedIds.size === leads.length}
                    onChange={handleToggleSelectAll}
                    disabled={leads.length === 0}
                    className="accent-dusty-olive rounded w-4 h-4 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th className="py-3 px-4">Contact &amp; User</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Interest</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-linen/60">
              {isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-dusty-olive" />
                    Loading early access reservations...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No waitlist reservations match your current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isSelected = selectedIds.has(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-dusty-olive/5' : 'hover:bg-soft-linen/20'
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(lead.id)}
                          className="accent-dusty-olive rounded w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Contact & Name */}
                      <td className="py-3 px-4">
                        {lead.name ? (
                          <>
                            <div className="font-semibold text-carbon-black flex items-center gap-1.5">
                              <span>{lead.name}</span>
                              <button
                                onClick={() => handleClearField(lead.id, 'name')}
                                title="Clear Name field (set to null)"
                                className="text-[10px] text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer px-1 py-0.2 rounded hover:bg-rose-50"
                              >
                                [clear]
                              </button>
                            </div>
                            <div className="font-mono text-[11px] text-neutral-500">
                              {lead.contact}
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-carbon-black font-mono text-xs flex items-center gap-1.5">
                            <span>{lead.contact}</span>
                            <span className="text-[10px] font-normal text-neutral-400 font-sans italic">
                              (no name)
                            </span>
                          </div>
                        )}
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
                        ) : lead.platform === 'desktop' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <Monitor className="w-3 h-3" /> Desktop
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-soft-linen/60 text-neutral-600">
                            {lead.platform || '—'}
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
                          <div className="inline-flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-dusty-olive/10 text-dusty-olive-dark px-2 py-0.5 rounded">
                              <Tag className="w-3 h-3" />
                              {lead.referral_code}
                            </span>
                            <button
                              onClick={() => handleClearField(lead.id, 'referral_code')}
                              title="Clear Referral Code (set to null)"
                              className="text-[10px] text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer px-1 rounded hover:bg-rose-50"
                            >
                              ✕
                            </button>
                          </div>
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

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Manage / Clear Fields Modal Trigger */}
                          <button
                            onClick={() => setManagingLead(lead)}
                            title="Manage / Clear Fields"
                            className="p-1.5 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/70 rounded-lg transition-colors cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Lead Button */}
                          <button
                            onClick={() => setLeadToDelete(lead)}
                            title="Delete Lead Record"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-soft-linen bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-soft-linen/40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={!nextCursor || isLoading}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-soft-linen bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-soft-linen/40 transition-colors cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* MODAL 1: Manage & Clear Fields for a Lead */}
      {managingLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-black/60 backdrop-blur-xs"
        >
          <div className="bg-snow w-full max-w-lg rounded-2xl border border-soft-linen shadow-elevated p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-soft-linen pb-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-carbon-black">
                  Manage Lead Data Fields
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Lead ID: {managingLead.id.slice(0, 12)}... · Joined{' '}
                  {managingLead.created_at ? new Date(managingLead.created_at).toLocaleDateString() : ''}
                </p>
              </div>
              <button
                onClick={() => setManagingLead(null)}
                className="p-1.5 text-neutral-400 hover:text-carbon-black rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModalEdits} className="space-y-4 text-xs">
              {/* Field: Full Name */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-soft-linen">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-carbon-black uppercase text-[11px] tracking-wider">
                    Full Name
                  </label>
                  {managingLead.name && (
                    <button
                      type="button"
                      onClick={() => handleClearField(managingLead.id, 'name')}
                      disabled={isProcessingAction}
                      className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Field (set null)
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="No name stored (leave blank to keep null)"
                  className="w-full px-3 py-1.5 rounded-lg border border-soft-linen bg-snow text-xs focus:outline-none focus:border-dusty-olive"
                />
              </div>

              {/* Field: Contact */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-soft-linen">
                <label className="font-semibold text-carbon-black uppercase text-[11px] tracking-wider block">
                  Contact (Phone or Email) *
                </label>
                <input
                  type="text"
                  required
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  placeholder="e.g. 0772 000 000"
                  className="w-full px-3 py-1.5 rounded-lg border border-soft-linen bg-snow text-xs focus:outline-none focus:border-dusty-olive font-mono"
                />
              </div>

              {/* Field: Platform */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-soft-linen">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-carbon-black uppercase text-[11px] tracking-wider">
                    Device Platform
                  </label>
                  {managingLead.platform && (
                    <button
                      type="button"
                      onClick={() => handleClearField(managingLead.id, 'platform')}
                      disabled={isProcessingAction}
                      className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Field
                    </button>
                  )}
                </div>
                <select
                  value={editPlatform}
                  onChange={(e) => setEditPlatform(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-soft-linen bg-snow text-xs focus:outline-none focus:border-dusty-olive cursor-pointer"
                >
                  <option value="">None / Not specified (null)</option>
                  <option value="android">Android</option>
                  <option value="ios">iOS / iPhone</option>
                  <option value="desktop">Desktop / Web</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Field: Role / Interest */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-soft-linen">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-carbon-black uppercase text-[11px] tracking-wider">
                    Role / Interest
                  </label>
                  {managingLead.role && (
                    <button
                      type="button"
                      onClick={() => handleClearField(managingLead.id, 'role')}
                      disabled={isProcessingAction}
                      className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Field
                    </button>
                  )}
                </div>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-soft-linen bg-snow text-xs focus:outline-none focus:border-dusty-olive cursor-pointer"
                >
                  <option value="">None / Not specified (null)</option>
                  <option value="shopper">Shopper</option>
                  <option value="vendor">Boutique / Vendor</option>
                </select>
              </div>

              {/* Field: Referral Code */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-soft-linen">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-carbon-black uppercase text-[11px] tracking-wider">
                    Referral Code
                  </label>
                  {managingLead.referral_code && (
                    <button
                      type="button"
                      onClick={() => handleClearField(managingLead.id, 'referral_code')}
                      disabled={isProcessingAction}
                      className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Field
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={editReferralCode}
                  onChange={(e) => setEditReferralCode(e.target.value)}
                  placeholder="No code assigned (leave blank to keep null)"
                  className="w-full px-3 py-1.5 rounded-lg border border-soft-linen bg-snow text-xs focus:outline-none focus:border-dusty-olive font-mono uppercase"
                />
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-soft-linen">
                <button
                  type="button"
                  onClick={() => handleClearAllOptionalFields(managingLead.id)}
                  disabled={isProcessingAction}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-soft-linen bg-white text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                  Clear All Optional Fields
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const target = managingLead;
                      setManagingLead(null);
                      setLeadToDelete(target);
                    }}
                    className="px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer font-medium"
                  >
                    Delete Lead
                  </button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isProcessingAction}
                    className="cursor-pointer font-semibold"
                  >
                    {isProcessingAction ? 'Saving...' : 'Save Field Edits'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Single Lead Delete Confirmation */}
      {leadToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-black/60 backdrop-blur-xs"
        >
          <div className="bg-snow w-full max-w-md rounded-2xl border border-soft-linen shadow-elevated p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold text-carbon-black">
                  Delete Lead from Waiting List?
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Are you sure you want to permanently delete lead{' '}
                  <strong className="text-carbon-black font-mono">{leadToDelete.contact}</strong>
                  {leadToDelete.name ? ` (${leadToDelete.name})` : ''}? This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-soft-linen">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                disabled={isProcessingAction}
                className="px-3 py-2 rounded-lg border border-soft-linen bg-white text-xs text-neutral-600 hover:bg-soft-linen/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isProcessingAction ? 'Deleting...' : 'Delete Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Batch Delete Confirmation */}
      {showBatchDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-black/60 backdrop-blur-xs"
        >
          <div className="bg-snow w-full max-w-md rounded-2xl border border-soft-linen shadow-elevated p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-semibold text-carbon-black">
                  Delete {selectedIds.size} Selected Leads?
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  You are about to delete <strong className="text-carbon-black">{selectedIds.size}</strong> waitlist
                  leads from the database. All associated contact records will be permanently removed.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-soft-linen">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                disabled={isProcessingAction}
                className="px-3 py-2 rounded-lg border border-soft-linen bg-white text-xs text-neutral-600 hover:bg-soft-linen/50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isProcessingAction ? 'Deleting...' : `Delete ${selectedIds.size} Leads`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

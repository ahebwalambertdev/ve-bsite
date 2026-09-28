'use client';

import React, { useState, useEffect } from 'react';
import { SiteCmsData, CmsVersionListItem, CmsVersionRecord } from '@/lib/cms/types';
import { 
  History, 
  X, 
  RotateCcw, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Tag, 
  ChevronRight, 
  ChevronDown, 
  BookmarkPlus, 
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewVersion: (versionData: SiteCmsData, version: CmsVersionListItem) => void;
  onRollbackSuccess: (restoredData: SiteCmsData, version: CmsVersionRecord) => void;
  currentLiveVersionId?: string;
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
  onPreviewVersion,
  onRollbackSuccess,
  currentLiveVersionId,
}: VersionHistoryDrawerProps) {
  const [versions, setVersions] = useState<CmsVersionListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, CmsVersionRecord>>({});
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);
  const [confirmRollbackId, setConfirmRollbackId] = useState<string | null>(null);

  // Manual savepoint state
  const [isCreatingSavepoint, setIsCreatingSavepoint] = useState<boolean>(false);
  const [savepointNote, setSavepointNote] = useState<string>('');
  const [isSavingSavepoint, setIsSavingSavepoint] = useState<boolean>(false);

  // Fetch version list
  const fetchVersions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/versions?limit=30');
      const json = await res.json();
      if (res.ok && json.success) {
        setVersions(json.versions || []);
      } else {
        setError(json.error || 'Failed to load versions');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching versions';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen]);

  // Load single version full data for preview or diff
  const loadVersionDetails = async (id: string): Promise<CmsVersionRecord | null> => {
    if (expandedDetails[id]) return expandedDetails[id];
    try {
      const res = await fetch(`/api/admin/versions/${id}`);
      const json = await res.json();
      if (res.ok && json.success && json.version) {
        setExpandedDetails((prev) => ({ ...prev, [id]: json.version }));
        return json.version;
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Handle Preview
  const handlePreview = async (v: CmsVersionListItem) => {
    const full = await loadVersionDetails(v.id);
    if (full && full.data) {
      onPreviewVersion(full.data, v);
      onClose();
    }
  };

  // Handle Rollback
  const handleRollback = async (versionId: string) => {
    try {
      setIsRollingBack(versionId);
      const res = await fetch('/api/admin/versions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        onRollbackSuccess(json.data, json.version);
        setConfirmRollbackId(null);
        await fetchVersions();
        onClose();
      } else {
        alert(json.error || 'Rollback failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rollback failed';
      alert(msg);
    } finally {
      setIsRollingBack(null);
    }
  };

  // Handle Manual Savepoint
  const handleCreateSavepoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savepointNote.trim()) return;
    try {
      setIsSavingSavepoint(true);
      const res = await fetch('/api/admin/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: savepointNote.trim(), author: 'Admin' }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSavepointNote('');
        setIsCreatingSavepoint(false);
        await fetchVersions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSavepoint(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-carbon-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-snow border-l border-soft-linen shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 select-none text-carbon-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-soft-linen bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dusty-olive/15 text-dusty-olive-dark flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-carbon-black flex items-center gap-2">
                Version History
                <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-soft-linen text-neutral-600">
                  {versions.length} {versions.length === 1 ? 'snapshot' : 'snapshots'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-500">
                Audited snapshots, changelog tags & one-click instant rollbacks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={fetchVersions}
              disabled={isLoading}
              title="Refresh version history"
              className="p-1.5 rounded-md text-neutral-400 hover:text-carbon-black hover:bg-soft-linen/50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-neutral-400 hover:text-carbon-black hover:bg-soft-linen/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Strip: Savepoint trigger */}
        <div className="px-5 py-3 border-b border-soft-linen bg-soft-linen/30 flex items-center justify-between shrink-0">
          {!isCreatingSavepoint ? (
            <button
              type="button"
              onClick={() => setIsCreatingSavepoint(true)}
              className="text-xs text-dusty-olive-dark hover:text-carbon-black font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Create manual savepoint / snapshot
            </button>
          ) : (
            <form onSubmit={handleCreateSavepoint} className="w-full flex items-center gap-2">
              <input
                type="text"
                value={savepointNote}
                onChange={(e) => setSavepointNote(e.target.value)}
                placeholder="Checkpoint note (e.g. Before hero overhaul)..."
                disabled={isSavingSavepoint}
                className="flex-1 px-2.5 py-1 text-xs bg-white border border-soft-linen rounded-md focus:outline-none focus:border-dusty-olive"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSavingSavepoint || !savepointNote.trim()}
                className="text-[11px] py-1 h-auto"
              >
                {isSavingSavepoint ? 'Saving...' : 'Save'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingSavepoint(false);
                  setSavepointNote('');
                }}
                className="text-xs text-neutral-500 hover:text-carbon-black"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && versions.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-2 text-neutral-400">
              <RefreshCw className="w-6 h-6 animate-spin text-dusty-olive" />
              <p className="text-xs">Loading version audit log...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Failed to load version history
              </p>
              <p>{error}</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-neutral-400">
              <History className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-medium">No snapshots recorded yet.</p>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                Snapshots are automatically created every time you publish changes to the live site.
              </p>
            </div>
          ) : (
            versions.map((v, index) => {
              const isCurrent = index === 0;
              const isExpanded = expandedVersionId === v.id;
              const dateObj = new Date(v.created_at);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <div
                  key={v.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isCurrent
                      ? 'bg-white border-dusty-olive/40 shadow-xs ring-1 ring-dusty-olive/20'
                      : 'bg-white border-soft-linen hover:border-neutral-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-carbon-black">
                            {formattedDate} · {formattedTime}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dusty-olive/15 text-dusty-olive-dark">
                              <span className="w-1.5 h-1.5 rounded-full bg-dusty-olive" />
                              Active Live
                            </span>
                          )}
                          {v.is_rollback && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                              <RotateCcw className="w-2.5 h-2.5" />
                              Rollback
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-700 leading-snug font-medium">
                          {v.description || 'Snapshot'}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono text-neutral-400 bg-soft-linen/50 px-1.5 py-0.5 rounded shrink-0">
                        {v.id.slice(0, 14)}
                      </span>
                    </div>

                    {/* Change Tags */}
                    {v.changes_summary && v.changes_summary.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {v.changes_summary.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center text-[10px] font-medium bg-soft-linen text-neutral-700 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] text-neutral-400 self-center ml-1">
                          by {v.author || 'Admin'}
                        </span>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-soft-linen/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Preview button */}
                        <button
                          type="button"
                          onClick={() => handlePreview(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-700 hover:text-carbon-black bg-soft-linen/60 hover:bg-soft-linen transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-neutral-500" />
                          Preview
                        </button>

                        {/* Expand Details button */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (isExpanded) {
                              setExpandedVersionId(null);
                            } else {
                              setExpandedVersionId(v.id);
                              await loadVersionDetails(v.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-carbon-black cursor-pointer px-1.5 py-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="w-3 h-3" /> Hide details
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-3 h-3" /> Inspect
                            </>
                          )}
                        </button>
                      </div>

                      {/* Rollback button (only for non-current or if confirmed) */}
                      {!isCurrent && (
                        confirmRollbackId === v.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRollback(v.id)}
                              disabled={isRollingBack === v.id}
                              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                            >
                              {isRollingBack === v.id ? 'Restoring...' : 'Confirm Restore'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRollbackId(null)}
                              className="text-xs text-neutral-500 hover:text-carbon-black px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmRollbackId(v.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Rollback to this
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Expanded Inspector Panel */}
                  {isExpanded && (
                    <div className="px-4 py-3 bg-soft-linen/25 border-t border-soft-linen text-xs space-y-2 animate-in fade-in duration-150">
                      <div className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                        Snapshot Inspector
                      </div>
                      {expandedDetails[v.id] ? (
                        <div className="space-y-1.5 font-mono text-[11px] text-neutral-700">
                          <div className="flex justify-between py-0.5 border-b border-soft-linen/50">
                            <span className="text-neutral-500">Hero Headline:</span>
                            <span className="truncate max-w-[240px]">
                              {expandedDetails[v.id].data.hero?.megaHeadingLine1 || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-soft-linen/50">
                            <span className="text-neutral-500">Team Count:</span>
                            <span>{(expandedDetails[v.id].data.team || []).length} members</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-soft-linen/50">
                            <span className="text-neutral-500">FAQs Count:</span>
                            <span>{(expandedDetails[v.id].data.faqs || []).length} questions</span>
                          </div>
                          <div className="flex justify-between py-0.5">
                            <span className="text-neutral-500">Timestamp:</span>
                            <span className="truncate">{expandedDetails[v.id].data.lastUpdated}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2 text-center text-neutral-400">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-soft-linen bg-white flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-dusty-olive" />
            Automatic snapshot on every publish
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-neutral-700 hover:text-carbon-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

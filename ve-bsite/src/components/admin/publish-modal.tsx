'use client';

import React, { useState, useMemo } from 'react';
import { SiteCmsData } from '@/lib/cms/types';
import { computeCmsDiff } from '@/lib/cms/cms-diff';
import { UploadCloud, X, Sparkles, AlertCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
  isPublishing: boolean;
  draftData: SiteCmsData;
  savedData: SiteCmsData;
}

export function PublishModal({
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
  draftData,
  savedData,
}: PublishModalProps) {
  const [note, setNote] = useState('');

  // Compute live differences
  const { summary, tags } = useMemo(() => {
    return computeCmsDiff(savedData, draftData);
  }, [savedData, draftData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-elevated border border-soft-linen max-w-lg w-full overflow-hidden text-carbon-black animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-soft-linen bg-snow">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dusty-olive/15 text-dusty-olive-dark flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-carbon-black">Publish to Live Site</h2>
              <p className="text-xs text-neutral-500">Create a permanent version snapshot and update veapp.store</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="text-neutral-400 hover:text-carbon-black p-1 rounded-md hover:bg-soft-linen/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Detected Changes Box */}
          <div className="bg-soft-linen/30 border border-soft-linen rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-dusty-olive" />
                Detected Changes ({summary.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-dusty-olive/15 text-dusty-olive-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
              {summary.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Version Note Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Version Note / Changelog description <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`e.g. ${summary[0] || 'Updated content & team'}`}
              disabled={isPublishing}
              className="w-full px-3.5 py-2 text-xs bg-snow border border-soft-linen rounded-lg focus:outline-none focus:border-dusty-olive focus:ring-1 focus:ring-dusty-olive transition-colors"
              autoFocus
            />
            <p className="text-[11px] text-neutral-500">
              This note will be saved in your Version History so you can trace or rollback changes later.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPublishing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPublishing}
              className="font-semibold shadow-elevated"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              {isPublishing ? 'Publishing & Revalidating...' : 'Confirm & Publish Live'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

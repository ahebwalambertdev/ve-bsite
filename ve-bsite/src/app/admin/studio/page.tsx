'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SiteCmsData } from '@/lib/cms/types';
import { DEFAULT_CMS_DATA } from '@/lib/cms/defaults';
import { StudioHeader, ViewportMode } from '@/components/admin/studio-header';
import { EditorPanel } from '@/components/admin/editor-panel';
import { ViewportPreview } from '@/components/admin/viewport-preview';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 've_visual_cms_draft_v1';

export default function VisualStudioPage() {
  const [draftData, setDraftData] = useState<SiteCmsData>(DEFAULT_CMS_DATA);
  const [savedData, setSavedData] = useState<SiteCmsData>(DEFAULT_CMS_DATA);
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 1. Fetch initial live data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/content');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSavedData(json.data);

            // Check if there is a local draft
            const savedDraftStr = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedDraftStr) {
              try {
                const parsedDraft = JSON.parse(savedDraftStr);
                setDraftData(parsedDraft);
                setNotification({
                  type: 'info',
                  message: 'Restored your unpublished local changes from previous session.',
                });
                return;
              } catch {
                // Ignore parse errors and use server data
              }
            }

            setDraftData(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load initial CMS data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // 2. Persist draft changes to localStorage
  const handleDraftChange = useCallback((updated: SiteCmsData) => {
    setDraftData(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // quota or private mode fallback
    }
  }, []);

  // 3. Compute dirty/unsaved state
  const hasUnsavedChanges = JSON.stringify(draftData) !== JSON.stringify(savedData);

  // 4. Publish changes to live site
  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setNotification(null);

      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSavedData(draftData);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setNotification({
          type: 'success',
          message: 'Published to live site! Pages have been revalidated.',
        });
      } else {
        setNotification({
          type: 'error',
          message: json.error || 'Failed to publish changes.',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Publish network error';
      setNotification({
        type: 'error',
        message,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // 5. Discard draft
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all unpublished draft changes?')) {
      setDraftData(savedData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setNotification({
        type: 'info',
        message: 'Draft discarded. Reverted to live version.',
      });
    }
  };

  // Auto-dismiss notification after 5s
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-snow flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 text-dusty-olive animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-carbon-black/60">
          Loading Ve Visual Studio...
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-snow text-carbon-black">
      {/* 1. Top Studio Header */}
      <StudioHeader
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        hasUnsavedChanges={hasUnsavedChanges}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
        lastPublishedTime={savedData.lastUpdated}
      />

      {/* Optional Notification Toast */}
      {notification && (
        <div className="absolute top-18 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-elevated text-xs font-medium bg-carbon-black text-snow border border-neutral-700 animate-in fade-in slide-in-from-top-2 duration-200">
          {notification.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-dusty-olive shrink-0" />
          )}
          {notification.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          {notification.type === 'info' && (
            <RefreshCw className="w-4 h-4 text-neutral-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 2. Main Studio Workspace: Editor Panel (Left) + Viewport Mirror (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Dynamic CMS Editor Panel */}
        <EditorPanel
          data={draftData}
          onChange={handleDraftChange}
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
        />

        {/* Right Side: Interactive Viewport Preview */}
        <ViewportPreview
          currentRoute={currentRoute}
          onRouteChange={setCurrentRoute}
          viewportMode={viewportMode}
          draftData={draftData}
        />
      </div>
    </div>
  );
}

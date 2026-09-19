'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ViewportMode } from './studio-header';
import { SiteCmsData } from '@/lib/cms/types';
import { RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ViewportPreviewProps {
  currentRoute: string;
  onRouteChange?: (route: string) => void;
  viewportMode: ViewportMode;
  draftData: SiteCmsData;
}

export function ViewportPreview({
  currentRoute,
  onRouteChange,
  viewportMode,
  draftData,
}: ViewportPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [isFrameLoading, setIsFrameLoading] = useState(true);

  // Sync draft data to iframe via postMessage whenever draftData changes
  useEffect(() => {
    const postUpdate = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'CMS_DRAFT_UPDATE',
            payload: draftData,
          },
          '*'
        );
      }
    };

    postUpdate();
  }, [draftData]);

  // Synchronize route changes from parent to preview iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'NAVIGATE_TO_ROUTE',
          route: currentRoute,
        },
        '*'
      );
    }
  }, [currentRoute]);

  // Listen for iframe readiness and navigation events from web portal
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'PREVIEW_READY') {
        setIsFrameLoading(false);
        // Dispatch draft data immediately
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 'CMS_DRAFT_UPDATE',
              payload: draftData,
            },
            '*'
          );
        }
      } else if (event.data.type === 'PORTAL_NAVIGATED') {
        const navigatedRoute = event.data.route;
        if (navigatedRoute && onRouteChange) {
          onRouteChange(navigatedRoute);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [draftData, onRouteChange]);

  const previewUrl = `/admin/preview?route=${encodeURIComponent(currentRoute)}`;

  const reloadIframe = () => {
    setIsFrameLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = previewUrl;
    }
  };

  // Dimensions based on mode
  let frameWidth = '100%';
  let frameHeight = '100%';
  let containerClasses = 'w-full h-full';

  if (viewportMode === 'mobile') {
    frameWidth = '390px';
    frameHeight = '844px';
    containerClasses = 'flex justify-center items-start pt-6 pb-24 px-4 overflow-y-auto no-scrollbar';
  } else if (viewportMode === 'tablet') {
    frameWidth = '768px';
    frameHeight = '1024px';
    containerClasses = 'flex justify-center items-start pt-6 pb-24 px-4 overflow-y-auto no-scrollbar';
  }

  return (
    <main className="flex-1 h-full bg-[#EDE8E1] relative flex flex-col overflow-hidden select-none">
      {/* Viewport Control Bar */}
      <div className="h-9 bg-snow border-b border-soft-linen px-4 flex items-center justify-between text-xs text-neutral-500 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase text-dusty-olive-dark font-semibold">
            {viewportMode === 'mobile' ? 'iPhone 15 / 390 × 844' : viewportMode === 'tablet' ? 'iPad / 768 × 1024' : 'Desktop / Responsive'}
          </span>
          <span className="text-neutral-300">·</span>
          <span className="text-[11px] text-neutral-600 font-mono">
            veapp.store{currentRoute}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-soft-linen/50 rounded px-1 py-0.5">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              title="Zoom Out"
              className="p-1 hover:text-carbon-black cursor-pointer"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.2, s + 0.1))}
              title="Zoom In"
              className="p-1 hover:text-carbon-black cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setScale(1)}
              title="Reset Zoom"
              className="p-1 hover:text-carbon-black cursor-pointer text-[10px]"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={reloadIframe}
            title="Reload viewport frame"
            className="p-1 hover:text-carbon-black transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFrameLoading ? 'animate-spin text-dusty-olive' : ''}`} />
          </button>
        </div>
      </div>

      {/* Viewport Frame Canvas */}
      <div className={`flex-1 ${containerClasses}`}>
        {viewportMode === 'mobile' ? (
          /* Realistic Smartphone Bezel Mockup */
          <div
            style={{
              width: frameWidth,
              height: frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
            className="relative bg-carbon-black rounded-[48px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[3px] border-neutral-800 transition-transform duration-150 shrink-0 my-2"
          >
            {/* Subtle speaker in top outer bezel (does not obstruct screen content) */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-neutral-700/80 rounded-full pointer-events-none" />

            {/* Screen Container */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-snow relative no-scrollbar">
              <iframe
                ref={iframeRef}
                src={previewUrl}
                title="Live Mobile Viewport"
                className="w-full h-full border-0 no-scrollbar"
              />
            </div>

            {/* Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-400/60 rounded-full pointer-events-none z-10" />
          </div>
        ) : viewportMode === 'tablet' ? (
          /* Tablet Bezel */
          <div
            style={{
              width: frameWidth,
              height: frameHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
            className="relative bg-neutral-900 rounded-[32px] p-3 shadow-2xl border-4 border-neutral-800 transition-transform duration-150 shrink-0"
          >
            <div className="w-full h-full rounded-[24px] overflow-hidden bg-snow no-scrollbar">
              <iframe
                ref={iframeRef}
                src={previewUrl}
                title="Live Tablet Viewport"
                className="w-full h-full border-0 no-scrollbar"
              />
            </div>
          </div>
        ) : (
          /* Desktop Browser Window Frame */
          <div
            style={{
              width: '100%',
              height: '100%',
              transform: scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: 'top left',
            }}
            className="w-full h-full bg-snow overflow-hidden flex flex-col shadow-inner"
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Live Desktop Viewport"
              className="w-full h-full border-0 flex-1"
            />
          </div>
        )}
      </div>
    </main>
  );
}

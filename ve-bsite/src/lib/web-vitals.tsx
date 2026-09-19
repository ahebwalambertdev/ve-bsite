'use client';

import { useReportWebVitals } from 'next/web-vitals';

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      params: Record<string, string | number | boolean>
    ) => void;
  }
}

/**
 * Web Vitals Reporter
 * Listens for Core Web Vitals (LCP, INP, CLS, FCP, TTFB) and reports to GA4 if enabled.
 * Operates purely asynchronously on client idle.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Forward to GA4 if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // In dev mode, log to console for diagnostic monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
    }
  });

  return null;
}

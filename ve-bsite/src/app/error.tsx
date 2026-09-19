'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log masked telemetry with correlation ID, never exposing database internals
    console.error('[Error Boundary Caught]:', {
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-snow border border-soft-linen rounded-2xl p-8 text-center shadow-subtle">
        <div className="w-12 h-12 rounded-full bg-soft-linen/60 text-carbon-black flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-dusty-olive" />
        </div>

        <h1 className="font-serif text-2xl font-semibold text-carbon-black tracking-tight mb-2">
          Something went wrong
        </h1>
        
        <p className="text-sm text-carbon-black/70 mb-6 leading-relaxed">
          We encountered an unexpected connection delay or display error. Our engineering team has been notified.
        </p>

        {error.digest && (
          <div className="inline-block px-3 py-1 bg-soft-linen/40 rounded text-xs font-mono text-carbon-black/60 mb-6">
            Ref: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

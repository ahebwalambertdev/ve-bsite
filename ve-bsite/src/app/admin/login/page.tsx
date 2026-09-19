'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/studio';

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to intended admin destination
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || 'Access denied. Incorrect passcode.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo className="h-6 w-auto text-carbon-black" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 font-semibold pl-2 border-l border-neutral-300">
            Internal
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-medium text-neutral-500 hover:text-carbon-black transition-colors"
        >
          ← Return to veapp.store
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-10">
        <div className="bg-snow rounded-2xl border border-soft-linen shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-soft-linen/50 text-dusty-olive mb-1">
              <Lock className="w-5 h-5 text-dusty-olive-dark" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-carbon-black tracking-tight">
              Ve Studio Access
            </h1>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Enter the authorized passcode to access the Visual CMS Studio and manage live content.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="passcode"
                className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 block"
              >
                Passcode
              </label>
              <div className="relative">
                <input
                  id="passcode"
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  autoFocus
                  required
                  placeholder="••••••••••••"
                  className="w-full text-sm p-3 rounded-lg border border-soft-linen bg-white text-carbon-black placeholder:text-neutral-400 focus:ring-2 focus:ring-dusty-olive/30 focus:border-dusty-olive outline-none transition-all pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !passcode.trim()}
              variant="primary"
              size="lg"
              className="w-full justify-center h-11 text-xs uppercase tracking-wider font-semibold gap-2 mt-2 shadow-subtle"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Unlock Studio
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-2 border-t border-soft-linen flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-dusty-olive" />
            <span>Encrypted Edge Session · 30-Day Pass</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full text-center text-[11px] text-neutral-400 py-2">
        <span>© {new Date().getFullYear()} Ve Technologies Ltd. Internal administration.</span>
      </div>
    </div>
  );
}

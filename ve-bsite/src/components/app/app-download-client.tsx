'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Apple, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Sparkles,
  ArrowRight,
  Store,
  Share2,
  Clock
} from 'lucide-react';

interface AppDownloadClientProps {
  initialRef?: string;
}

export function AppDownloadClient({ initialRef }: AppDownloadClientProps) {
  const [platform, setPlatform] = useState<'ios' | 'android'>('android');
  const [role, setRole] = useState<'shopper' | 'vendor'>('shopper');
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState<string>(initialRef || '');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Detect platform from userAgent
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else {
      setPlatform('android');
    }

    // 2. Capture referral code from URL search parameters if present
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref') || params.get('utm_source');
    if (refParam) {
      setReferralCode(refParam);
      document.cookie = `ve_ref=${encodeURIComponent(refParam)}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
      try {
        localStorage.setItem('ve_ref', refParam);
      } catch {
        // LocalStorage fallback silently ignored
      }
    } else {
      const match = document.cookie.match(/(^|;)\s*ve_ref=([^;]+)/);
      if (match) {
        setReferralCode(decodeURIComponent(match[2]));
      }
    }

    // Check if user previously joined
    const saved = localStorage.getItem('ve_waitlist_joined');
    if (saved) {
      setIsSubmitted(true);
    }
  }, []);

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    // Simulate lightweight optimistic submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem(
          've_waitlist_joined',
          JSON.stringify({
            name,
            contact,
            platform,
            role,
            ref: referralCode,
            joinedAt: new Date().toISOString(),
          })
        );
      } catch {
        // storage ignored
      }
    }, 600);
  };

  return (
    <div className="space-y-12">
      {/* Referral Banner if Active */}
      {referralCode && (
        <div className="bg-soft-linen/50 border border-dusty-olive/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-dusty-olive flex-shrink-0" />
            <span>
              Invited by ambassador or boutique:{' '}
              <strong className="text-carbon-black font-semibold uppercase">{referralCode}</strong>
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="text-xs font-medium text-dusty-olive-dark hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copied ? 'Copied code!' : 'Copy invite code'}
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Waiting List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Coming Soon & Waiting List Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-tight">
              Wear what fits.
              <br />
              <span className="italic">Delivered safely to your door.</span>
            </h1>

            <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
              We&apos;re putting the finishing touches on the Ve mobile app for Kampala. Join the early access waiting list to get free Try-On credits and be among the first to try on outfits virtually before paying.
            </p>
          </div>

          {/* Interactive Form or Confirmation State */}
          {!isSubmitted ? (
            <Card className="p-6 sm:p-7 border-soft-linen shadow-subtle bg-snow">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-carbon-black">
                    Join the Early Access List
                  </h3>
                  <p className="text-xs text-carbon-black/60">
                    Get an invite link as soon as private beta testing opens in Kampala.
                  </p>
                </div>

                {/* Device Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    Preferred Device
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPlatform('android')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        platform === 'android'
                          ? 'border-dusty-olive bg-dusty-olive/10 text-carbon-black ring-1 ring-dusty-olive'
                          : 'border-soft-linen bg-snow text-carbon-black/70 hover:border-carbon-black/30'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-dusty-olive" />
                      Android (Play Store &amp; APK)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlatform('ios')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        platform === 'ios'
                          ? 'border-dusty-olive bg-dusty-olive/10 text-carbon-black ring-1 ring-dusty-olive'
                          : 'border-soft-linen bg-snow text-carbon-black/70 hover:border-carbon-black/30'
                      }`}
                    >
                      <Apple className="w-4 h-4 text-dusty-olive" />
                      iOS (iPhone / iPad)
                    </button>
                  </div>
                </div>

                {/* Contact Input (WhatsApp or Email) */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-input" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    Phone (WhatsApp) or Email
                  </label>
                  <input
                    id="contact-input"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. 0772 000 000 or your@email.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-carbon-black/50">
                    We only send launch invites and beta codes. No spam, ever.
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    I am joining as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('shopper')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                        role === 'shopper'
                          ? 'border-carbon-black bg-carbon-black text-snow'
                          : 'border-soft-linen bg-snow text-carbon-black/70 hover:border-carbon-black/30'
                      }`}
                    >
                      Shopper (Explore Fashion)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('vendor')}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                        role === 'vendor'
                          ? 'border-carbon-black bg-carbon-black text-snow'
                          : 'border-soft-linen bg-snow text-carbon-black/70 hover:border-carbon-black/30'
                      }`}
                    >
                      Ve-ndor (Boutique Owner)
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:min-w-[220px] justify-center shadow-subtle hover:shadow-md cursor-pointer"
                  >
                    {isSubmitting ? 'Securing your spot...' : 'Join Waiting List'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-neutral-500 text-center sm:text-right">
                    Early access includes free Try-On credits
                  </p>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 border-dusty-olive/40 bg-soft-linen/20 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-carbon-black">
                    You&apos;re on the early access list!
                  </h3>
                  <p className="text-sm text-carbon-black/75 leading-relaxed">
                    Thank you for joining. We will notify you at <strong className="text-carbon-black">{contact || 'your contact'}</strong> as soon as the {platform === 'ios' ? 'iOS TestFlight' : 'Android Beta'} release goes live in Kampala.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-snow rounded-xl border border-soft-linen space-y-2 text-xs text-carbon-black/70">
                <div className="font-semibold text-carbon-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-dusty-olive" />
                  Early Member Perks Unlocked:
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Free Try-On silhouettes on launch</li>
                  <li>First access to limited boutique drop notifications</li>
                  <li>Zero delivery fee on your first verified order</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-dusty-olive-dark hover:underline cursor-pointer"
                >
                  Edit details or switch device
                </button>

                <Link href="/sell" className="font-semibold text-carbon-black hover:text-dusty-olive flex items-center gap-1">
                  Are you a boutique? Become a Ve-ndor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          )}

          {/* Safety & Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-soft-linen">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">Protected Payments</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">Check Before You Pay</span>
            </div>
            <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">Safe Mobile Money</span>
            </div>
          </div>
        </div>

        {/* Right Column: Vendor Invitation Card & Early Access Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vendor Onboarding Highlight Card */}
          <Card className="p-6 sm:p-7 border-soft-linen shadow-subtle bg-carbon-black text-snow space-y-5">
            <div className="w-10 h-10 rounded-lg bg-soft-linen/20 text-snow flex items-center justify-center">
              <Store className="w-5 h-5 text-dusty-olive-light" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-normal tracking-tight text-snow">
                Do you run a fashion boutique in Kampala?
              </h3>
              <p className="text-xs sm:text-sm text-snow/75 leading-relaxed">
                While the consumer app is being polished, merchant onboarding is open now. Get your boutique verified and catalog ready ahead of launch day.
              </p>
            </div>

            <div className="space-y-2.5 pt-1 text-xs text-snow/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                <span>Zero upfront setup fees or listing costs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                <span>Doorstep order pickups right from your shop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                <span>Immediate Mobile Money payouts on delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/sell" className="block w-full">
                <Button variant="accent" size="md" className="w-full justify-center font-semibold">
                  Become a Ve-ndor
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Invitation Card for Sharing */}
          <Card className="p-5 border-dashed border-soft-linen bg-soft-linen/30 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-carbon-black">
              <Share2 className="w-3.5 h-3.5 text-dusty-olive" />
              Spread the word in Kampala
            </div>
            <p className="text-xs text-carbon-black/65">
              Know someone tired of wrong sizes and downtown bargaining? Share the Ve waiting list with them.
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText('https://veapp.store/app');
                    alert('Waiting list link copied to clipboard!');
                  }
                }}
                className="text-xs font-semibold text-dusty-olive-dark hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy veapp.store/app share link
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

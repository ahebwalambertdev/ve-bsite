'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Store, 
  Share2, 
  Clock,
  Gift,
  Check
} from 'lucide-react';

function AndroidIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0001s.4482-1.0001.9993-1.0001c.551 0 .9992.4486.9992 1.0001s-.4482 1.0001-.9992 1.0001m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0001s.4482-1.0001.9993-1.0001c.5511 0 .9993.4486.9993 1.0001s-.4482 1.0001-.9993 1.0001m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.4114 13.8533 8.084 12 8.084c-1.8533 0-3.5902.3274-5.1368.8657L4.841 5.4467a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.152.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  );
}

function AppleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.64-1.24z" />
    </svg>
  );
}

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

  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyStep, setSurveyStep] = useState(0);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);

  // Validation answers
  const [shoppingHabits, setShoppingHabits] = useState<string[]>([]);
  const [onlineFrustration, setOnlineFrustration] = useState('');
  const [styleCategories, setStyleCategories] = useState<string[]>([]);
  const [tryOnExcitement, setTryOnExcitement] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');

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

    // Check if user previously joined or completed survey
    try {
      const saved = localStorage.getItem('ve_waitlist_joined');
      if (saved) {
        setIsSubmitted(true);
        const parsed = JSON.parse(saved);
        if (parsed?.contact) setContact(parsed.contact);
      }
      const savedSurvey = localStorage.getItem('ve_customer_preferences');
      if (savedSurvey) {
        setSurveyCompleted(true);
      }
    } catch {
      // Ignored
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

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSurveySubmitting(true);
    setTimeout(() => {
      setIsSurveySubmitting(false);
      setSurveyCompleted(true);
      setShowSurvey(false);
      try {
        localStorage.setItem(
          've_customer_preferences',
          JSON.stringify({
            contact,
            shoppingHabits,
            onlineFrustration,
            styleCategories,
            tryOnExcitement,
            deliveryArea,
            voucherUnlocked: true,
            submittedAt: new Date().toISOString(),
          })
        );
      } catch {
        // storage ignored
      }
    }, 500);
  };

  const toggleShoppingHabit = (val: string) => {
    setShoppingHabits((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const toggleStyleCategory = (val: string) => {
    setStyleCategories((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
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
              We&apos;re putting the finishing touches on the Ve mobile app for Kampala. Join the early access waiting list to get free Try-On credits and be among the first to see how outfits look before you order.
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
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-carbon-black/50">
                    We only send launch invites and beta codes. No spam, ever.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
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

                {/* Separated Boutique Note */}
                <div className="pt-2 text-center sm:text-left border-t border-soft-linen/70">
                  <p className="text-xs text-carbon-black/70">
                    Are you a boutique or thrift curator?{' '}
                    <Link href="/vendor" className="font-semibold text-dusty-olive-dark hover:underline">
                      Apply as a Ve-ndor here →
                    </Link>
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

              {/* Special Early Adopter Perk: Free First Delivery Question-by-Question Form */}
              {surveyCompleted ? (
                <div className="p-5 bg-snow rounded-xl border-2 border-dusty-olive shadow-subtle space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-dusty-olive-dark font-semibold">
                        Early Member Voucher
                      </span>
                      <h4 className="font-serif text-lg font-semibold text-carbon-black">
                        100% Free First Delivery Unlocked!
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-carbon-black/75 leading-relaxed">
                    Your contact (<strong className="text-carbon-black">{contact || 'your contact'}</strong>) is credited with a free first delivery voucher across Kampala. We&apos;ll SMS/WhatsApp your voucher code when private beta opens.
                  </p>
                  <div className="flex items-center gap-2 p-2.5 bg-soft-linen/30 rounded-lg border border-soft-linen text-xs font-mono text-carbon-black">
                    <Gift className="w-4 h-4 text-dusty-olive" />
                    <span>VOUCHER: <strong>VE-FIRST-FREE</strong> (Active for {deliveryArea || 'Kampala'})</span>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSurveyStep(0);
                        setShowSurvey(true);
                      }}
                      className="text-xs text-dusty-olive-dark hover:underline font-medium cursor-pointer"
                    >
                      Review or update preferences →
                    </button>
                  </div>
                </div>
              ) : showSurvey ? (
                <div className="p-5 sm:p-6 bg-snow rounded-xl border border-dusty-olive/60 shadow-subtle space-y-4">
                  {/* Gamified Progress Bar & Milestone Header */}
                  <div className="space-y-2 border-b border-soft-linen pb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-carbon-black flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-dusty-olive" />
                        Question {surveyStep + 1} of 5
                      </span>
                      <span className="font-mono font-medium text-dusty-olive-dark bg-dusty-olive/10 px-2.5 py-0.5 rounded-full text-[11px]">
                        {Math.round(((surveyStep + 1) / 5) * 100)}% to Free Delivery
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full bg-soft-linen rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-dusty-olive h-full rounded-full"
                        initial={false}
                        animate={{ width: `${Math.round(((surveyStep + 1) / 5) * 100)}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>

                    {/* Gamified Prize Motivation Line */}
                    <p className="text-[11px] text-neutral-600 font-medium pt-0.5">
                      {surveyStep === 0 && '🎁 Step 1 of 5: Where do you usually buy clothes in Kampala?'}
                      {surveyStep === 1 && '🎁 Step 2 of 5: What is your biggest headache when shopping online?'}
                      {surveyStep === 2 && '🎁 Step 3 of 5: Halfway! What fashion styles are you eager to browse on Ve?'}
                      {surveyStep === 3 && '🎁 Step 4 of 5: Almost there! What excites you most about Try-On on your phone?'}
                      {surveyStep === 4 && '🎉 Final Step: What neighborhood in Kampala should we deliver your order to?'}
                    </p>
                  </div>

                  <form onSubmit={handleSurveySubmit} className="space-y-4 text-xs">
                    <AnimatePresence mode="wait">
                      {/* STEP 0: Shopping Habits */}
                      {surveyStep === 0 && (
                        <motion.div
                          key="step-0"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            Where do you usually buy clothes in Kampala?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Select all that apply
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Downtown Arcades (Gazaland, Pioneer, Mukwano)',
                              'Boutiques in Ntinda, Kisementi, Bugolobi',
                              'Instagram & WhatsApp DM sellers',
                              'Shein & overseas cargo brokers',
                              'Curated thrift & Owino market',
                            ].map((item) => (
                              <label
                                key={item}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  shoppingHabits.includes(item)
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={shoppingHabits.includes(item)}
                                  onChange={() => toggleShoppingHabit(item)}
                                  className="accent-dusty-olive rounded w-4 h-4"
                                />
                                <span>{item}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 1: Online Frustration */}
                      {surveyStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            What is your biggest headache when shopping online?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Pick your single biggest challenge
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Sizes are wrong or fit poorly',
                              'What arrives looks nothing like the photo',
                              'Waiting 2-4 weeks for overseas delivery',
                              'Impossible returns / sellers ghosting after payment',
                              'Expensive delivery charges',
                            ].map((frust) => (
                              <label
                                key={frust}
                                onClick={() => setOnlineFrustration(frust)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  onlineFrustration === frust
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium ring-1 ring-dusty-olive'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="online-frustration"
                                  value={frust}
                                  checked={onlineFrustration === frust}
                                  onChange={() => setOnlineFrustration(frust)}
                                  className="accent-dusty-olive w-4 h-4"
                                />
                                <span>{frust}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: Style Categories */}
                      {surveyStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            What styles are you most eager to browse on Ve?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Choose all you like to wear
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Everyday casual & streetwear',
                              'Office, blazer & workwear dresses',
                              'Ceremony & wedding outfits (Kwanjula/party)',
                              'Footwear, sneakers & heels',
                              'Bags, jewelry & accessories',
                            ].map((cat) => (
                              <label
                                key={cat}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  styleCategories.includes(cat)
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={styleCategories.includes(cat)}
                                  onChange={() => toggleStyleCategory(cat)}
                                  className="accent-dusty-olive rounded w-4 h-4"
                                />
                                <span>{cat}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: Try-On Excitement */}
                      {surveyStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            What excites you most about Try-On on your phone?
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Seeing if an outfit matches my body and style before paying',
                              'Trying multiple outfits in seconds without undressing',
                              'Never wasting money on clothes that end up unworn in my closet',
                            ].map((reason) => (
                              <label
                                key={reason}
                                onClick={() => setTryOnExcitement(reason)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  tryOnExcitement === reason
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium ring-1 ring-dusty-olive'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="tryon-excitement"
                                  value={reason}
                                  checked={tryOnExcitement === reason}
                                  onChange={() => setTryOnExcitement(reason)}
                                  className="accent-dusty-olive w-4 h-4"
                                />
                                <span>{reason}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: Delivery Area */}
                      {surveyStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label htmlFor="delivery-area-input" className="font-semibold text-carbon-black block text-sm">
                            What neighborhood in Kampala do you receive packages in?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Type your area or tap a popular zone below
                            </span>
                          </label>
                          <input
                            id="delivery-area-input"
                            type="text"
                            required
                            value={deliveryArea}
                            onChange={(e) => setDeliveryArea(e.target.value)}
                            placeholder="e.g. Ntinda, Kololo, Kira, Najjera, Entebbe Road..."
                            className="w-full px-3.5 py-2.5 rounded-lg border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive text-xs"
                          />
                          <div className="pt-1 space-y-1">
                            <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block">
                              Quick tap:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {['Ntinda', 'Kololo', 'Kisementi', 'Bugolobi', 'Naalya', 'Kira', 'Kampala Central', 'Entebbe Rd'].map((place) => (
                                <button
                                  key={place}
                                  type="button"
                                  onClick={() => setDeliveryArea(place)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                                    deliveryArea === place
                                      ? 'bg-dusty-olive text-snow border-dusty-olive font-medium'
                                      : 'bg-soft-linen/30 border-soft-linen text-carbon-black/80 hover:bg-soft-linen/70'
                                  }`}
                                >
                                  {place}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step Navigation Controls */}
                    <div className="pt-3 flex items-center justify-between gap-2 border-t border-soft-linen">
                      {surveyStep > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSurveyStep((s) => s - 1)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-carbon-black cursor-pointer px-2 py-1 rounded"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Back
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowSurvey(false)}
                          className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer"
                        >
                          Maybe later
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        {surveyStep < 4 ? (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={
                              (surveyStep === 0 && shoppingHabits.length === 0) ||
                              (surveyStep === 1 && !onlineFrustration) ||
                              (surveyStep === 2 && styleCategories.length === 0) ||
                              (surveyStep === 3 && !tryOnExcitement)
                            }
                            onClick={() => setSurveyStep((s) => s + 1)}
                            className="font-semibold cursor-pointer"
                          >
                            Next Question
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="accent"
                            size="sm"
                            disabled={!deliveryArea.trim() || isSurveySubmitting}
                            className="font-semibold cursor-pointer"
                          >
                            {isSurveySubmitting ? 'Unlocking Voucher...' : 'Claim Free First Delivery 🎁'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-5 bg-snow rounded-xl border border-dusty-olive/50 shadow-subtle space-y-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-dusty-olive-dark bg-soft-linen/50 px-2 py-0.5 rounded-full">
                      <Gift className="w-3 h-3 text-dusty-olive" />
                      Early Adopter Perk
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-carbon-black">
                      Want Free First Delivery on Launch Day?
                    </h4>
                    <p className="text-xs text-carbon-black/70 leading-relaxed">
                      Complete our 60-second Style &amp; Delivery Preferences so our verified boutiques stock what you actually want. We&apos;ll credit your contact with 100% free delivery across Kampala on your first order.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setSurveyStep(0);
                      setShowSurvey(true);
                    }}
                    variant="accent"
                    size="sm"
                    className="w-full sm:w-auto font-semibold cursor-pointer"
                  >
                    Claim Free First Delivery →
                  </Button>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-dusty-olive-dark hover:underline cursor-pointer"
                >
                  Change phone or email
                </button>

                <Link href="/vendor" className="font-semibold text-carbon-black hover:text-dusty-olive flex items-center gap-1">
                  Are you a boutique? Apply as a Ve-ndor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          )}

          {/* Safety & Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-soft-linen">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">Try Before Buying</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">48-Hour Returns</span>
            </div>
            <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
              <span className="text-xs text-carbon-black/70">Same-Day Delivery</span>
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
              <Link href="/vendor" className="block w-full">
                <Button variant="accent" size="md" className="w-full justify-center font-semibold">
                  Apply as a Ve-ndor
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Store,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Bike,
  Banknote,
  Camera,
  Layers,
  Check,
  Award
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact';

const KAMPALA_LOCATIONS = [
  'Downtown Arcade (Gazaland, Pioneer Mall, Park Enkadde, Mukwano)',
  'Ntinda / Bukoto / Naguru',
  'Kisementi / Kololo / Kamwokya',
  'St. Balikuddembe (Owino) / Downtown Curators',
  'Wandegeya / Makerere / Nakasero',
  'Bugolobi / MoTIV Area',
  'Greater Suburbs (Kira, Najjera, Entebbe Road, Mukono)',
  'Online Only / Home-Based Boutique'
];

const FASHION_CATEGORIES = [
  "Women's Fashion & Dresses",
  "Men's Streetwear & Casual",
  "Curated Thrift & Vintage (Grade-A Mitumba)",
  "Shoes, Bags & Accessories",
  "Tailored & Ceremony Wear (Ready-to-Wear)",
  "Mixed / Full Wardrobe Boutique"
];

export function VendorApplicationClient() {
  const [boutiqueName, setBoutiqueName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState(KAMPALA_LOCATIONS[0]);
  const [category, setCategory] = useState(FASHION_CATEGORIES[0]);
  const [socialHandle, setSocialHandle] = useState('');
  const [stockSize, setStockSize] = useState('50 - 200 items');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Operations Profile (Tier 2 Unlock) State
  const [showOperationsProfile, setShowOperationsProfile] = useState(false);
  const [operationsStep, setOperationsStep] = useState(0);
  const [operationsCompleted, setOperationsCompleted] = useState(false);
  const [isOperationsSubmitting, setIsOperationsSubmitting] = useState(false);

  const [primarySalesChannel, setPrimarySalesChannel] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [topToolDesired, setTopToolDesired] = useState('');
  const [portalToolsDesired, setPortalToolsDesired] = useState<string[]>([]);
  const [customFeatureWish, setCustomFeatureWish] = useState('');

  const togglePortalTool = (tool: string) => {
    setPortalToolsDesired((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ve_vendor_application');
      if (saved) {
        setIsSubmitted(true);
        const parsed = JSON.parse(saved);
        if (parsed?.boutiqueName) setBoutiqueName(parsed.boutiqueName);
        if (parsed?.ownerName) setOwnerName(parsed.ownerName);
        if (parsed?.whatsapp) setWhatsapp(parsed.whatsapp);
        if (parsed?.location) setLocation(parsed.location);
      }
      const savedOps = localStorage.getItem('ve_vendor_operations_profile');
      if (savedOps) {
        setOperationsCompleted(true);
      }
    } catch {
      // Storage ignored
    }
  }, []);

  const handleOperationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOperationsSubmitting(true);

    // 1. Optimistic Local Persistence
    try {
      localStorage.setItem(
        've_vendor_operations_profile',
        JSON.stringify({
          boutiqueName,
          whatsapp,
          primarySalesChannel,
          biggestChallenge,
          topToolDesired,
          portalToolsDesired,
          customFeatureWish,
          growthTierUnlocked: true,
          submittedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Storage ignored
    }

    // 2. Background Database Ingestion via API
    try {
      await fetch('/api/leads/vendor-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boutiqueName,
          whatsapp,
          primarySalesChannel,
          biggestChallenge,
          topToolDesired,
          portalToolsDesired,
          customFeatureWish,
          inventoryTracking: primarySalesChannel,
          doubleSellingFrequency: biggestChallenge,
          photographyMethod: portalToolsDesired.join(', '),
          shrinkageIssue: customFeatureWish,
        }),
      });
    } catch (err) {
      console.warn('[Vendor Ops Profile] Background sync error (saved locally):', err);
    } finally {
      setIsOperationsSubmitting(false);
      setOperationsCompleted(true);
      setShowOperationsProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boutiqueName.trim() || !whatsapp.trim() || !ownerName.trim()) {
      return;
    }

    setIsSubmitting(true);

    // 1. Optimistic Local Persistence
    try {
      localStorage.setItem(
        've_vendor_application',
        JSON.stringify({
          boutiqueName,
          ownerName,
          whatsapp,
          location,
          category,
          socialHandle,
          stockSize,
          submittedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Storage ignored
    }

    // 2. Background Database Ingestion via API
    try {
      await fetch('/api/leads/vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boutiqueName,
          ownerName,
          whatsapp,
          location,
          category,
          socialHandle,
          stockSize,
        }),
      });
    } catch (err) {
      console.warn('[Vendor Application] Background sync error (saved locally):', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const whatsappFastTrackUrl = CONTACT_CONFIG.getWhatsappUrl(
    `Hi Ve Merchant Team, I just submitted an application for my boutique "${boutiqueName || 'My Boutique'}" in ${location}. I'd love to fast-track verification!`
  );

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dusty-olive-dark bg-soft-linen/50 px-3 py-1 rounded-full border border-soft-linen">
          <Store className="w-3.5 h-3.5" />
          Kampala Boutique Onboarding
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight leading-tight">
          Sell where Kampala shops.
          <br />
          <span className="italic">Zero upfront fees, zero delivery stress.</span>
        </h1>
        <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
          Join verified Kampala boutiques and thrift curators on Ve. We send riders to pick up packages straight from your shop counter, handle customer returns, and send your earnings straight to your Mobile Money.
        </p>
      </div>

      {/* Main Grid: Application Form + Value Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form / Success State */}
        <div className="lg:col-span-7">
          {!isSubmitted ? (
            <Card className="p-6 sm:p-8 bg-snow border-soft-linen shadow-subtle space-y-6">
              <div className="space-y-1 border-b border-soft-linen pb-4">
                <h2 className="font-serif text-2xl font-semibold text-carbon-black">
                  Boutique Application Form
                </h2>
                <p className="text-xs text-carbon-black/60">
                  Takes less than 2 minutes. Our Kampala onboarding team verifies shops within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Boutique Name */}
                <div className="space-y-1.5">
                  <label htmlFor="boutique-name" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    Boutique or Brand Name *
                  </label>
                  <input
                    id="boutique-name"
                    type="text"
                    required
                    value={boutiqueName}
                    onChange={(e) => setBoutiqueName(e.target.value)}
                    placeholder="e.g. Kololo Vintage or Glamour Vault"
                    className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                  />
                </div>

                {/* Owner & WhatsApp Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="owner-name" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Your Name *
                    </label>
                    <input
                      id="owner-name"
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Sarah Namubiru"
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp-number" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      WhatsApp Phone (MTN / Airtel) *
                    </label>
                    <input
                      id="whatsapp-number"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 0772 000 000"
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Shop Location in Kampala */}
                <div className="space-y-1.5">
                  <label htmlFor="shop-location" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    Where is your shop or stock located? *
                  </label>
                  <select
                    id="shop-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                  >
                    {KAMPALA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main Category & Stock Size Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Primary Category *
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                    >
                      {FASHION_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="stock-size" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Items In Stock
                    </label>
                    <select
                      id="stock-size"
                      value={stockSize}
                      onChange={(e) => setStockSize(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                    >
                      <option value="Under 50 items">Under 50 items</option>
                      <option value="50 - 200 items">50 - 200 items</option>
                      <option value="200+ items">200+ items</option>
                    </select>
                  </div>
                </div>

                {/* Social Media Link / Handle */}
                <div className="space-y-1.5">
                  <label htmlFor="social-handle" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                    Instagram or TikTok Page <span className="text-neutral-400 lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    id="social-handle"
                    type="text"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    placeholder="@yourboutique"
                    className="w-full px-4 py-2.5 text-sm sm:text-base rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-soft-linen">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto sm:min-w-[240px] justify-center shadow-subtle hover:shadow-md cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Vendor Application'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-neutral-500 text-center sm:text-right">
                    Zero upfront fees · Free shop counter pickup
                  </p>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 border-dusty-olive/40 bg-soft-linen/20 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-carbon-black">
                    Application Submitted!
                  </h2>
                  <p className="text-sm text-carbon-black/75 leading-relaxed">
                    Thank you for applying to sell on Ve. Our Kampala merchant team will review your boutique details and reach out on WhatsApp at <strong className="text-carbon-black">{whatsapp || 'your number'}</strong> within 24 hours.
                  </p>
                </div>
              </div>

              {/* Special Early Adopter Perk: 1 Month of Growth Package Free Question-by-Question Form */}
              {operationsCompleted ? (
                <div className="p-5 bg-snow rounded-xl border-2 border-dusty-olive shadow-subtle space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-dusty-olive-dark font-semibold">
                        Partner Perk Unlocked
                      </span>
                      <h4 className="font-serif text-lg font-semibold text-carbon-black">
                        Growth Package Unlocked Free for 1 Month!
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-carbon-black/75 leading-relaxed">
                    Your boutique (<strong className="text-carbon-black">{boutiqueName || 'Your Boutique'}</strong>) is credited with 1 month of complimentary Growth Tier access upon launch (featured catalog placement, dedicated counter pickup, and studio photo enhancement).
                  </p>
                  <div className="flex items-center gap-2 p-2.5 bg-soft-linen/30 rounded-lg border border-soft-linen text-xs font-mono text-carbon-black">
                    <Award className="w-4 h-4 text-dusty-olive" />
                    <span>STATUS: <strong>TIER-2 GROWTH TIER ACTIVATED (UGX 150,000 VALUE)</strong></span>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOperationsStep(0);
                        setShowOperationsProfile(true);
                      }}
                      className="text-xs text-dusty-olive-dark hover:underline font-medium cursor-pointer"
                    >
                      Review or update operations profile →
                    </button>
                  </div>
                </div>
              ) : showOperationsProfile ? (
                <div className="p-5 sm:p-6 bg-snow rounded-xl border border-dusty-olive/60 shadow-subtle space-y-4">
                  {/* Gamified Progress Bar & Milestone Header */}
                  <div className="space-y-2 border-b border-soft-linen pb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-carbon-black flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-dusty-olive" />
                        Question {operationsStep + 1} of 5
                      </span>
                      <span className="font-mono font-medium text-dusty-olive-dark bg-dusty-olive/10 px-2.5 py-0.5 rounded-full text-[11px]">
                        {Math.round(((operationsStep + 1) / 5) * 100)}% to Free Growth Tier
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full bg-soft-linen rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-dusty-olive h-full rounded-full"
                        initial={false}
                        animate={{ width: `${Math.round(((operationsStep + 1) / 5) * 100)}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>

                    {/* Gamified Prize Motivation Line */}
                    <p className="text-[11px] text-neutral-600 font-medium pt-0.5">
                      {operationsStep === 0 && '💼 Step 1 of 5: Where does your boutique get most of its sales right now?'}
                      {operationsStep === 1 && '📈 Step 2 of 5: What is the single hardest part of growing your clothing sales in Kampala?'}
                      {operationsStep === 2 && '✨ Step 3 of 5: Which Ve feature would create the biggest breakthrough for your boutique?'}
                      {operationsStep === 3 && '🛠️ Step 4 of 5: What tools would you use daily inside your Ve Vendor Portal?'}
                      {operationsStep === 4 && '🎯 Final Step: What specific feature do you wish existed for Kampala boutiques?'}
                    </p>
                  </div>

                  <form onSubmit={handleOperationsSubmit} className="space-y-4 text-xs">
                    <AnimatePresence mode="wait">
                      {/* STEP 0: Primary Sales Channel */}
                      {operationsStep === 0 && (
                        <motion.div
                          key="ops-step-0"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            Where does your boutique get most of its paying customers right now?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Pick your primary sales channel
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Walk-in foot traffic at our arcade or physical boutique',
                              'Instagram DMs & WhatsApp catalog orders',
                              'TikTok videos, live sessions & fashion trends',
                              'Repeat private styling clients & phone calls',
                            ].map((opt) => (
                              <label
                                key={opt}
                                onClick={() => setPrimarySalesChannel(opt)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  primarySalesChannel === opt
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium ring-1 ring-dusty-olive'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="primary-sales-channel"
                                  value={opt}
                                  checked={primarySalesChannel === opt}
                                  onChange={() => setPrimarySalesChannel(opt)}
                                  className="accent-dusty-olive w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 1: Biggest Business Bottleneck */}
                      {operationsStep === 1 && (
                        <motion.div
                          key="ops-step-1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            What is the single hardest part of growing your clothing business in Kampala?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Choose your biggest bottleneck
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Reaching new paying customers beyond our existing WhatsApp circles',
                              'Shoppers hesitating or abandoning orders over sizing and fit doubts',
                              'Boda delivery hassles, delayed pickups, and damaged delicate fabrics',
                              'Taking high-quality outfit photos without spending money on models or studios',
                              'Fake Mobile Money SMS confirmations & delayed customer payments',
                            ].map((opt) => (
                              <label
                                key={opt}
                                onClick={() => setBiggestChallenge(opt)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  biggestChallenge === opt
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium ring-1 ring-dusty-olive'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="biggest-challenge"
                                  value={opt}
                                  checked={biggestChallenge === opt}
                                  onChange={() => setBiggestChallenge(opt)}
                                  className="accent-dusty-olive w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: Core Feature Priority */}
                      {operationsStep === 2 && (
                        <motion.div
                          key="ops-step-2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            If Ve could solve ONE thing for your boutique on launch day, what should it be?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Choose what matters most for your shop
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Virtual Try-On: Shoppers see clothes on their body and buy with confidence',
                              'Dedicated Courier: Reliable Ve riders pick up from your counter with doorstep delivery',
                              'Protected MoMo: Guaranteed payments with zero fake receipt fraud or ghosting',
                              'AI Studio Photos: Turn simple phone photos on a hanger into professional model images',
                              'Stock Sync: Automatic inventory tracking so you never double-sell in-store vs online',
                            ].map((opt) => (
                              <label
                                key={opt}
                                onClick={() => setTopToolDesired(opt)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  topToolDesired === opt
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium ring-1 ring-dusty-olive'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="top-tool-desired"
                                  value={opt}
                                  checked={topToolDesired === opt}
                                  onChange={() => setTopToolDesired(opt)}
                                  className="accent-dusty-olive w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: Daily Vendor Portal Tools */}
                      {operationsStep === 3 && (
                        <motion.div
                          key="ops-step-3"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="font-semibold text-carbon-black block text-sm">
                            Which tools would you use every day inside your Ve Vendor Portal?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Select all features you would love to have
                            </span>
                          </label>
                          <div className="space-y-1.5 pt-1">
                            {[
                              'Direct buyer WhatsApp link & customer order manager',
                              'Real-time daily sales, revenue & profit dashboard',
                              'Flash sales, limited discount codes & promo creator',
                              'Instant same-day payout withdrawals to MTN & Airtel Money',
                              'Shopper demand radar (see which sizes and styles Kampala shoppers are searching for)',
                            ].map((opt) => (
                              <label
                                key={opt}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  portalToolsDesired.includes(opt)
                                    ? 'border-dusty-olive bg-soft-linen/40 text-carbon-black font-medium'
                                    : 'border-soft-linen bg-snow text-carbon-black/80 hover:bg-soft-linen/10'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={portalToolsDesired.includes(opt)}
                                  onChange={() => togglePortalTool(opt)}
                                  className="accent-dusty-olive rounded w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: Custom Feature Wish & Co-Creation */}
                      {operationsStep === 4 && (
                        <motion.div
                          key="ops-step-4"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <label htmlFor="custom-feature-wish" className="font-semibold text-carbon-black block text-sm">
                            What specific tool or feature do you wish an app created for Kampala fashion sellers?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Optional · Tell our engineering team what would make Ve the dream platform for your boutique
                            </span>
                          </label>
                          <textarea
                            id="custom-feature-wish"
                            rows={3}
                            value={customFeatureWish}
                            onChange={(e) => setCustomFeatureWish(e.target.value)}
                            placeholder="e.g. Bulk WhatsApp restock alerts, automated size conversion charts, layaway down-payments..."
                            className="w-full px-3.5 py-2.5 rounded-lg border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive text-xs resize-none"
                          />
                          <div className="p-3 rounded-lg bg-soft-linen/30 border border-soft-linen text-[11px] text-neutral-600 leading-relaxed">
                            💡 We design Ve hand-in-hand with boutique merchants across Kampala to solve real operational bottlenecks.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step Navigation Controls */}
                    <div className="pt-3 flex items-center justify-between gap-2 border-t border-soft-linen">
                      {operationsStep > 0 ? (
                        <button
                          type="button"
                          onClick={() => setOperationsStep((s) => s - 1)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-carbon-black cursor-pointer px-2 py-1 rounded"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Back
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowOperationsProfile(false)}
                          className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer"
                        >
                          Maybe later
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        {operationsStep < 4 ? (
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={
                              (operationsStep === 0 && !primarySalesChannel) ||
                              (operationsStep === 1 && !biggestChallenge) ||
                              (operationsStep === 2 && !topToolDesired) ||
                              (operationsStep === 3 && portalToolsDesired.length === 0)
                            }
                            onClick={() => setOperationsStep((s) => s + 1)}
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
                            disabled={isOperationsSubmitting}
                            className="font-semibold cursor-pointer"
                          >
                            {isOperationsSubmitting ? 'Unlocking Growth Tier...' : 'Claim 1 Month Free Growth Tier 🚀'}
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
                      <Award className="w-3 h-3 text-dusty-olive" />
                      Early Boutique Partner Perk
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-carbon-black">
                      Unlock 1 Month of Growth Package Free
                    </h4>
                    <p className="text-xs text-carbon-black/70 leading-relaxed">
                      Complete our 2-minute Boutique Operations Profile so we configure Ve to your shop routine. We&apos;ll upgrade your boutique to the Growth Tier (featured catalog placement, dedicated counter pickup, and studio photo enhancement) for your entire first month.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setOperationsStep(0);
                      setShowOperationsProfile(true);
                    }}
                    variant="accent"
                    size="sm"
                    className="w-full sm:w-auto font-semibold cursor-pointer"
                  >
                    Unlock 1 Month Growth Tier Free →
                  </Button>
                </div>
              )}

              {/* Fast Track via WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={whatsappFastTrackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                </a>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-dusty-olive-dark hover:underline cursor-pointer"
                >
                  Edit application details
                </button>
              </div>
            </Card>
          )}

          {/* Quick link back to shopper waiting list */}
          <div className="pt-4 text-xs text-neutral-500">
            Looking for the shopper waiting list instead?{' '}
            <Link href="/app" className="text-dusty-olive-dark font-semibold hover:underline">
              Join customer early access here →
            </Link>
          </div>
        </div>

        {/* Right Column: Practical Boutique Benefits (Non-Technical) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-normal text-carbon-black tracking-tight">
              Why Kampala boutiques sell on Ve
            </h3>
            <p className="text-xs sm:text-sm text-carbon-black/65">
              No complex software or confusing terms. Just practical tools built for real shop owners.
            </p>
          </div>

          <div className="space-y-4">
            {/* Benefit 1: Never double-sell */}
            <Card className="p-5 bg-snow border-soft-linen space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-carbon-black">
                  Never double-sell a piece
                </h4>
              </div>
              <p className="text-xs text-carbon-black/70 leading-relaxed pl-10">
                When you sell an outfit across your shop counter, it automatically updates on Ve so an online buyer never orders the same piece.
              </p>
            </Card>

            {/* Benefit 2: Stop losing stock & cash */}
            <Card className="p-5 bg-snow border-soft-linen space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-carbon-black">
                  Stop losing stock and cash
                </h4>
              </div>
              <p className="text-xs text-carbon-black/70 leading-relaxed pl-10">
                A simple phone tool replaces messy counter books. Shop staff record sales in seconds, while your profits and bank details stay private.
              </p>
            </Card>

            {/* Benefit 3: Free shop counter pickup */}
            <Card className="p-5 bg-snow border-soft-linen space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <Bike className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-carbon-black">
                  Free shop counter pickup
                </h4>
              </div>
              <p className="text-xs text-carbon-black/70 leading-relaxed pl-10">
                Ve riders come straight to your boutique counter to pick up orders. You never have to stand outside or bargain with street boda riders.
              </p>
            </Card>

            {/* Benefit 4: Clean phone photos */}
            <Card className="p-5 bg-snow border-soft-linen space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-carbon-black">
                  Clean photos with your phone
                </h4>
              </div>
              <p className="text-xs text-carbon-black/70 leading-relaxed pl-10">
                Snap clothes on a mannequin or hanger in your shop. Ve automatically removes messy backgrounds into clean, professional catalog photos.
              </p>
            </Card>

            {/* Benefit 5: Direct Mobile Money payouts */}
            <Card className="p-5 bg-snow border-soft-linen space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-carbon-black">
                  Guaranteed Mobile Money payouts
                </h4>
              </div>
              <p className="text-xs text-carbon-black/70 leading-relaxed pl-10">
                No fake SMS screenshots. When a package is delivered, your money lands directly in your MTN or Airtel wallet.
              </p>
            </Card>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-5 rounded-2xl bg-carbon-black text-snow space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-dusty-olive-light font-semibold">
              Fair &amp; Transparent
            </div>
            <div className="font-serif text-2xl font-semibold">
              Zero upfront fees. 100% free to list.
            </div>
            <p className="text-xs text-snow/75 leading-relaxed">
              No monthly software charges. You only pay a small commission (from 6%) when you make a verified sale. If you don&apos;t sell, you pay nothing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

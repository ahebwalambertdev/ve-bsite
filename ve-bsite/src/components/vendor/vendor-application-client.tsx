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
  Award,
  X,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact';
import { validatePhoneNumber } from '@/lib/validation';

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

type VendorModalStage = 'step-1' | 'step-2' | 'perk-prompt' | 'operations' | 'completed';

export function VendorApplicationClient() {
  const [boutiqueName, setBoutiqueName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState(KAMPALA_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [category, setCategory] = useState(FASHION_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [stockSize, setStockSize] = useState('50 - 200 items');
  const [customStockSize, setCustomStockSize] = useState('');
  const [socialHandle, setSocialHandle] = useState('');

  // Multi-stage Modal State
  const [modalStage, setModalStage] = useState<VendorModalStage>('step-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field validation errors
  const [boutiqueError, setBoutiqueError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  // Operations Profile (Tier 2 Unlock) State
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
    let alreadyApplied = false;
    let alreadyCompletedOps = false;
    try {
      const saved = localStorage.getItem('ve_vendor_application');
      if (saved) {
        setIsSubmitted(true);
        alreadyApplied = true;
        const parsed = JSON.parse(saved);
        if (parsed?.boutiqueName) setBoutiqueName(parsed.boutiqueName);
        if (parsed?.ownerName) setOwnerName(parsed.ownerName);
        if (parsed?.whatsapp) setWhatsapp(parsed.whatsapp);
        if (parsed?.location) {
          if (KAMPALA_LOCATIONS.includes(parsed.location)) {
            setLocation(parsed.location);
          } else {
            setLocation('Other');
            setCustomLocation(parsed.location);
          }
        }
        if (parsed?.category) {
          if (FASHION_CATEGORIES.includes(parsed.category)) {
            setCategory(parsed.category);
          } else {
            setCategory('Other');
            setCustomCategory(parsed.category);
          }
        }
        if (parsed?.stockSize) {
          if (['Under 50 items', '50 - 200 items', '200+ items'].includes(parsed.stockSize)) {
            setStockSize(parsed.stockSize);
          } else {
            setStockSize('Other');
            setCustomStockSize(parsed.stockSize);
          }
        }
        if (parsed?.socialHandle) setSocialHandle(parsed.socialHandle);
      }
      const savedOps = localStorage.getItem('ve_vendor_operations_profile');
      if (savedOps) {
        setOperationsCompleted(true);
        alreadyCompletedOps = true;
      }
    } catch {
      // Storage ignored
    }

    // Smart modal display:
    // 1. Unregistered -> Open Step 1
    // 2. Applied but unfinished operations profile -> Prompt continuation for 1-month growth tier
    // 3. Finished both -> Do not open modal automatically
    if (!alreadyApplied) {
      setModalStage('step-1');
      setIsModalOpen(true);
    } else if (!alreadyCompletedOps) {
      setModalStage('perk-prompt');
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, []);

  // Lock background scrolling and listen to Escape key while modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Step 1 Validation & Next
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!boutiqueName.trim()) {
      setBoutiqueError('Please enter your boutique or brand name');
      hasError = true;
    } else {
      setBoutiqueError(null);
    }

    if (location === 'Other' && !customLocation.trim()) {
      setLocationError('Please specify your shop or stock location');
      hasError = true;
    } else {
      setLocationError(null);
    }

    if (category === 'Other' && !customCategory.trim()) {
      setCategoryError('Please specify your primary fashion category');
      hasError = true;
    } else {
      setCategoryError(null);
    }

    if (hasError) return;
    setModalStage('step-2');
  };

  // Step 2 Submission & Continuation to Perk Prompt
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!ownerName.trim()) {
      setOwnerError('Please enter your name');
      hasError = true;
    } else {
      setOwnerError(null);
    }

    const phoneCheck = validatePhoneNumber(whatsapp);
    if (!phoneCheck.isValid) {
      setWhatsappError(phoneCheck.error || 'Please enter a valid phone number');
      hasError = true;
    } else {
      setWhatsappError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);

    const resolvedLocation = location === 'Other' ? (customLocation.trim() || 'Other') : location;
    const resolvedCategory = category === 'Other' ? (customCategory.trim() || 'Other') : category;
    const resolvedStockSize = stockSize === 'Other' ? (customStockSize.trim() || 'Other') : stockSize;

    // 1. Optimistic Local Persistence
    try {
      localStorage.setItem(
        've_vendor_application',
        JSON.stringify({
          boutiqueName,
          ownerName,
          whatsapp,
          location: resolvedLocation,
          category: resolvedCategory,
          socialHandle,
          stockSize: resolvedStockSize,
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
          location: resolvedLocation,
          category: resolvedCategory,
          socialHandle,
          stockSize: resolvedStockSize,
        }),
      });
    } catch (err) {
      console.warn('[Vendor Application] Background sync error (saved locally):', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Smooth continuation: immediately prompt for free growth package inside the modal!
      setModalStage('perk-prompt');
    }
  };

  // Operations Profile Submit
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
      setModalStage('completed');
    }
  };

  const whatsappFastTrackUrl = CONTACT_CONFIG.getWhatsappUrl(
    `Hi Ve Merchant Team, I just submitted an application for my boutique "${boutiqueName || 'My Boutique'}" in ${location}. I'd love to fast-track verification!`
  );

  const whatsappGeneralUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Team, I run a fashion business in Kampala and want to learn about becoming a Ve-ndor'
  );

  return (
    <div className="space-y-16">
      {/* Top Banner if already submitted */}
      {isSubmitted && (
        <div className="bg-soft-linen/50 border border-dusty-olive/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-carbon-black">
                Boutique Application Confirmed: <span className="text-dusty-olive-dark">{boutiqueName || 'Your Boutique'}</span>
              </p>
              <p className="text-xs text-carbon-black/70">
                WhatsApp: <strong>{whatsapp || 'your number'}</strong> · Location: <strong>{location}</strong> · Status: <span className="text-emerald-700 font-semibold">Under 24h Review</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!operationsCompleted ? (
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={() => {
                  setOperationsStep(0);
                  setModalStage('operations');
                  setIsModalOpen(true);
                }}
                className="font-semibold cursor-pointer text-xs"
              >
                Claim Free Growth Tier →
              </Button>
            ) : (
              <span className="text-xs font-semibold text-dusty-olive-dark bg-dusty-olive/10 px-3 py-1 rounded-full">
                Tier-2 Growth Perks Active
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setModalStage('step-1');
                setIsModalOpen(true);
              }}
              className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer px-2 py-1"
            >
              Edit Details
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl">
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-carbon-black tracking-tight leading-[1.1]">
          Sell where Kampala shops.
          <br />
          <span className="italic">Zero upfront fees, zero delivery stress.</span>
        </h1>

        <p className="text-base sm:text-xl text-carbon-black/75 leading-relaxed">
          Ahead of our upcoming Kampala public launch, we&apos;re onboarding premier boutiques and creators. Stop bargaining in inboxes and hustling with deliveries. We bring you verified buyers, send riders to collect packages straight from your shop counter, and send your earnings straight to your Mobile Money.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => {
              if (isSubmitted && !operationsCompleted) {
                setModalStage('perk-prompt');
              } else if (isSubmitted) {
                setModalStage('step-1');
              } else {
                setModalStage('step-1');
              }
              setIsModalOpen(true);
            }}
            className="font-semibold cursor-pointer shadow-subtle hover:shadow-md"
          >
            {isSubmitted ? 'View Application / Perks' : 'Apply as a Ve-ndor'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg" className="cursor-pointer">
              <MessageCircle className="w-4 h-4 mr-2 text-dusty-olive" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Multi-Stage Modal - Zero Scroll on Desktop Aspect Ratios */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vendor-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-carbon-black/60 backdrop-blur-sm"
            />

            {/* Modal Card - Compact height to eliminate vertical scrolling on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-snow rounded-2xl border border-soft-linen shadow-elevated p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full text-carbon-black/50 hover:text-carbon-black hover:bg-soft-linen/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* STAGE 1: Boutique Profile (Compact 4 fields) */}
              {modalStage === 'step-1' && (
                <form onSubmit={handleStep1Next} className="space-y-4">
                  {/* Step Progress Header */}
                  <div className="space-y-2 border-b border-soft-linen pb-3 pr-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-carbon-black flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-dusty-olive" />
                        Step 1 of 2 · Boutique Details
                      </span>
                      <span className="font-mono font-medium text-dusty-olive-dark bg-dusty-olive/10 px-2 py-0.5 rounded-full text-[11px]">
                        50% Complete
                      </span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full bg-soft-linen rounded-full h-1.5 overflow-hidden">
                      <div className="bg-dusty-olive h-full rounded-full w-1/2" />
                    </div>
                    <h2 id="vendor-modal-title" className="font-serif text-xl sm:text-2xl font-semibold text-carbon-black pt-1">
                      Tell us about your boutique
                    </h2>
                    <p className="text-xs text-carbon-black/65">
                      Takes 1 minute. We use this to route the nearest dispatch riders to your store counter.
                    </p>
                  </div>

                  {/* Boutique Name */}
                  <div className="space-y-1">
                    <label htmlFor="modal-boutique-name" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Boutique or Brand Name *
                    </label>
                    <input
                      id="modal-boutique-name"
                      type="text"
                      required
                      value={boutiqueName}
                      onChange={(e) => {
                        setBoutiqueName(e.target.value);
                        if (boutiqueError) setBoutiqueError(null);
                      }}
                      placeholder="e.g. Kololo Vintage or Glamour Vault"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 transition-all ${
                        boutiqueError
                          ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-soft-linen focus:ring-dusty-olive focus:border-transparent'
                      }`}
                    />
                    {boutiqueError && (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                        <span>⚠️</span> {boutiqueError}
                      </p>
                    )}
                  </div>

                  {/* Shop Location in Kampala */}
                  <div className="space-y-1">
                    <label htmlFor="modal-shop-location" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Shop or Stock Location in Kampala *
                    </label>
                    <select
                      id="modal-shop-location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (e.target.value !== 'Other') setCustomLocation('');
                        if (locationError) setLocationError(null);
                      }}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all cursor-pointer"
                    >
                      {KAMPALA_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="Other">Other (specify custom location)</option>
                    </select>

                    <AnimatePresence>
                      {location === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <input
                            type="text"
                            required
                            value={customLocation}
                            onChange={(e) => {
                              setCustomLocation(e.target.value);
                              if (locationError) setLocationError(null);
                            }}
                            placeholder="Type your boutique location, arcade, or neighborhood..."
                            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-white text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 shadow-xs transition-all ${
                              locationError
                                ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                                : 'border-dusty-olive focus:ring-dusty-olive'
                            }`}
                          />
                          {locationError && (
                            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                              <span>⚠️</span> {locationError}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category & Stock Size in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="modal-category" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                        Primary Category *
                      </label>
                      <select
                        id="modal-category"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (e.target.value !== 'Other') setCustomCategory('');
                          if (categoryError) setCategoryError(null);
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive transition-all cursor-pointer"
                      >
                        {FASHION_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Other">Other (specify category)</option>
                      </select>

                      <AnimatePresence>
                        {category === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <input
                              type="text"
                              required
                              value={customCategory}
                              onChange={(e) => {
                                setCustomCategory(e.target.value);
                                if (categoryError) setCategoryError(null);
                              }}
                              placeholder="e.g. Bridal & Ceremony, Kids Wear, Sportswear..."
                              className={`w-full px-3 py-1.5 text-xs rounded-xl border bg-white text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 shadow-xs transition-all ${
                                categoryError
                                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                                  : 'border-dusty-olive focus:ring-dusty-olive'
                              }`}
                            />
                            {categoryError && (
                              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                                <span>⚠️</span> {categoryError}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="modal-stock-size" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                        Items In Stock
                      </label>
                      <select
                        id="modal-stock-size"
                        value={stockSize}
                        onChange={(e) => {
                          setStockSize(e.target.value);
                          if (e.target.value !== 'Other') setCustomStockSize('');
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-soft-linen bg-snow text-carbon-black focus:outline-none focus:ring-2 focus:ring-dusty-olive transition-all cursor-pointer"
                      >
                        <option value="Under 50 items">Under 50 items</option>
                        <option value="50 - 200 items">50 - 200 items</option>
                        <option value="200+ items">200+ items</option>
                        <option value="Other">Other (custom volume)</option>
                      </select>

                      <AnimatePresence>
                        {stockSize === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <input
                              type="text"
                              required
                              value={customStockSize}
                              onChange={(e) => setCustomStockSize(e.target.value)}
                              placeholder="e.g. 500+ items or Custom Bespoke"
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-dusty-olive bg-white text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive shadow-xs transition-all"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step 1 Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-soft-linen">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer"
                    >
                      Explore benefits first
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="font-semibold cursor-pointer"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </form>
              )}

              {/* STAGE 2: Contact & Verification (Compact 3 fields) */}
              {modalStage === 'step-2' && (
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  {/* Step Progress Header */}
                  <div className="space-y-2 border-b border-soft-linen pb-3 pr-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-carbon-black flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-dusty-olive" />
                        Step 2 of 2 · Contact &amp; Verification
                      </span>
                      <span className="font-mono font-medium text-dusty-olive-dark bg-dusty-olive/10 px-2 py-0.5 rounded-full text-[11px]">
                        100% Complete
                      </span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full bg-soft-linen rounded-full h-1.5 overflow-hidden">
                      <div className="bg-dusty-olive h-full rounded-full w-full" />
                    </div>
                    <h2 id="vendor-modal-title" className="font-serif text-xl sm:text-2xl font-semibold text-carbon-black pt-1">
                      Where should our team reach you?
                    </h2>
                    <p className="text-xs text-carbon-black/65">
                      Our Kampala merchant team verifies boutiques and confirms counter pickup within 24 hours.
                    </p>
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-1">
                    <label htmlFor="modal-owner-name" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Your Name (Owner or Shop Manager) *
                    </label>
                    <input
                      id="modal-owner-name"
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => {
                        setOwnerName(e.target.value);
                        if (ownerError) setOwnerError(null);
                      }}
                      placeholder="e.g. Sarah Namubiru"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 transition-all ${
                        ownerError
                          ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-soft-linen focus:ring-dusty-olive focus:border-transparent'
                      }`}
                    />
                    {ownerError && (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                        <span>⚠️</span> {ownerError}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Phone with Validation */}
                  <div className="space-y-1">
                    <label htmlFor="modal-whatsapp-number" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      WhatsApp Phone *
                    </label>
                    <input
                      id="modal-whatsapp-number"
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        if (whatsappError) setWhatsappError(null);
                      }}
                      placeholder="e.g. 0772 000 000 or +256 700 000 000"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 transition-all ${
                        whatsappError
                          ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                          : 'border-soft-linen focus:ring-dusty-olive focus:border-transparent'
                      }`}
                    />
                    {whatsappError ? (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                        <span>⚠️</span> {whatsappError}
                      </p>
                    ) : (
                      <p className="text-[11px] text-carbon-black/50">
                        We use this strictly for order dispatch and Mobile Money payouts.
                      </p>
                    )}
                  </div>

                  {/* Social Media Link / Handle */}
                  <div className="space-y-1">
                    <label htmlFor="modal-social-handle" className="text-xs font-semibold uppercase tracking-wider text-carbon-black/70">
                      Instagram or TikTok Page <span className="text-neutral-400 lowercase font-normal">(optional)</span>
                    </label>
                    <input
                      id="modal-social-handle"
                      type="text"
                      value={socialHandle}
                      onChange={(e) => setSocialHandle(e.target.value)}
                      placeholder="@yourboutique"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-soft-linen bg-snow text-carbon-black placeholder:text-carbon-black/40 focus:outline-none focus:ring-2 focus:ring-dusty-olive focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Step 2 Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-soft-linen">
                    <button
                      type="button"
                      onClick={() => setModalStage('step-1')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-carbon-black cursor-pointer px-2 py-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Back to Step 1
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSubmitting}
                      className="font-semibold cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </form>
              )}

              {/* STAGE 3: Continuation Perk Prompt */}
              {modalStage === 'perk-prompt' && (
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 pr-6">
                      <h3 id="vendor-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-carbon-black">
                        {isSubmitted ? 'Application Submitted! 🎉' : 'Welcome back!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
                        Thank you for applying, {ownerName || 'Boutique Partner'}! Our Kampala merchant team will review <strong className="text-carbon-black">{boutiqueName || 'your boutique'}</strong> and reach out on WhatsApp within 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-snow rounded-xl border border-dusty-olive/60 shadow-subtle space-y-3">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-dusty-olive-dark bg-soft-linen/50 px-2 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5 text-dusty-olive" />
                        Early Boutique Partner Perk
                      </div>
                      <h4 className="font-serif text-lg font-semibold text-carbon-black">
                        Unlock 1 Month of Growth Package Free
                      </h4>
                      <p className="text-xs text-carbon-black/70 leading-relaxed">
                        Complete our 2-minute Boutique Operations Profile so we configure Ve to your shop routine. We&apos;ll upgrade your boutique to the Growth Tier (featured catalog placement, dedicated counter pickup, and studio photo enhancement) for your entire first month.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setOperationsStep(0);
                          setModalStage('operations');
                        }}
                        variant="accent"
                        size="md"
                        className="w-full sm:w-auto font-semibold cursor-pointer"
                      >
                        Claim 1 Month Free Growth Tier →
                      </Button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="text-xs text-neutral-500 hover:text-carbon-black hover:underline cursor-pointer py-1"
                      >
                        Close &amp; View Merchant Hub
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-soft-linen/70">
                    <a
                      href={whatsappFastTrackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-dusty-olive-dark hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Fast-track verification on WhatsApp →
                    </a>
                    <button
                      type="button"
                      onClick={() => setModalStage('step-1')}
                      className="text-neutral-500 hover:underline cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: Gamified Operations Survey */}
              {modalStage === 'operations' && (
                <div className="space-y-4">
                  {/* Gamified Progress Bar */}
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

                    <div className="w-full bg-soft-linen rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-dusty-olive h-full rounded-full"
                        initial={false}
                        animate={{ width: `${Math.round(((operationsStep + 1) / 5) * 100)}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>

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

                      {/* STEP 1: Hardest Bottleneck */}
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

                      {/* STEP 4: Custom Feature Wish */}
                      {operationsStep === 4 && (
                        <motion.div
                          key="ops-step-4"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          <label htmlFor="modal-custom-feature-wish" className="font-semibold text-carbon-black block text-sm">
                            What specific tool or feature do you wish an app created for Kampala fashion sellers?
                            <span className="text-carbon-black/50 text-xs font-normal block pt-0.5">
                              Optional · Tell our engineering team what would make Ve the dream platform for your boutique
                            </span>
                          </label>
                          <textarea
                            id="modal-custom-feature-wish"
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
                          onClick={() => setIsModalOpen(false)}
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
              )}

              {/* STAGE 5: Growth Tier Unlocked */}
              {modalStage === 'completed' && (
                <div className="space-y-4">
                  <div className="p-6 bg-snow rounded-2xl border-2 border-dusty-olive shadow-subtle space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dusty-olive text-snow flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-dusty-olive-dark font-semibold">
                          Partner Perk Unlocked
                        </span>
                        <h4 className="font-serif text-xl font-semibold text-carbon-black">
                          Growth Package Unlocked Free for 1 Month!
                        </h4>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
                      Your boutique (<strong className="text-carbon-black">{boutiqueName || 'Your Boutique'}</strong>) is credited with 1 month of complimentary Growth Tier access upon launch (featured catalog placement, dedicated counter pickup, and studio photo enhancement).
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-soft-linen/30 rounded-xl border border-soft-linen text-xs font-mono text-carbon-black">
                      <Award className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                      <span>STATUS: <strong>TIER-2 GROWTH TIER ACTIVATED (UGX 150,000 VALUE)</strong></span>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full sm:w-auto font-semibold cursor-pointer"
                      >
                        Done / View Merchant Overview
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setOperationsStep(0);
                          setModalStage('operations');
                        }}
                        className="text-xs text-dusty-olive-dark hover:underline font-medium cursor-pointer"
                      >
                        Review profile →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4 Core Merchant Value Pillars */}
      <section className="space-y-10 pt-4 border-t border-soft-linen">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-carbon-black font-normal tracking-tight">
            Built to solve Kampala boutique headaches
          </h2>
          <p className="text-sm text-carbon-black/70 mt-2">
            No complex software or confusing terms. Just practical tools built for real shop owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Never Double-Sell */}
          <Card className="p-7 bg-snow border-soft-linen space-y-3 shadow-subtle hover:border-dusty-olive/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black">
              Never Double-Sell a Piece
            </h3>
            <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
              When you sell an item across your shop counter, it automatically updates on Ve so an online buyer never orders the same piece.
            </p>
          </Card>

          {/* Pillar 2: Free Shop Counter Pickups */}
          <Card className="p-7 bg-snow border-soft-linen space-y-3 shadow-subtle hover:border-dusty-olive/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <Bike className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black">
              Free Shop Counter Pickups
            </h3>
            <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
              Never haggle with street riders again. When an order lands, our verified rider comes directly to your shop counter, collects the package, and delivers safely across Kampala.
            </p>
          </Card>

          {/* Pillar 3: Guaranteed Mobile Money Payouts */}
          <Card className="p-7 bg-snow border-soft-linen space-y-3 shadow-subtle hover:border-dusty-olive/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black">
              Direct Mobile Money Payouts
            </h3>
            <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
              No fake SMS screenshots or ghosting. Payment is collected before dispatch, and funds land directly in your MTN or Airtel line upon verified delivery.
            </p>
          </Card>

          {/* Pillar 4: Clean Phone Photos */}
          <Card className="p-7 bg-snow border-soft-linen space-y-3 shadow-subtle hover:border-dusty-olive/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-carbon-black">
              Clean Photos With Your Phone
            </h3>
            <p className="text-xs sm:text-sm text-carbon-black/75 leading-relaxed">
              Snap clothes on a mannequin or hanger in your shop. Ve automatically cleans up cluttered arcade backgrounds into crisp, professional catalog photos.
            </p>
          </Card>
        </div>
      </section>

      {/* Transparent Pricing & Everything Included */}
      <section className="space-y-10 pt-4 border-t border-soft-linen">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-carbon-black font-normal tracking-tight">
            Fair pricing. Keep your margins.
          </h2>
          <p className="text-sm text-carbon-black/70 mt-2">
            Zero upfront joining fees or recurring subscription traps. You only pay a commission when you make a verified sale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Performance Commission */}
          <Card className="p-8 bg-snow border-2 border-dusty-olive shadow-subtle flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-dusty-olive-dark font-semibold">
                Performance Based
              </div>
              <div className="font-serif text-4xl font-semibold text-carbon-black">
                From 6% <span className="text-base font-sans font-normal text-carbon-black/60">commission</span>
              </div>
              <p className="text-sm text-carbon-black/75 leading-relaxed">
                Commission ranges between 6% and 15% depending on your item category. As your boutique builds consistent order volume and great buyer reviews, your rate drops.
              </p>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-carbon-black/80">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Zero sign-up costs or monthly fees to get started</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Direct payouts to your MTN or Airtel line upon delivery</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Feed placement earned through reliability, not paid ads</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => {
                  setModalStage('step-1');
                  setIsModalOpen(true);
                }}
                className="font-semibold cursor-pointer"
              >
                Apply as a Ve-ndor
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>

          {/* Card 2: What Every Boutique Gets */}
          <Card className="p-8 bg-snow border border-soft-linen flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-dusty-olive-dark font-semibold">
                Built For You
              </div>
              <h3 className="font-serif text-2xl font-semibold text-carbon-black">
                Everything you need to sell
              </h3>
              <p className="text-sm text-carbon-black/75 leading-relaxed">
                We handle the delivery hustle, payment collection, and photo styling so you can focus on great fashion.
              </p>
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-carbon-black/80">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Free doorstep package collection from your shop</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Try-On previews on shoppers&apos; phones to minimize returns</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Instant background cleanup for clean catalog photos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-dusty-olive flex-shrink-0" />
                  <span>Simple phone tool so stock and cash always match</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <a href={whatsappGeneralUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button variant="secondary" size="md" className="cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-dusty-olive" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Direct Escalation / Support Card */}
      <section className="bg-carbon-black text-snow rounded-2xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
            Have specific questions before applying?
          </h2>
          <p className="text-sm text-snow/75 leading-relaxed">
            Our merchant onboarding team is based in Kampala. We can visit your store, review your catalog, and get you set up quickly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="accent" size="md" className="cursor-pointer">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Chat on WhatsApp
            </Button>
          </a>

          <a
            href={`mailto:${CONTACT_CONFIG.emails.support}`}
            className="inline-flex items-center justify-center text-xs font-medium text-snow/80 hover:text-snow h-9 px-4 rounded-md border border-snow/20 hover:border-snow/40 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 mr-1.5 text-dusty-olive-light" />
            Email: {CONTACT_CONFIG.emails.support}
          </a>
        </div>
      </section>
    </div>
  );
}

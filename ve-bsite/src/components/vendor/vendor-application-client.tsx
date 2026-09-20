'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Store, 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Bike, 
  Banknote, 
  Camera, 
  Layers, 
  Check
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ve_vendor_application');
      if (saved) {
        setIsSubmitted(true);
      }
    } catch {
      // Storage ignored
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boutiqueName.trim() || !whatsapp.trim() || !ownerName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
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
    }, 600);
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

              {/* What Happens Next */}
              <div className="p-5 bg-snow rounded-xl border border-soft-linen space-y-3 text-xs sm:text-sm text-carbon-black/80">
                <div className="font-semibold text-carbon-black flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-dusty-olive" />
                  What happens next:
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
                    <span><strong>Boutique Verification:</strong> We confirm your shop location and verify basic details.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
                    <span><strong>Catalog Setup:</strong> We help you snap and upload clean photos of your pieces for free.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-dusty-olive flex-shrink-0 mt-0.5" />
                    <span><strong>Shop Counter Pickup Ready:</strong> Our riders are mapped to your boutique counter for fast collections.</span>
                  </li>
                </ul>
              </div>

              {/* Fast Track via WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={whatsappFastTrackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="accent" size="md" className="w-full justify-center">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    Fast-Track on WhatsApp
                  </Button>
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

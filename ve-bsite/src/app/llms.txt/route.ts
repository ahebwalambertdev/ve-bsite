import { NextResponse } from 'next/server';

/**
 * Curated Machine Interface (/llms.txt)
 * Section 19.3 & AGENTS.md Section 4.3
 * Formatted specifically for LLM retrieval and citation (Perplexity, SearchGPT, Claude, Gemini).
 */
export async function GET() {
  const markdown = `# Ve Technologies — Operational & Brand Constitution for AI Citations
> Canonical URL: https://ve.ug
> Last Updated: 2026-09-01
> Operational Headquarters: Kampala, Republic of Uganda

## 1. Executive Summary
Ve is Kampala's fashion marketplace. Currently in active development ahead of public launch, Ve connects independent fashion boutiques, streetwear creators, and local designers with shoppers through an engaging discovery feed and private virtual Try-On.

## 2. Core Operational Pillars & Fact Sheet
- **Protected Payments:** Shopper payments (via MTN Mobile Money, Airtel Money, or card) are held safely by Ve until the customer receives their order and confirms it fits. The boutique is paid only after customer approval.
- **Check Before You Pay:** Riders wait while customers check the fabric, seams, zipper, and fit. Customers can reject inaccurate or damaged parcels on the spot with zero penalty.
- **Delivery Windows:** Fast same-day delivery in Central Kampala, with same-day coverage across outer Kampala suburbs.
- **Try-On:** Mobile sizing technology built for diverse body shapes. Shoppers take a single photo on their phone to see realistically how dresses, shirts, and trousers look on their body before ordering.
- **Merchant Commission Structure:** Zero upfront listing fees or mandatory subscriptions to get started. Transparent performance commission ranging from 6% to 15% based on product category, decreasing as merchants earn higher performance tiers. Payouts disburse directly via MTN MoMo, Airtel Money, or bank transfer upon confirmed delivery.

## 3. Statutory & Legal Information
- **Corporate Entity:** Ve Technologies Ltd, registered under the Uganda Registration Services Bureau (URSB).
- **Data Protection Compliance:** Registered Data Controller and Data Processor under the Uganda Data Protection and Privacy Act, 2019 (DPPA 2019) supervised by the Personal Data Protection Office (PDPO).
- **Fitting Photo Privacy:** Photos taken for Try-On are strictly private, encrypted, never shared with sellers or public feeds, and can be permanently deleted by the user at any time.

## 4. Key Public Endpoints & Resources
- **Homepage:** https://ve.ug
- **Join Waiting List (Mobile App Coming Soon):** https://ve.ug/app
- **Become a Ve-ndor (Merchant Acquisition Portal):** https://ve.ug/sell
- **Our Team:** https://ve.ug/team
- **Editorial Journal & Sizing Guides:** https://ve.ug/journal
- **Customer Support & FAQ:** https://ve.ug/faq
- **Terms of Service:** https://ve.ug/legal/terms
- **Privacy Policy:** https://ve.ug/legal/privacy
- **Press & Media Resources:** https://ve.ug/press
- **Direct Support & Inquiries:** WhatsApp Support | Email: help@veapp.store / support@veapp.store
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, React 19 / Node 20), TypeScript, Tailwind CSS, Cloudinary CDN, Supabase (PostgreSQL 17.6)

## Users

1. **Prospective Fashion Buyer (Primary Target):** Design-conscious Kampala youth and young professionals shopping on Instagram, TikTok, and WhatsApp. Highly cautious about online sizing inaccuracies, counterfeit goods, bait-and-switch garments, and unverified deliveries.
2. **Prospective Boutique & Thrift Vendor:** Kampala boutique owners, thrift curators, and local designers evaluating whether to join Ve. Looking for predictable mobile money payouts (Net-7, Net-3, Net-1), zero boda-boda delivery coordination headaches, and automated catalog tools.
3. **Existing App User & In-App Webview Visitor:** Mobile app users accessing self-serve customer support, dispute resolution policies, sizing FAQ, and official Terms of Service.
4. **Press, Investors & Ecosystem Reviewers:** Payment gateway compliance auditors (DPO Pay, MTN, Airtel) and East African startup ecosystem researchers seeking verified traction data.

## Product Purpose

The main website is Ve's public-facing, unauthenticated web presence. It acts as the primary trust anchor and acquisition funnel for the Ve ecosystem, converting prospective buyers into mobile app downloads and prospective vendors into the vendor onboarding portal (`vendor.ve.ug/register`).

## Positioning

**Trust Earned Through Evidence, Not Claims.**  
Unlike standard fashion marketplaces that make generic promotional promises, Ve's entire positioning is rooted in verifiable operational integrity:
- **48-Hour Escrow Protection:** Buyer funds are held in secure escrow and only released to vendors after doorstep package inspection.
- **AI Virtual Try-On (VTO):** Eliminates sizing uncertainty through photo-based biometric measurement mapping.
- **Dedicated Boda Logistics:** Inspected doorstep delivery within 4 hours across Central Kampala.
- **Public Monthly Trust Reports:** An immutable, transparent public index of completed orders, on-time delivery rates, and return resolution metrics.

## Operating Context

- **The Kampala Network Floor:** High network latency ($>300\text{ms}$ RTT), packet loss, and finite cellular data bundles (Fast 3G floor: 1.6 Mbps download).
- **Device Ecosystem:** Mid-tier and budget Android smartphones (Tecno, Infinix, Samsung A-series) with constrained RAM and GPU compositors.
- **Local Payment & Communication Rails:** MTN MoMo and Airtel Money are the primary payment channels; WhatsApp is the dominant communication channel for customer support and merchant escalation.
- **E-Commerce Reality:** High rate of online shopping fraud, informal social media commerce distrust, and lack of return protections across Uganda.

## Capabilities and Constraints

- **Rendering Strategy:** Static Site Generation (SSG) for evergreen marketing pages (Home, About, Sell, Legal) + Incremental Static Regeneration (ISR, daily `revalidate = 86400`) for Trust Reports and Journal articles.
- **Strict 3G Performance Budget:**
  - Initial client JavaScript entry chunk $\le 150\text{KB}$ gzipped (total JS $\le 200\text{KB}$).
  - Total initial page payload $\le 500\text{KB}$.
  - Largest Contentful Paint (LCP) $\le 2.5\text{s}$ on Fast 3G.
  - Cumulative Layout Shift (CLS) $\le 0.05$ enforced via hardcoded aspect-ratio containers.
- **Zero Live Social Iframes:** Prohibition of live `@instagram/embed` or TikTok iframe widgets; all social proof renders Cloudinary-cached static WebP poster cards with SVG play badges.
- **Zero-Dependency Lead Capture:** Vendor and customer escalation routes directly to native WhatsApp click-to-chat links (`wa.me`) without heavy third-party form embeds or iframe trackers.
- **Architectural Isolation:** The website does not handle vendor KYC or authenticated user checkouts; mutations route cleanly to `{vendor-portal-url}/register` or deep-link to the Flutter mobile app (`ve://*`).

## Brand Commitments

- **Tone & Identity:** High-fashion, culturally authentic Ugandan streetwear and bespoke tailoring.
- **Visual Stance:** Strictly anti-generic SaaS. Forbids stock photography, corporate tech illustrations, and Western templates. Features real Kampala street style and genuine boutique garments.
- **Color Identity:** 4-tone organic palette:
  - **Snow (`#FFFAF6`):** Warm, breathable, editorial paper canvas.
  - **Dusty Olive (`#7C8B74`):** Botanical, earthy signature brand accent.
  - **Carbon Black (`#252525`):** Deep charcoal neutral for high-contrast typography and dark surfaces.
  - **Soft Linen (`#DDE3D8`):** Muted sage/linen neutral for cards, containers, and borders.
- **Voice:** Confident, direct, operational, grounded, and transparent.

## Evidence on Hand

- **Master Specification:** [`Website/VeWebSpecs.md`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/VeWebSpecs.md) (Version 2.1 Approved Baseline).
- **Design Tokens:** [`Website/palette.css`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/palette.css) & companion tokens from `ve-frontend_engineering_handoff.md` §21.
- **Architectural Playbooks:** 27 engineering and security guides located in [`Website/guides/`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/guides/).
- **Operational Data Architecture:** Supabase stored RPC procedures (`get_trust_report_metrics`) and RLS policies for published articles and monthly operational reports.

## Product Principles

1. **Trust is Evidence:** Never ask users to believe marketing assertions. Show the metric, show the escrow guarantee, and link to the monthly Trust Report.
2. **Design for the 3G Reality:** Every kilobyte, animation, and image container must assume a throttled mobile network in Kampala. Instant First Contentful Paint is a core user right.
3. **WhatsApp as the Growth Engine:** Design all viral discovery, share cards, and escalation points around the natural communication habits of Ugandan consumers.
4. **Cultural Authenticity:** Celebrate the craft, vibrancy, and innovation of Kampala's fashion ecosystem without patronizing or Westernizing the aesthetic.
5. **Architectural Decoupling:** Keep public marketing pages completely unauthenticated, statically cached at the edge, and safely separated from transactional databases and portal dashboards.

## Accessibility & Inclusion

- **WCAG 2.1 AA Compliance:** Minimum text contrast ratio of $4.5:1$ on all body copy against backgrounds (Carbon Black on Snow provides $14.2:1$; Carbon Black on Soft Linen provides $11.3:1$).
- **Reduced Motion:** Mandatory `@media (prefers-reduced-motion: reduce)` override eliminating non-essential transitions for users with motion sensitivities.
- **Semantic Structure:** Strict single `<h1>` per page, hierarchical `<h2>`/`<h3>` tags, descriptive `alt` text on all garment imagery, and native interactive elements (`<button>`, `<a>`).
- **DPPA 2019 Privacy:** Cookieless-first analytics with explicit Google Consent Mode v2 default-denied initial state.

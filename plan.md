# Ve Main Website — Master Implementation Plan
> **Document Type:** Execution Blueprint & Milestone Tracker | **Status:** Active (Phase 1 Foundation)  
> **Master Reference:** [`Website/VeWebSpecs.md`](./VeWebSpecs.md) (v2.1 Baseline) · [`Website/PRODUCT.md`](./PRODUCT.md) · [`Website/DESIGN.md`](./DESIGN.md)  
> **Target Environment:** Next.js (App Router, React 19 / Node 20) in [`Website/ve-bsite/`](./ve-bsite/) · Tailwind CSS · TypeScript · Kampala 3G Network Floor

---

## 1. Project Constitution & Design Baseline

The main website (`https://ve.ug`) is Ve's public-facing, unauthenticated web presence. It is architecturally decoupled from the authenticated portals (Vendor/Admin) and consumer mobile app (Flutter). Its core mission is converting prospective buyers into mobile app downloads and prospective vendors into portal registration through **trust earned via operational evidence**.

### 1.1 Locked Design Foundations
* **Color Palette ([`Website/palette.css`](./palette.css) & [`Website/DESIGN.md`](./DESIGN.md)):**
  * `snow` (`#FFFAF6`): Warm, breathable, paper-like editorial canvas.
  * `dusty-olive` (`#7C8B74`): Signature botanical accent for badges, active pills, and secondary buttons.
  * `carbon-black` (`#252525`): High-contrast charcoal for typography, dark surfaces, and primary buttons.
  * `soft-linen` (`#DDE3D8`): Structural neutral for card fills, borders, and alternating rows.
* **Design Dials (Taste Framework):**
  * `DESIGN_VARIANCE: 8` — Artisanal editorial asymmetry; avoids mechanical 3-card monotony.
  * `MOTION_INTENSITY: 5` — Purposeful micro-motion; snappy feedback without gratuitous loops.
  * `VISUAL_DENSITY: 4` — Art gallery airy; generous whitespace calibrated for small mobile screens.
* **Craft Engineering Laws (Emil Kowalski Standards):**
  * Responsive button physics: `:active` state with `transform: scale(0.97)` and 160ms ease-out.
  * Popovers & dropdowns: Origin-aware scaling starting at `scale(0.95)` with `opacity: 0` (never `scale(0)`).
  * GPU-compositor-only animations (`transform` and `opacity` only; layout properties strictly banned).
* **Negative Constraints (Anti-Slop):**
  * Zero AI-purple/neon gradients; zero generic stock photography; zero live social iframes.
  * Zero raw database stack traces exposed to client browsers.

---

## 2. Master Work Breakdown Structure (WBS)

```
[ Phase 0: Project Architecture, Folder Scaffolding & Dependencies ]
  ├── 0.1 Package Manifest (package.json) & Supply Chain Hardening (.npmrc)
  ├── 0.2 Dependency Installation (Core Runtime, Dev, Supabase, Analytics, Tooling)
  ├── 0.3 Production Directory Structure (src/app, src/components, src/lib, src/styles, public)
  ├── 0.4 TypeScript & Build Config (tsconfig.json, next.config.ts, postcss.config.mjs)
  └── 0.5 Environment Variables Blueprint (.env.example & .env.local)

[ Phase 1: Scaffolding & Design System Foundations ]
  ├── 1.1 Tailwind CSS Configuration with 4-Tone Palette & Gradients
  ├── 1.2 High-Performance Google Font Pipeline (Newsreader + Inter/Geist)
  ├── 1.3 Production Security Headers, CSP & Strict Origin Policies
  └── 1.4 Emil Kowalski Crafted UI Primitives Library

[ Phase 2: Global Shell & Infrastructure Systems ]
  ├── 2.1 Responsive Navigation Header & Mobile Menu Drawer
  ├── 2.2 Global Footer with Regulatory Links & WhatsApp Escalation
  ├── 2.3 DPPA 2019 Privacy Consent Banner & Google Consent Mode v2
  ├── 2.4 Non-Blocking GA4 Telemetry & Native Web Vitals Reporting
  └── 2.5 Route Error Isolation (error.tsx, not-found.tsx, loading.tsx)

[ Phase 3: Core Conversion & Marketing Screens ]
  ├── 3.1 Homepage (/) — Hero, Trust Strip, How Ve Works, UGC Grid, Vendor Teaser
  ├── 3.2 Get the App (/app) — OS Detection, Scannable QR Code, ?ref= Persistence
  ├── 3.3 Sell on Ve (/sell) — Tier Cards, KYC Handoff, Inbound WhatsApp Chat
  ├── 3.4 About & Manifesto (/about) — Cultural Ethos, Problem & Founder Letter
  ├── 3.5 Customer Support Hub (/faq) — Inverted Accordions & WhatsApp Fallback
  ├── 3.6 Legal Reader (/legal/terms & /legal/privacy) — Sticky TOC Sidebar
  └── 3.7 Contact (/contact) & Minimal Press Kit (/press)

[ Phase 4: Authority, Operational Data & Discoverability (SEO/GEO) ]
  ├── 4.1 Monthly Trust Reports (/trust & /trust/[month]) via Supabase Postgres RPC
  ├── 4.2 Editorial Journal (/journal & /journal/[slug]) with AEO/GEO Inverted Pyramid
  ├── 4.3 Automated Dynamic Open Graph Engine (@vercel/og ImageResponse)
  ├── 4.4 Machine Retrieval Route Handler (/llms.txt)
  ├── 4.5 Search & AI Crawler Disaggregation Directives (robots.txt)
  ├── 4.6 Automated Dynamic XML Sitemap (sitemap.ts)
  └── 4.7 Smart 404 & AI Hallucination Recovery Engine (app/not-found.tsx)

[ Phase 5: Master Verification, Hardening & Launch Audit ]
  ├── 5.1 Strict 3G Mobile Performance Budget Audit (JS ≤ 150KB, Page ≤ 500KB)
  ├── 5.2 Cumulative Layout Shift (CLS ≤ 0.05) & Fixed Aspect Ratio Verification
  ├── 5.3 Schema.org JSON-LD @graph Rich Results Validation
  ├── 5.4 WCAG 2.1 AA Contrast (≥ 4.5:1) & Reduced-Motion Audit
  └── 5.5 Production Secret Isolation & Supply Chain Audit
```

---

## 3. Detailed Phase Specifications & Task Checklists

### Phase 0: Project Architecture, Folder Scaffolding & Dependencies
- [x] **Task 0.1: Package Manifest & Supply Chain Hardening**
  - Created `package.json` specifying scripts (`dev`, `build`, `start`, `lint`, `analyze`).
  - Configured `.npmrc` with `ignore-scripts=true` to block arbitrary post-install scripts.
  - Created `.gitignore` ignoring `.next/`, `node_modules/`, `.env*.local`, and diagnostic logs.
- [x] **Task 0.2: Core & Dev Dependencies Installation**
  - Runtime installed: `next@15.2.0`, `react@19.0.0`, `react-dom@19.0.0`, `@next/third-parties`, `@supabase/supabase-js`, `clsx`, `tailwind-merge`, `lucide-react`.
  - Dev installed: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `@next/bundle-analyzer`, `eslint`, `eslint-config-next`.
- [x] **Task 0.3: Production Directory Scaffolding**
  - `src/app/`: App router pages, layouts, route handlers, error boundaries.
  - `src/components/ui/`: Base design primitives (buttons, badges, cards, aspect containers).
  - `src/components/layout/`: Header, footer, consent banner, mobile menu drawer.
  - `src/lib/`: Supabase client, CORS helpers, analytics wrappers, utils.
  - `src/styles/`: Global CSS, Tailwind imports, CSS variable tokens from `palette.css`.
  - `public/images/`: Optimized static WebP assets, logos, brand mark.
  - `public/icons/`: SVG icon primitives.
- [x] **Task 0.4: TypeScript & Build Tooling Configuration**
  - `tsconfig.json` with strict type checking and `@/*` path mapping to `./src/*`.
  - `postcss.config.mjs` with Tailwind & Autoprefixer.
  - `next.config.ts` with security headers, strict CSP, and Cloudinary remote patterns.
  - Build verified: `next build` compiled in 52s (First Load JS: 103 KB, well under 150 KB 3G budget).
- [x] **Task 0.5: Environment Variables Blueprint**
  - Created `.env.example` and `.env.local` documenting all non-secret and client environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`).

### Phase 1: Design System Foundations & Primitives
- [x] **Task 1.1: Tailwind CSS Token Extension**
  - Configured `tailwind.config.ts` mapping `snow`, `dusty-olive`, `carbon-black`, and `soft-linen`.
  - Added semantic role aliases (`canvas`, `surface`, `text-primary`, `border`, `accent`).
  - Configured directional and radial brand gradients (`brand-gradient-r`, `brand-radial`).
- [x] **Task 1.3: Typography Pipeline**
  - Configured `next/font/google` with Latin subsetting and `display: 'swap'`:
    - Display: `Newsreader` (editorial serif).
    - Sans: `Inter` (high-legibility body).
    - Mono: `Geist Mono` (metrics and code).
- [x] **Task 1.4: Production Security Headers & CSP**
  - Implemented `securityHeaders` in `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`).
  - Configured CSP with strict origin allowlist for GA4, Supabase, and Cloudinary.
  - Implemented CORS helper in `src/lib/cors.ts` blocking wildcard origins on mutating routes.
- [x] **Task 1.5: Emil Kowalski Crafted UI Primitives**
  - `Button`: Primary (`carbon-black`), Accent (`dusty-olive`), Secondary (`soft-linen`), and Ghost variants with `:active` `scale(0.97)` physics.
  - `AspectContainer`: Fixed aspect ratio wrappers (`aspect-[4/5]`, `aspect-video`, `aspect-square`) eliminating CLS.
  - `Badge`: Status and category pill tokens with `rounded-full`, `olive`, and `soft-linen` backgrounds.
  - `Card`: Flat container with `1px solid #DDE3D8` and ambient micro-shadow (`--shadow-subtle`).
  - `Accordion`: GPU-composited collapsible items with direct-answer inverted structure.
  - `Modal`: Accessible dialog overlay with backdrop blur and `scale(0.95)` entrance.

---

### Phase 2: Global Shell & Infrastructure Systems
- [x] **Task 2.1: Navigation Header & Mobile Menu**
  - Sticky, semi-translucent header (`backdrop-blur-md bg-snow/90 border-b border-soft-linen`).
  - Brand logomark linking to `/`.
  - Desktop links: `How Ve Works`, `Trust Reports`, `Sell on Ve`, `Journal`, `FAQ`.
  - Primary CTA button: "Get the App".
  - Mobile slide-out drawer with GPU-composited slide/fade animation.
- [x] **Task 2.2: Global Footer**
  - Dark container in `carbon-black` (`#252525`) with `snow` typography.
  - Four columns: Brand statement, Navigation, Legal (`/legal/terms`, `/legal/privacy`), and Contact.
  - Social icons: Instagram, TikTok, WhatsApp.
  - Copyright and Kampala registration statement.
- [x] **Task 2.3: DPPA 2019 Privacy Consent Banner**
  - Non-blocking bottom notification bar informing visitors of referral attribution.
  - Inline Google Consent Mode v2 default-denied script (`analytics_storage: 'denied'`).
  - Client handler updating consent state on accept.
- [x] **Task 2.4: GA4 Telemetry & Native Web Vitals**
  - Non-blocking GA4 mounting via `@next/third-parties/google` in root layout.
  - Client component `WebVitals` capturing LCP, INP, and CLS via `useReportWebVitals` and forwarding to GA4 custom events.
- [x] **Task 2.5: Route Error Isolation**
  - Implemented localized `error.tsx` error boundaries masking database stack traces.
  - Built `loading.tsx` skeleton states with matching aspect ratios.
  - Built smart 404 recovery engine in `not-found.tsx`.

---

### Phase 3: Core Conversion & Marketing Screens
- [x] **Task 3.1: Homepage (`/`)**
  - **Hero:** Full-bleed culturally authentic Kampala street fashion visual with `priority={true}` LCP preload, bold headline (*“Fashion, Found”*), and platform-aware "Get the App" CTA.
  - **Live Trust Strip:** High-contrast dynamic metric ribbon pulling latest published operational figures.
  - **How Ve Works:** 3-Step visual card system (Discover FYP, Virtual Try-On, Inspected Boda Delivery).
  - **Social Proof Grid (`#VerifiedByVe`):** Cloudinary WebP static unboxing cards with SVG play badges opening a lightweight modal (zero live iframes).
  - **Vendor Teaser:** High-impact callout banner pitching boutique owners with pill link to `/sell`.
- [x] **Task 3.2: Get the App (`/app`)**
  - Device-aware OS detection (auto-elevating Google Play Store or Apple App Store badge).
  - High-contrast scannable desktop QR code.
  - Referral code extraction and persistence in 30-day `ve_ref` cookie and localStorage.
  - 3-card feature walkthrough (Video Feed, VTO Fitting Room, Mobile Money checkout).
  - Standalone Android APK download card with SHA-256 fingerprint verification.
- [x] **Task 3.3: Sell on Ve (`/sell`)**
  - Vendor value propositions (guaranteed predictable Net payouts, end-to-end boda logistics, zero sizing returns).
  - 3-Tier comparison cards (Standard, Preferred, Elite) with starting commission callouts.
  - Primary Action: Direct handoff button to `https://vendor.ve.ug/register`.
  - Secondary Action: Low-friction inbound WhatsApp click-to-chat button (`wa.me`) with pre-populated onboarding message.
- [x] **Task 3.4: About & Manifesto (`/about`)**
  - Editorial long-form story: Manifesto, The Sizing & Fraud Problem in Kampala, The Operational Fix, and Founder's Letter from Ahebwa.
  - Proof anchor linking directly to `/trust`.
- [x] **Task 3.5: Support & Customer FAQ (`/faq`)**
  - Categorized collapsible accordion modules (Ordering & Payments, Delivery, Returns, VTO, Selling).
  - Direct-answer first sentence structure for AEO and Google Rich Snippets.
  - Persistent bottom escalation card linking to WhatsApp customer support.
  - Schema.org FAQPage JSON-LD graph.
- [x] **Task 3.6: Legal Documentation (`/legal/terms` & `/legal/privacy`)**
  - Stable, immutable URLs for payment gateway and app store compliance.
  - Clean reading layout with sticky Table of Contents sidebar.
  - Effective date stamp and version history header.
  - Explicit DPPA 2019, VTO AES-256 biometric encryption, and 48-hr escrow clauses.
- [x] **Task 3.7: Direct Contact (`/contact`) & Press Kit (`/press`)**
  - Primary WhatsApp click-to-chat button + dedicated inbox links (`hello@`, `vendors@`, `press@`, `legal@`).
  - Physical Kampala office address and URSB registration.
  - Minimalist `/press` stub with downloadable SVG logos, brand color swatches, and company boilerplate.

---

### Phase 4: Authority, Operational Data & Discoverability Systems
- [x] **Task 4.1: Monthly Trust Reports (`/trust` & `/trust/[month]`)**
  - Pre-launch empty state card and historical audit archive.
  - Single report view: Gross packages delivered, on-time delivery %, return & 48h resolution rate, active verified boutiques, VTO session count.
  - Supabase database aggregation via Postgres RPC (`get_trust_report_metrics`) or materialized view (prohibits raw row JS memory reduction).
  - Scheduled daily ISR caching (`revalidate = 86400`).
- [x] **Task 4.2: Machine-Liftable Editorial Journal (`/journal` & `/journal/[slug]`)**
  - Server-paginated catalog with taxonomy filter pills (Vendor Spotlights, Kampala Style, Consumer Guides).
  - Article template adhering to AEO/GEO standards:
    - Inverted pyramid direct-answer first paragraph (30–50 words).
    - Executive TL;DR summary callout block immediately beneath H1.
    - Question-led section headings (H2/H3).
    - Markdown comparison tables and numbered imperative steps.
    - Schema.org Article JSON-LD structured data.
- [x] **Task 4.3: Automated Dynamic Open Graph Synthesis**
  - Edge Route Handler at `app/api/og/route.tsx` using `@vercel/og` (`ImageResponse`).
  - Generates 1200x630 branded preview cards with `carbon-black` background, `snow` typography, `dusty-olive` category tag, and `soft-linen` metadata.
- [x] **Task 4.4: Dynamic Machine Interface (`app/llms.txt/route.ts`)**
  - High-density curated markdown summary providing factual platform answers for AI crawler grounding.
- [x] **Task 4.5: Crawler Disaggregation (`app/robots.ts`)**
  - Explicitly **Allows** live conversational search crawlers (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `Claude-Web`).
  - Explicitly **Disallows** bulk model training scrapers (`CCBot`, `GPTBot`, `Bytespider`, `Anthropic-AI`).
- [x] **Task 4.6: Dynamic XML Sitemap (`app/sitemap.ts`)**
  - Combines static marketing routes with dynamic article slugs and trust report months.
- [x] **Task 4.7: Smart 404 Recovery (`app/not-found.tsx`)**
  - Emits strict HTTP 404 status.
  - High-contrast recovery navigation linking to `/app`, `/sell`, `/trust`, and `/faq`.

---

### Phase 5: Master Verification, Hardening & Launch Audit
- [x] **Task 5.1: Fast 3G Performance Budget Audit**
  - Production build compiled: Shared First Load JS is 103 KB (well below strict 150 KB budget).
  - Max page bundle is 121 KB (`/`). All other pages are 103–116 KB.
- [x] **Task 5.2: Layout Stability & CLS Verification**
  - Explicit aspect ratios on all visual containers (`aspect-[4/5]`, `aspect-video`, `aspect-[16/10]`).
  - Zero live third-party iframes on page load.
- [x] **Task 5.3: Schema.org Rich Results Validation**
  - Server-rendered JSON-LD on `/faq` (`FAQPage`) and `/journal/[slug]` (`Article`).
- [x] **Task 5.4: WCAG 2.1 AA Contrast & Accessibility Audit**
  - Palette contrast: Carbon Black on Snow = 14.2:1 (exceeds AAA). Carbon Black on Soft Linen = 11.3:1.
  - Reduced-motion global stylesheet support.
- [x] **Task 5.5: Production Secret Isolation Audit**
  - CI gate check executed on `.next/` output: zero matches for `sk_live`, `sk_test`, `service_role`, or private keys.

---

## 4. Master Acceptance Criteria Matrix

| ID | Criterion Summary | Verification Tool / Command | Target Threshold |
|---|---|---|---|
| **AC-001** | Homepage 3G Performance Budget | Chrome DevTools (Fast 3G) | LCP $\le 2.5\text{s}$, Total $\le 500\text{KB}$ |
| **AC-002** | Platform-Aware Store Badges | User-Agent Switcher on `/app` | Highlights iOS vs. Android correctly |
| **AC-003** | Ambassador Referral Persistence | Navigate with `?ref=CAMPUS_KLA` | Cookie `ve_ref` written for 30 days |
| **AC-004** | Trust Report Pre-Launch State | Open `/trust` with zero DB rows | Displays launch commitment card, zero errors |
| **AC-005** | Vendor Registration Handoff | Tap primary CTA on `/sell` | Navigates to `vendor.ve.ug/register` |
| **AC-006** | Legal Route Stability | Inspect `/legal/terms`, `/privacy` | Stable URLs, DPPA 2019 clauses present |
| **AC-007** | Native WhatsApp Contact | Tap contact on `/contact` or `/faq` | Opens native `wa.me` with pre-filled string |
| **AC-008** | Cookie Consent Privacy | Load site with clean cache | Google Consent Mode v2 default denied |
| **AC-009** | FAQ Fallback Trigger | Search non-matching term in FAQ | Displays WhatsApp escalation fallback |
| **AC-010** | Draft Journal Access Control | Access `/journal/[draft-slug]` | Returns strict HTTP 404 status |
| **AC-011** | Dynamic OG Card Generation | Share link into WhatsApp | 1200x630 branded WebP card preview |
| **AC-012** | Structured Data Validation | Google Rich Results Test | Passes Schema.org `@graph` with zero errors |
| **AC-013** | AI Search Crawler Directives | Request `/robots.txt` | Allows search bots, blocks training scrapers |
| **AC-014** | Automated Dynamic Sitemap | Request `/sitemap.xml` | Dynamically includes all published slugs |
| **AC-015** | Production Security Headers | Evaluate HTTP response headers | `X-Frame-Options: DENY`, strict CSP, HSTS |
| **AC-016** | Smart 404 Recovery | Navigate to `/sizing-guide` | Returns 404 + prominent link to `/app` |
| **AC-017** | Entry Client JS Budget | `@next/bundle-analyzer` | Entry chunk $\le 150\text{KB}$ gzipped |
| **AC-018** | Database Aggregate Safety | Inspect Supabase query logs | Postgres RPC calculation, no Node reduction |
| **AC-019** | Schema Entity Completeness | Inspect `/` and `/app` | Valid `WebSite` & `SoftwareApplication` |

---

## 5. Risk Register & Mitigation Strategy

| Risk Event | Severity | Likelihood | Impact Area | Mitigation Strategy |
|---|---|---|---|---|
| **Live Social Embeds Crash 3G Devices** | High | High | User Bounce Rates | Strict prohibition of `@instagram/embed` or TikTok iframes; render Cloudinary static WebP posters. |
| **Silent 1,000-Row PostgREST Truncation** | High | Medium | Trust Reports | Compute metrics inside PostgreSQL via RPC (`get_trust_report_metrics`); enforce cursor pagination. |
| **Secret API Keys Leaked into JS Bundles** | Critical | Low | Infrastructure Security | CI/CD build gate scanning `.next/` directory for credential patterns before deployment. |
| **AI Answer Engines Overlook Content** | Medium | Medium | Organic Discovery | Format all Journal articles with top TL;DR blocks, question-led headings, and deploy `/llms.txt`. |
| **Vendor Registration Drop-off** | High | Low | Merchant Acquisition | Maintain an immutable route contract with Vendor Portal team on `/register`; provide instant WhatsApp chat. |

# Ve — Main Website Specification & Discoverability Strategy
## Complete Architecture · Screens · SEO · GEO · Acceptance Criteria · Risk Register

**Document Type:** Unified Master Specification & Strategy | **Version:** 2.1 (Production-Ready Master Specification) | **Status:** Approved Production Baseline  
**Companion Documents:** `ve_marketing_strategy.md`, `ve_habit_strategy.md`, `ve_vendor_portal_specification.md`, `ve-frontend_engineering_handoff.md`, `08_engineering_operations_readiness_plan.md`  
**Scope Confirmed:** Full marketing site (brand, vendor acquisition, trust reports, journal, legal) + Comprehensive discoverability (SEO, GEO, Social)  
**Target Environment & Constraints:** Next.js (App Router) · Kampala, Uganda (3G-first network floor, budget Android viewports, WhatsApp-first communication)

---

## Master Table of Contents

- [Part I: Foundations & Architecture](#part-i-foundations--architecture)
  - [1. Executive Overview](#1-executive-overview)
  - [2. Tech Stack & Infrastructure Architecture](#2-tech-stack--infrastructure-architecture)
    - [2.1 Hosting Platform Decision (`DECISION NEEDED #1`)](#21-hosting-platform-decision-decision-needed-1)
    - [2.2 Repository & Monorepo Placement (`DECISION NEEDED #2`)](#22-repository--monorepo-placement-decision-needed-2)
    - [2.3 Domain Reservation (`DECISION NEEDED #3`)](#23-domain-reservation-decision-needed-3)
    - [2.4 Production Security Headers & Content Security Policy (CSP)](#24-production-security-headers--content-security-policy-csp)
    - [2.5 CORS & Origin Access Boundaries](#25-cors--origin-access-boundaries)
    - [2.6 Credential & Supply Chain Isolation](#26-credential--supply-chain-isolation)
    - [2.7 Next.js Chunk Boundaries & Route Error Isolation](#27-nextjs-chunk-boundaries--route-error-isolation)
    - [2.8 Core Brand Design System & Color Palette Tokens](#28-core-brand-design-system--color-palette-tokens)
  - [3. Information Architecture (Site Map)](#3-information-architecture-site-map)
- [Part II: Screen-by-Screen Specifications](#part-ii-screen-by-screen-specifications)
  - [4. Screen — Homepage (`/`)](#4-screen--homepage-)
  - [5. Screen — About / Manifesto (`/about`)](#5-screen--about--manifesto-about)
  - [6. Screen — Sell on Ve (`/sell`)](#6-screen--sell-on-ve-sell)
  - [7. Screen — Get the App (`/app`)](#7-screen--get-the-app-app)
  - [8. Screen — Trust Reports (`/trust` & `/trust/[month]`)](#8-screen--trust-reports-trust--trustmonth)
  - [9. Screen — Journal (`/journal` & `/journal/[slug]`)](#9-screen--journal-journal--journalslug)
    - [9.1 Purpose](#91-purpose)
    - [9.2 Content Pillars & Structure](#92-content-pillars--structure)
    - [9.3 Shoppable Product Tagging (`DECISION NEEDED #6`)](#93-shoppable-product-tagging-decision-needed-6)
    - [9.4 Machine-Liftable Editorial Architecture (AEO & GEO Standards)](#94-machine-liftable-editorial-architecture-aeo--geo-standards)
  - [10. Screen — FAQ / Support (`/faq`)](#10-screen--faq--support-faq)
  - [11. Screen — Terms of Service & Privacy Policy (`/legal/*`)](#11-screen--terms-of-service--privacy-policy-legal)
  - [12. Screen — Contact (`/contact`)](#12-screen--contact-contact)
  - [13. Screen — Press / Media Kit (`/press`)](#13-screen--press--media-kit-press)
- [Part III: Cross-Cutting Systems & Infrastructure](#part-iii-cross-cutting-systems--infrastructure)
  - [14. Performance Budget & 3G Optimization](#14-performance-budget--3g-optimization)
    - [14.1 The Kampala Network Floor](#141-the-kampala-network-floor)
    - [14.2 Strict Performance Budget](#142-strict-performance-budget)
    - [14.3 Asset Optimization Rules](#143-asset-optimization-rules)
    - [14.4 Two-Tier Edge Caching Architecture](#144-two-tier-edge-caching-architecture)
    - [14.5 GPU Compositor-Only CSS Motion Standards](#145-gpu-compositor-only-css-motion-standards)
  - [15. Analytics, Referral Attribution & Consent](#15-analytics-referral-attribution--consent)
    - [15.1 GA4 & Core Web Vitals Pipeline via @next/third-parties](#151-ga4--core-web-vitals-pipeline-via-nextthird-parties)
    - [15.2 Google Consent Mode v2 & DPPA Compliance](#152-google-consent-mode-v2--dppa-compliance)
  - [16. Content Ownership & CMS Architecture](#16-content-ownership--cms-architecture)
    - [16.1 Supabase Content Architecture & Hardened RLS](#161-supabase-content-architecture--hardened-rls)
    - [16.2 PostgREST Single Round-Trip Embedded Joins (N+1 Elimination)](#162-postgrest-single-round-trip-embedded-joins-n1-elimination)
    - [16.3 Operational Ownership Roster](#163-operational-ownership-roster)
- [Part IV: Comprehensive Discoverability & Visibility Strategy](#part-iv-comprehensive-discoverability--visibility-strategy)
  - [17. Core Discoverability Principle: Trust as Evidence](#17-core-discoverability-principle-trust-as-evidence)
  - [18. Traditional Technical & Content SEO](#18-traditional-technical--content-seo)
    - [18.1 Technical Crawlability & Server Component Architecture](#181-technical-crawlability--server-component-architecture)
    - [18.2 Content Keyword Matrix](#182-content-keyword-matrix)
    - [18.3 Keyword Research Strategy (`DECISION NEEDED #12`)](#183-keyword-research-strategy-decision-needed-12)
    - [18.4 Structured Data (Schema.org JSON-LD @graph Architecture)](#184-structured-data-schemaorg-json-ld-graph-architecture)
    - [18.5 Smart 404 & AI Hallucination Recovery (`app/not-found.tsx`)](#185-smart-404--ai-hallucination-recovery-appnot-foundtsx)
  - [19. AI & Answer-Engine Visibility (GEO)](#19-ai--answer-engine-visibility-geo)
    - [19.1 What Generative Engine Optimization (GEO) Is](#191-what-generative-engine-optimization-geo-is)
    - [19.2 Dynamic Crawler Policy (Search vs. Training Bot Disaggregation)](#192-dynamic-crawler-policy-search-vs-training-bot-disaggregation)
    - [19.3 Curated Machine Interface: `/llms.txt` (Dynamic Route Handler)](#193-curated-machine-interface-llmstxt-dynamic-route-handler)
    - [19.4 Content Extraction Optimization](#194-content-extraction-optimization)
  - [20. Social Sharing & Rich Link Previews (Open Graph)](#20-social-sharing--rich-link-previews-open-graph)
    - [20.1 The WhatsApp Growth Loop](#201-the-whatsapp-growth-loop)
    - [20.2 Automated Dynamic OG Image Generation (`@vercel/og`)](#202-automated-dynamic-og-image-generation-vercelog)
    - [20.3 Tag Specifications](#203-tag-specifications)
  - [21. Local Directory Presence & Accessibility Standards](#21-local-directory-presence--accessibility-standards)
    - [21.1 Local Ecosystem Footprint (`DECISION NEEDED #16`)](#211-local-ecosystem-footprint-decision-needed-16)
    - [21.2 Accessibility Standards (WCAG 2.1 AA)](#212-accessibility-standards-wcag-21-aa)
  - [22. Measurement, Tracking & Phased Rollout Sequence](#22-measurement-tracking--phased-rollout-sequence)
    - [22.1 Essential Measurement Signals & AI Referral Regex](#221-essential-measurement-signals--ai-referral-regex)
    - [22.2 Phased Rollout Sequence](#222-phased-rollout-sequence)
- [Part V: Governance, Decisions & Master Verification](#part-v-governance-decisions--master-verification)
  - [23. Master Acceptance Criteria (AC-001 through AC-019)](#23-master-acceptance-criteria-ac-001-through-ac-019)
  - [24. Consolidated Open Decisions (Decisions 1 through 19)](#24-consolidated-open-decisions-decisions-1-through-19)
  - [25. Master Risk Register](#25-master-risk-register)
  - [26. Master Cross-Reference Map](#26-master-cross-reference-map)

---

# Part I: Foundations & Architecture

## 1. Executive Overview

### 1.1 What It Is
The main website is Ve's public-facing, unauthenticated web presence — strictly decoupled from the authenticated client surfaces in `web-app/` (the Customer marketplace `web-app/customer` and Vendor Portal `web-app/vendor-portal`), the dedicated Admin Portal (`admin-portal/` → `admin.ve.ug`), the Delivery Rider App (`rider-app/` with Capacitor Android shell), and the legacy consumer mobile app (`flutter-app`). It serves visitors who are not yet inside the Ve ecosystem: prospective buyers deciding whether to shop or download, prospective vendors evaluating whether to apply, press/partners, and existing users looking for policies or customer support.

### 1.2 Why It Is Architecturally Decoupled
As established in system architecture specifications, different audiences and security contexts require distinct rendering architectures:
- **Portals & Apps (`web-app`, `admin-portal`, `rider-app`):** Highly interactive, authenticated dashboards and single-page applications (React/Vite) backed by live Supabase PostgreSQL and Edge Functions.
- **Main Website:** Public, unauthenticated surface dedicated to brand discovery, buyer/vendor acquisition, trust-building, and search ranking. It requires **instant First Contentful Paint (FCP)** and crawlable HTML without client-side authentication gating. **Next.js with SSG (Static Site Generation) and ISR (Incremental Static Regeneration)** is the chosen framework.

### 1.3 Target Audience & User Intent

| Segment | Entry Point | Core Need & Conversion Goal |
|---|---|---|
| **Prospective Buyer** | Instagram bio, ambassador UTM link, event QR, Google search | Prove that buying clothes online in Kampala is safe and reliable $\rightarrow$ Explore the web storefront (`web-app/customer`) or download the mobile app. |
| **Prospective Vendor** | Instagram bio, word of mouth, referral link | Prove business viability (predictable payouts, automated delivery) $\rightarrow$ Route into Vendor Portal registration (`/register`). |
| **Existing App User** | In-app settings link, external search | Access self-serve FAQs, dispute resolutions, Terms of Service, or direct WhatsApp support. |
| **Press & Ecosystem Partners** | Direct search, pitch decks, startup directories | Brand story, verified traction data via Trust Reports, founder/press contact. |
| **Compliance Reviewers** | DPO Pay onboarding, Apple/Google review teams | Reachable, stable, legally sound Terms of Service and Privacy Policy URLs. |

### 1.4 Core Product Philosophy: Trust Earned Through Evidence
Per `ve_marketing_strategy.md` §1–2, Ve's brand positioning cannot be claimed through marketing assertions; it must be proven operationally. Social media feeds (Instagram, TikTok) provide ephemeral distribution, whereas the website acts as the **permanent, durable record of proof** (monthly Trust Reports, verified vendor case studies, explicit consumer protections). Every screen is designed as verifiable evidence, not generic promotional copy.

---

## 2. Tech Stack & Infrastructure Architecture

| Architectural Layer | Selection | Technical Rationale |
|---|---|---|
| **Framework** | Next.js (App Router, React 19 / Node 20) | Best-in-class SSG/ISR support, automated metadata generation, and image optimization. |
| **Rendering Strategy** | SSG (Static Site Generation) + ISR (Incremental Static Regeneration) | Evergreen pages (Home, About, Sell, Legal) are statically compiled. Dynamic content (Trust Reports, Journal) revalidates on-demand without redeployment. |
| **Styling & Design Tokens** | Tailwind CSS | Official 4-tone organic palette (§2.8: Snow `#FFFAF6`, Dusty Olive `#7C8B74`, Carbon Black `#252525`, Soft Linen `#DDE3D8`) with gradients and WCAG 2.1 AAA high-contrast token scales. |
| **Asset Pipeline** | `next/image` + Cloudinary CDN | Automatic format conversion (`f_auto,q_auto`, WebP/AVIF), responsive srcsets, aggressive edge caching. |
| **Forms & Lead Capture** | Native HTML forms $\rightarrow$ Lightweight API Route / Server Action | Zero third-party form embed iframes (e.g., Typeform, Google Forms) to preserve strict page weight limits. |
| **Font Pipeline** | `next/font/google` (Display + Body pairing) | Zero layout shift (`font-display: swap`), preloaded and self-hosted automatically. |

### 2.1 Hosting Platform Decision (`DECISION NEEDED #1`)
Three deployment options are evaluated:
1. **Cloudflare Pages / Workers (`@cloudflare/next-on-pages`):** Cloudflare is already in Ve's DNS and CDN layer. Edge nodes in East Africa (Mombasa/Nairobi) provide ultra-low latency to Kampala. Consolidates DNS, DDoS protection, and hosting under one provider.
2. **Vercel:** Turnkey Next.js environment with native on-demand ISR and preview branches, but adds a separate billing entity in USD outside the core infrastructure.
3. **Linux VPS (Self-Hosted Node/Docker):** Ve's backend evaluation (`13-backend-architecture-evaluation.md`) targets a Linux VPS (`147.79.101.172`). Running a standalone Node server for Next.js is possible, but increases DevOps and maintenance overhead compared to edge platforms.
*Recommendation:* **Cloudflare Pages** or **Vercel Hobby/Pro**.

### 2.2 Repository & Monorepo Placement (`DECISION NEEDED #2`)
The Customer marketplace and Vendor portal reside in `web-app/`, with the Admin portal in `admin-portal/` in a `pnpm-workspace` monorepo importing `packages/shared`.
- **Option A (Monorepo App):** Add Next.js as another package in the monorepo. Shares TypeScript interfaces and design tokens directly, but mixes Vite and Next.js build pipelines, complicating CI/CD.
- **Option B (Dedicated Repository):** Separate repository with an extracted `@ve/design-tokens` package or synchronized Tailwind configuration. Cleaner deployment hooks, zero build-tooling conflict.
*Recommendation:* **Dedicated Repository** for the marketing site.

### 2.3 Domain Reservation (`DECISION NEEDED #3`)
`ve.ug` is referenced in mockups and payment gateway redirects (`06_payments_business_logic_execution_plan.md` §1.4). The root domain must be formally registered and connected to DNS before launch, as deep link schemes and legal URLs depend on an immutable root domain.

### 2.4 Production Security Headers & Content Security Policy (CSP)
Per the hardening standards in `Headers, CORS & Data Leakage.md` and Google Analytics integration guidelines, the Next.js deployment must serve strict, defensive HTTP headers across all public routes. These headers eliminate clickjacking, prevent MIME-sniffing, and establish a tamper-proof sandbox against script injection:

```typescript
// next.config.js (or next.config.ts)
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Disallows embedding inside iframes; eliminates clickjacking
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // Prevents browser MIME-type sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin', // Preserves origin; redacts path/query params on external navigation
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()', // Restricts device hardware access
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // Enforces HTTPS for 2 years
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: Self + GA4/GTM + Vercel analytics; unsafe-inline permitted for Next.js hydration bootstrap
      "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://va.vercel-scripts.com",
      // Connect: Local APIs + Google Analytics + Supabase API + Cloudinary media
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.supabase.co https://res.cloudinary.com",
      // Images: Self + data/blob (for VTO previews) + Cloudinary CDN + GA tracking beacons
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com",
      // Fonts: Self-hosted fonts via next/font + Google Font static fallbacks
      "font-src 'self' data: https://fonts.gstatic.com",
      // Restrict embedding and form destinations
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 2.5 CORS & Origin Access Boundaries
While the main website is predominantly static, internal route handlers (such as lead capture on `/sell` or general contact escalation) must restrict cross-origin access. Wildcard origins (`Access-Control-Allow-Origin: *`) are strictly prohibited on all mutating endpoints.

| Origin Boundary | Environment | Policy |
|---|---|---|
| `https://ve.ug` & `https://www.ve.ug` | Production | Allowed (Primary Origin) |
| `https://vendor.ve.ug` & `https://admin.ve.ug` | Production | Allowed (Ecosystem Subdomains) |
| `http://localhost:3000` | Development | Allowed (Local Testing) |
| Any Other Origin | All Environments | **Blocked (Returns empty headers / 403)** |

```typescript
// src/lib/cors.ts
const ALLOWED_ORIGINS = new Set([
  'https://ve.ug',
  'https://www.ve.ug',
  'https://vendor.ve.ug',
  'https://admin.ve.ug',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
])

export function getCorsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('origin') ?? ''
  if (!ALLOWED_ORIGINS.has(origin)) return {}

  return {
    'Access-Control-Allow-Origin': origin, // Echo verified origin only; never wildcard
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}
```

*Data Leakage Prevention:* All internal API error handlers must return generic, human-readable errors (`{ error: 'Something went wrong. Please try again.' }`) with HTTP 500. Raw `error.message`, database stack traces, and internal file paths must be logged server-side only and never forwarded to the client browser.

### 2.6 Credential & Supply Chain Isolation
Per `Environment Variables & API Keys.md` and `Dependencies & Supply Chain.md`, the marketing site enforces a zero-trust policy for credentials and dependencies:

1. **Strict Prefix Segregation:**
   - **Publishable / Public:** Only variables explicitly designed for client bundle exposure carry `NEXT_PUBLIC_` (e.g. `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`).
   - **Server-Only Secrets:** Supabase service-role keys, database connection strings, and transactional email API tokens must omit the prefix and reside exclusively on the server runtime.
2. **Automated Bundle Leak Audit:**
   To guarantee no developer or AI tool inadvertently exposes secret credentials into public JavaScript, CI/CD enforces a mandatory grep check across built output:
   ```bash
   # CI Gate: Must return zero matches prior to deployment
   npm run build && grep -rE "sk_live|sk_test|service_role|-----BEGIN" .next/
   ```
3. **Supply Chain Defense:**
   - `package-lock.json` must be committed to version control. Production and CI pipelines must use `npm ci` (never `npm install`).
   - Project root must contain a `.npmrc` file with `ignore-scripts=true` to block arbitrary post-install scripts from untrusted transitive packages.
   - Pull request CI workflows must enforce `npm audit --audit-level=high`.

### 2.7 Next.js Chunk Boundaries & Route Error Isolation
Per `Ship Less JavaScript.md`, an unpartitioned client bundle cripples performance on Kampala's 3G network floor. The marketing site enforces strict bundle budgeting and crash recovery:

1. **Initial JavaScript Budget:**
   - Main entry chunk must not exceed **$150\text{KB}$ gzipped** (total initial JS budget $\le 200\text{KB}$).
   - CI builds must verify chunk sizes using `@next/bundle-analyzer`:
     ```bash
     ANALYZE=true npm run build
     ```
2. **Dynamic Component Splitting:**
   - Any heavy interactive widgets not required for initial First Contentful Paint (e.g. desktop QR code generator on `/app`, Cloudinary video modal player, dynamic accordion filters) must be imported via `next/dynamic` with `<Suspense>` and matching skeleton loaders:
     ```tsx
     import dynamic from 'next/dynamic'
     const VideoPlayerModal = dynamic(() => import('@/components/VideoPlayerModal'), {
       loading: () => <div className="aspect-video bg-surface-elevated animate-pulse rounded-lg" />,
       ssr: false,
     })
     ```
3. **Route Crash Isolation (`error.tsx`):**
   - Every route segment must define a localized `error.tsx` error boundary. A render-time exception in a single component or route must never crash the entire page into a blank screen; it must present a clean, localized retry state while preserving global navigation and the footer.

### 2.8 Core Brand Design System & Color Palette Tokens

The website adopts an organic, high-fashion Ugandan editorial aesthetic anchored by a tactile 4-color palette. The palette pairs warm, artisanal light tones with deep carbon neutrals and botanical olive accents:

| Token Name | HEX | HSL | RGB | Semantic UI Role |
|---|---|---|---|---|
| **`snow`** | `#FFFAF6` | `hsl(27, 100%, 98%)` | `rgb(255, 250, 246)` | **Light Canvas & Primary Surface:** Warm editorial canvas, paper-like background, light card backgrounds. |
| **`dusty-olive`** | `#7C8B74` | `hsl(99, 9%, 50%)` | `rgb(124, 139, 116)` | **Signature Brand Accent:** Badges, tags, active navigation pills, secondary buttons, borders, verified icons. |
| **`carbon-black`** | `#252525` | `hsl(0, 0%, 15%)` | `rgb(37, 37, 37)` | **High-Contrast Typography & Dark Surface:** Primary headings, body copy, dark mode backgrounds, structural bars. |
| **`soft-linen`** | `#DDE3D8` | `hsl(93, 16%, 87%)` | `rgb(221, 227, 216)` | **Secondary Neutral & Containers:** Card fills, divider borders, subtle tag backgrounds, table alternating rows. |

#### 1. CSS & SCSS Custom Properties
```css
/* CSS HEX */
--snow: #fffaf6ff;
--dusty-olive: #7c8b74ff;
--carbon-black: #252525ff;
--soft-linen: #dde3d8ff;

/* CSS HSL */
--snow-hsl: hsla(27, 100%, 98%, 1);
--dusty-olive-hsl: hsla(99, 9%, 50%, 1);
--carbon-black-hsl: hsla(0, 0%, 15%, 1);
--soft-linen-hsl: hsla(93, 16%, 87%, 1);
```

```scss
/* SCSS Variables */
$snow: #fffaf6ff;
$dusty-olive: #7c8b74ff;
$carbon-black: #252525ff;
$soft-linen: #dde3d8ff;

$snow-hsl: hsla(27, 100%, 98%, 1);
$dusty-olive-hsl: hsla(99, 9%, 50%, 1);
$carbon-black-hsl: hsla(0, 0%, 15%, 1);
$soft-linen-hsl: hsla(93, 16%, 87%, 1);

$snow-rgb: rgba(255, 250, 246, 1);
$dusty-olive-rgb: rgba(124, 139, 116, 1);
$carbon-black-rgb: rgba(37, 37, 37, 1);
$soft-linen-rgb: rgba(221, 227, 216, 1);

/* SCSS Brand Gradients */
$gradient-top: linear-gradient(0deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-right: linear-gradient(90deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-bottom: linear-gradient(180deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-left: linear-gradient(270deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-top-right: linear-gradient(45deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-bottom-right: linear-gradient(135deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-top-left: linear-gradient(225deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-bottom-left: linear-gradient(315deg, #fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
$gradient-radial: radial-gradient(#fffaf6ff, #7c8b74ff, #252525ff, #dde3d8ff);
```

#### 2. Tailwind CSS Theme Configuration (`tailwind.config.ts`)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        snow: {
          DEFAULT: '#FFFAF6',
          light: '#FFFFFF',
        },
        'dusty-olive': {
          DEFAULT: '#7C8B74',
          dark: '#62705B',
          light: '#93A38B',
        },
        'carbon-black': {
          DEFAULT: '#252525',
          dark: '#171717',
          light: '#383838',
        },
        'soft-linen': {
          DEFAULT: '#DDE3D8',
          dark: '#CAD1C5',
          light: '#EAF0E5',
        },
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(#FFFAF6, #7C8B74, #252525, #DDE3D8)',
        'brand-gradient-r': 'linear-gradient(90deg, #FFFAF6, #7C8B74, #252525, #DDE3D8)',
        'brand-gradient-b': 'linear-gradient(180deg, #FFFAF6, #7C8B74, #252525, #DDE3D8)',
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 3. Contrast & Accessibility Matrix (WCAG 2.1 AA Compliance)
- **Carbon Black (`#252525`) on Snow (`#FFFAF6`):** Contrast ratio **$14.2:1$** (exceeds WCAG AAA standard of $7.0:1$). Used for long-form Journal body copy and primary headlines.
- **Carbon Black (`#252525`) on Soft Linen (`#DDE3D8`):** Contrast ratio **$11.3:1$** (exceeds WCAG AAA). Used for secondary card fills and table text.
- **Snow (`#FFFAF6`) on Carbon Black (`#252525`):** Contrast ratio **$14.2:1$** (exceeds WCAG AAA). Used for inverted dark panels, footers, and primary buttons.
- **Dusty Olive (`#7C8B74`):** Used for large typography ($18\text{px}+$ where minimum contrast requirement is $3.0:1$), graphical UI borders, interactive pills, and filled button containers.

---

## 3. Information Architecture (Site Map)

```
https://ve.ug/
├── /                          [Homepage: Buyer & Vendor Value Proposition, Social Proof]
├── /about                     [Manifesto, Mission, Founder Story, Culture]
├── /sell                      [Vendor Acquisition Landing, Value Proposition, Fee Tier Overview]
│   └── CTA                    --> External handoff to {vendor-portal-url}/register
├── /app                       [App Download Landing, Device OS Detection, QR Code, Feature Previews]
├── /trust                     [Trust Reports: Monthly Operational Performance Index]
│   └── /trust/[month]         [Single Report: Delivery Rates, Order Volumes, Resolution Metrics]
├── /journal                   [Content Hub: Fashion Trends, Vendor Stories, Kampala Culture]
│   └── /journal/[slug]        [Article View: Editorial Content, Rich Video/Photo Embeds]
├── /faq                       [Accordion Support Hub: Orders, Payments, Delivery, Returns]
├── /legal
│   ├── /terms                 [Terms of Service: Buyer & Vendor Legal Agreements]
│   └── /privacy               [Privacy Policy: Data Protection & DPPA 2019 Compliance]
├── /contact                   [Direct Contact: WhatsApp Click-to-Chat, Escalation Email]
├── /press                     [Press & Media Kit: Brand Assets, Boilerplate, Media Inquiries - Stub]
├── /robots.txt                [Search Engine & AI Crawler Policies]
├── /sitemap.xml               [Dynamic XML Sitemap for Search Crawlers]
└── /llms.txt                  [Curated Markdown Summary for LLM Retrieval & Citation]
```

---

# Part II: Screen-by-Screen Specifications

## 4. Screen — Homepage (`/`)

### 4.1 Purpose & Conversion Hierarchy
The primary public conversion surface. Conversion priority:
1. **Primary:** Convert prospective fashion buyers into mobile app downloads.
2. **Secondary:** Direct prospective boutique and Instagram/WhatsApp vendors toward the `/sell` funnel.

### 4.2 Structural Sections
1. **Hero Section:**
   - Full-bleed, culturally grounded imagery/video depicting authentic Kampala street style, real local models, and genuine boutique garments. Explicitly avoids stock photography and generic Western SaaS aesthetics.
   - Core Headline: *“Fashion, Found. The first time shopping online feels safe.”*
   - Primary Action: Platform-aware “Get the App” CTA button (see §7.3).
   - *LCP Priority Asset Preload:* The primary Largest Contentful Paint (LCP) hero visual must declare `priority={true}` in `next/image` (which outputs `fetchpriority="high"` and an HTML `<link rel="preload">` tag in the document `<head>`). Never apply `loading="lazy"` or hydration-gated conditional rendering to the hero image.
2. **Live Trust Strip:**
   - Single-line dynamic metric bar pulled from the most recent published Trust Report:
     > *“Month 3: 2,847 orders delivered · 98.2% on-time · 42 verified Kampala boutiques.”*
3. **How Ve Works (3-Step Visual Card System):**
   - Step 1: *Discover* — TikTok-style FYP feed curated from verified local designers and thrift curators.
   - Step 2: *Try On* — AI Virtual Try-On (VTO) mapped to personal measurements.
   - Step 3: *Arrives* — Reliable boda-boda doorstep delivery with package inspection before final cash/MoMo release.
4. **Curated Social Proof Strip (`#VerifiedByVe`):**
   - High-performance, lightweight photo cards featuring real buyer unboxings.
   - *Strict Prohibition of Live Third-Party Iframes:* To prevent external trackers and heavy script bundles from blowing the mobile 3G performance budget, **live social iframes (`@instagram/embed`, TikTok embed widgets) are strictly prohibited**. All cards must render Cloudinary-cached static WebP poster images with SVG play badges. Tapping opens a lightweight client modal video player or deep-links directly to the native app/post.
   - *Fixed Aspect Ratios & Layout Stability (CLS Defense):* All media containers across the homepage must define explicit, fixed aspect ratios (`aspect-[4/5]`, `aspect-square`, or `aspect-video`) or hardcoded `width`/`height` attributes in `next/image`. This eliminates layout recalculations as images download over unstable 3G networks, strictly enforcing Cumulative Layout Shift (CLS) $\le 0.05$.
5. **Vendor Teaser Strip:**
   - Focused value pitch: *“Sell where Kampala shops. Next-day payouts, zero delivery headaches.”*
   - Secondary Action: Text link / pill button $\rightarrow$ `/sell`.
6. **Global Footer:**
   - Legal links (`/legal/terms`, `/legal/privacy`), Social icons (Instagram, TikTok, WhatsApp), `/press`, and copyright info.

### 4.3 UI States & Edge Cases

| State / Condition | System Behavior |
|---|---|
| **Trust Report Published** | Displays metrics from the latest published monthly report. |
| **No Report Published (Pre-Launch)** | Displays brand commitment line: *“Building Uganda's most reliable fashion community — first monthly report lands at Month 1.”* |
| **UGC Feed Empty** | UGC strip collapses completely. No broken skeletons or blank placeholder containers. |
| **Slow 3G Connection** | Inlines critical CSS, preloads hero LCP asset via `priority={true}` (`fetchpriority="high"`), preserves layout geometry with fixed aspect ratios (CLS $\le 0.05$), and defers all below-the-fold media until browser idle. |

---

## 5. Screen — About / Manifesto (`/about`)

### 5.1 Purpose
Articulates Ve’s origin, cultural mission, and operational ethos. Establishes why Ve was founded: to eliminate the systemic sizing distrust and delivery anxiety endemic to Ugandan e-commerce.

### 5.2 Sectional Breakdown
- **The Manifesto:** Core text highlighting fashion as personal expression and why traditional platforms fail Ugandan youth.
- **The Problem Statement:** Unreliable sizing, bait-and-switch garments, late boda riders, and non-existent refund policies.
- **The Operational Fix:** Why Ve took over the delivery network, built Virtual Try-On, and holds funds in escrow until delivery is verified.
- **Founder’s Note:** Authentic, build-in-public letter from Ahebwa detailing the vision.
- **Proof Anchor:** Deep link directly to `/trust` rather than reciting unverified claims inline.

### 5.3 Technical States
Static SSG content. Rebuilt on Git push or CMS publish.

---

## 6. Screen — Sell on Ve (`/sell`)

### 6.1 Purpose & Architectural Handoff
Pitches boutique owners, Instagram thrift curators, and local fashion designers on joining Ve.

> [!IMPORTANT]
> **Strict Architecture Boundary:** This screen does **not** host the vendor KYC application form. Per `ve_vendor_portal_specification.md` §2.1, vendor registration requires authenticated Firestore/Supabase storage, document upload (National ID/Business Registration), and admin review queues. **The primary CTA deep-links to `{vendor-portal-url}/register`.**

### 6.2 Value Propositions (Vendor-Specific)
- **Guaranteed Predictable Payouts:** Scheduled Net-7, Net-3, or Net-1 payouts directly to MTN MoMo, Airtel Money, or bank accounts.
- **End-to-End Logistics Ownership:** Ve handles boda dispatch, package pickup, buyer delivery, and return triage. Vendors never negotiate with riders.
- **Zero Sizing Returns:** AI Virtual Try-On ensures customers know how clothes fit before ordering.
- **Fast Catalog Ingestion:** Turn Instagram photos into live listings in under 60 seconds using AI auto-tagging.

### 6.3 Tier Overview
Simplified presentation of the three vendor tiers (Standard, Preferred, Elite) highlighting commission advantages (e.g., *"Commissions starting as low as 6%"*) without overwhelming visitors with the complex category-by-category backend commission matrix.

### 6.4 Low-Friction Lead Capture
- **Primary Action (Direct Registration):** Prominent button $\rightarrow$ `https://vendor.ve.ug/register` (direct handoff to the authenticated vendor onboarding and KYC portal).
- **Secondary Action (Zero-Dependency Inbound Lead Capture):** *"Not ready yet? Chat with our merchant onboarding team on WhatsApp."*
  - **Pragmatic Implementation:** Lean WhatsApp click-to-chat button linking directly to:
    `https://wa.me/{number}?text=Hi%20Ve%20Team%2C%20I%20run%20a%20fashion%20business%20and%20want%20to%20learn%20about%20selling%20on%20Ve`
  - **Architectural Rationale:** Eliminates bulky third-party form embeds (saving 80KB+ third-party JavaScript) and avoids the operational complexity of maintaining external rate-limiting backends (e.g., Upstash Redis) or phone verification services on public unauthenticated web forms for V1.
  - **Direct Inquiry Fallback:** Secondary text link displaying `vendors@ve.ug` for desktop or enterprise boutique inquiries.

### 6.5 UI States

| Interaction / State | UI Output |
|---|---|
| **Primary CTA Tap** | Immediate outbound navigation to Vendor Portal registration (`vendor.ve.ug/register`). |
| **WhatsApp Inquiry Tap** | Opens native WhatsApp app (mobile) or WhatsApp Web (desktop) with pre-populated onboarding message. |
| **Network Interruption / Offline** | Fallback card displays direct vendor contact numbers and email (`vendors@ve.ug`). |

---

## 7. Screen — Get the App (`/app`)

### 7.1 Purpose & Growth Attribution
The central landing page for all outbound marketing campaigns, campus ambassador flyers, creator UTM links, and physical QR codes.

### 7.2 Page Structure
- **Device-Aware Download Badges:** Official Google Play and Apple App Store badges.
- **Dynamic Desktop QR Code:** Renders a high-contrast QR code on desktop viewports so users can instantly scan with their phones to download.
- **Feature Walkthrough:** Highlights the FYP Video Feed, Virtual Try-On fitting room, and Mobile Money checkout.

### 7.3 Platform Detection & Referral Preservation
- **User-Agent Detection:**
  - If iOS user-agent is detected $\rightarrow$ Visually elevate and highlight the App Store badge.
  - If Android user-agent is detected $\rightarrow$ Visually elevate the Google Play badge.
  - If Desktop $\rightarrow$ Display QR code alongside both badges.
- **Referral Parameter Capture (`?ref=`, `utm_*`):**
  - Extract incoming referral/ambassador codes from URL query parameters.
  - Write code into a 30-day cookie (`ve_ref`) and client `localStorage`.
  - Append referral code into store outbound links where supported.

### 7.4 App-Install Attribution Resolution (`DECISION NEEDED #4`)
Because Firebase Dynamic Links has been permanently shut down by Google:
- **Phase 1 Approach (Zero-Cost / Low Overhead):** Capture the referral code in the web cookie. When the user taps the Play Store button, pass `referrer=utm_source%3D{code}` via the Google Play Install Referrer API. On iOS (where App Store referral pass-through is restricted), copy the code to the user's clipboard upon tapping download and prompt auto-detection in Flutter (`Clipboard.getData`) during in-app signup.
- **Phase 2 Approach:** Evaluate dedicated MMP providers (Branch, Adjust) once GMV justifies monthly SaaS fees.

---

## 8. Screen — Trust Reports (`/trust` & `/trust/[month]`)

### 8.1 Purpose
The permanent, crawlable home for Ve’s monthly operational scorecards. While social media broadcasts highlight these numbers ephemerally, the `/trust` directory provides an immutable, transparent record of operational performance.

### 8.2 Data Structure & Metrics Schema
Each monthly report (`/trust/2026-08`) renders verified metrics:
- **Completed Orders:** Total gross packages delivered.
- **On-Time Delivery Rate:** Percentage of orders delivered within the promised boda delivery window.
- **Return Rate & Resolution:** Total return percentage and percentage resolved with full refunds or sizing replacements within 48 hours.
- **Active Verified Boutiques:** Count of active vendors meeting quality standards.
- **VTO Try-On Sessions:** Number of virtual try-on renders processed.
- **"What Went Wrong & What We Fixed":** An honest narrative breakdown of operational bottlenecks encountered during the month and exact fixes deployed.

### 8.3 Data Pipeline & Database Aggregation Architecture
The Trust Report pipeline leverages Supabase Postgres as the single source of truth, engineered to prevent memory exhaustion, scale crashes, and silent data loss:

1. **Database-Level Metric Aggregation (Postgres RPC / Materialized Views):**
   - All monthly metrics (`Completed Orders`, `On-Time Delivery Rate`, `Return Rate & Resolution`, `Active Verified Boutiques`, `VTO Try-On Sessions`) must be computed directly inside PostgreSQL via a stored RPC procedure (`get_trust_report_metrics(report_month_param)`) or a pre-aggregated Materialized View (`trust_report_monthly_metrics`).
   - *Strict Runtime Memory Prohibition:* Application code and server functions are **strictly prohibited** from querying raw transactional rows (`orders`, `deliveries`, `boutiques`) into Node.js server memory to perform JavaScript aggregations (`.length`, `.filter()`, `.reduce()`). In-memory aggregation exhausts the V8 runtime heap, triggers Lambda/Serverless Cold Start timeouts, and causes exponential database bandwidth and egress costs as order volumes scale.
2. **PostgREST Scale Safety & Cursor Pagination:**
   - Supabase's PostgREST layer automatically and silently caps unconstrained queries at 1,000 rows without returning an error (per `Pagination & Scale Traps.md`).
   - The `/trust` archive directory must use deterministic cursor pagination sorted on a composite key (`ORDER BY report_month DESC, id DESC`). Standard offset pagination (`OFFSET 1000`) is prohibited due to linear performance degradation on deep scans.
   - Total archive counts must be queried using Supabase's `{ count: 'exact', head: true }` parameter, retrieving the header count without fetching payload rows into memory.
3. **Scheduled Daily ISR (Zero Public DB Hits):**
   - Trust Report pages are statically compiled at build time and cached at the Vercel Edge CDN using Next.js Incremental Static Regeneration with a scheduled daily cron interval:
     ```typescript
     // app/trust/[month]/page.tsx
     export const revalidate = 86400; // Revalidate at most once every 24 hours
     ```
   - Public visitors and search crawlers hit the pre-rendered edge cache with zero active database queries or connection pool consumption.

### 8.4 UI States

| Condition | State Presentation |
|---|---|
| **Archive Available** | Grid of monthly report cards ordered chronologically (newest first). |
| **Pre-Launch / Month 0** | Hero card: *“Trust Report #001 publishes at the close of our first 30 days of live operations. See our launch commitments below.”* |
| **Social Share Action** | One-tap share button generating pre-formatted WhatsApp text with link and rich preview card. |

---

## 9. Screen — Journal (`/journal` & `/journal/[slug]`)

### 9.1 Purpose
The durable content marketing engine and search indexation anchor. Provides long-form editorial longevity to fashion trends, styling advice, and vendor spotlights that otherwise disappear in social media feeds.

### 9.2 Content Pillars & Structure
- **Filterable Taxonomy:**
  - *Vendor Spotlights:* Behind-the-scenes profiles of local artisans, thrift curators, and boutique founders.
  - *Kampala Style & Culture:* Wardrobe styling guides, event wear guides, traditional/ankara fusion.
  - *Consumer Guides:* How to identify authentic fabrics, care for denim, and get perfect VTO fit results.
- **Post Layout:** Responsive typography, author attribution, reading time estimate, optimized Cloudinary image galleries, and embedded short-form video clips (served locally via WebP/MP4, avoiding heavy third-party iframes).
- **Server-Side Catalog Pagination:** The `/journal` index must enforce server-side pagination (12 articles per page) using Next.js URL search parameters (`/journal?page=2`). Client-side infinite scroll is strictly prohibited; unbounded DOM tree expansion degrades rendering performance and risks browser tab crashes on memory-constrained mobile devices (per `Rendering Large Lists.md`).

### 9.3 Shoppable Product Tagging (`DECISION NEEDED #6`)
- **Phase 1 Recommendation:** Keep Journal articles purely editorial with direct deep-links to app store downloads. Defer web-based shoppable product cards (`/product/[id]`) to Phase 2 to avoid having to design, build, and maintain public web product detail and cart views.

### 9.4 Machine-Liftable Editorial Architecture (AEO & GEO Standards)
To maximize citation frequency in Generative Engine Optimization (GEO) platforms (Perplexity, SearchGPT, Claude, Google AI Overviews), all editorial content published on `/journal` must adhere to strict structural authoring rules (per `Writing Structure That Gets Cited.md`):

1. **Answer-First Rule (Inverted Pyramid):**
   - Every informational section and article must state the direct, definitive answer within the first 30–50 words before elaborating with background context, nuances, or storytelling.
   - *Rationale:* AI retrieval models extract 200–300 token passages. If an article begins with introductory fluff, the passage is discarded during retrieval ranking.
2. **Question-Led Headings (H2 / H3):**
   - Section headings must be phrased as natural-language questions directly matching user search queries:
     - *Correct:* `## How long does boda-boda delivery take in Kampala?`
     - *Incorrect:* `## Swift Wheels & Speed`
     - *Correct:* `### How does Ve verify authentic boutique clothing?`
     - *Incorrect:* `### Authenticity Matters`
3. **High-Citability Formats:**
   - **Markdown Comparison Tables:** Fee structures, vendor commission tiers, and delivery timeframes must be rendered as clean markdown tables. AI answer engines prioritize structured tabular data above all other formats when compiling comparative answers.
   - **Numbered Step Sequences:** Operational workflows (how to initiate a return, how to take photos for VTO) must use strictly ordered lists (`1.`, `2.`, `3.`) beginning with active imperative verbs.
   - **Stat & Definition Callouts:** Concrete numbers and operational guarantees must use bold lead-in syntax:
     - **Delivery Window:** *Orders delivered within 4 hours in Central Kampala.*
     - **Escrow Guarantee:** *Funds released to vendor only after buyer inspection.*
4. **Top TL;DR Summary Block:**
   - Every long-form guide must render an executive summary callout block immediately beneath the primary H1 headline containing a 2–3 sentence high-density factual synopsis.
5. **Primary Source Authority Anchoring:**
   - Whenever articles discuss commercial legality, business registration, or consumer privacy, they must link directly to authoritative Ugandan government portals (e.g., Uganda Registration Services Bureau [URSB](https://ursb.go.ug/) for vendor company registration, and Personal Data Protection Office [DPPA](https://www.dataprotection.go.ug/) for privacy rights). AI citation algorithms heavily weigh outbound links to recognized national authorities as evidence of factual rigor.

---

## 10. Screen — FAQ / Support (`/faq`)

### 10.1 Purpose
Self-serve resolution hub for common questions, serving both external prospective users and in-app webviews (`Settings $\rightarrow$ Support $\rightarrow$ FAQ`).

### 10.2 Categorized Accordion Modules
- **Ordering & Payments:** MTN MoMo, Airtel Money, DPO card processing, Cash on Delivery rules, escrow protection.
- **Delivery & Tracking:** Delivery timeframes across Kampala divisions, boda rider verification, delivery fees.
- **Returns & Refunds:** The 48-hour return window, acceptable return conditions, refund processing speed.
- **Virtual Try-On (VTO):** Photo privacy, camera capture guidelines, sizing accuracy guarantees.
- **Selling on Ve:** Commission rates, onboarding requirements, inventory sync.

> [!TIP]
> **Direct-Answer Inversion for FAQ Accordions (AEO & Rich Snippets):**
> Each accordion item must structure its response so that the **first sentence provides the complete, self-contained direct answer** (e.g., *“Yes, Ve holds buyer payments in escrow and only releases funds to vendors after package inspection at delivery.”*). Secondary qualifications, step-by-step instructions, and edge cases follow thereafter. This ensures seamless ingestion by Google's "People Also Ask" Rich Results and AI answer engine snippet scrapers.

### 10.3 Unresolved Inquiry Escalation
Every FAQ section concludes with a persistent, low-friction escalation trigger:
- *“Couldn't find what you need? Chat with our Kampala team on WhatsApp.”*
- Tapping triggers a direct `https://wa.me/{number}?text=Support%20Inquiry` link.

---

## 11. Screen — Terms of Service & Privacy Policy (`/legal/*`)

### 11.1 Purpose & Compliance Context
Mandatory public legal documentation required for:
- DPO Pay merchant underwriting and account activation.
- Apple App Store & Google Play Store privacy approvals.
- Uganda Data Protection and Privacy Act (DPPA 2019) compliance.

### 11.2 Legal Content Status & Blocking Gate (`DECISION NEEDED #7`)
Actual legal text must be reviewed and stamped by qualified Ugandan legal counsel.
- **Launch Policy:** Publish well-structured, professional draft policies at stable URLs before submitting to payment gateways and app stores.
- **URL Immutability:** Routes must remain strictly `/legal/terms` and `/legal/privacy` so in-app webview pointers and gateway configurations never break.

### 11.3 Layout Requirements
- Clean legal template with sticky Table of Contents sidebar for rapid section jumping.
- Version history stamp and *“Effective Date”* indicator.
- Explicit clauses covering VTO biometric photo processing, 48-hour escrow holds, and boda delivery liability.

---

## 12. Screen — Contact (`/contact`)

### 12.1 Purpose
Provides accessible, human touchpoints for customers, vendors, press, and enterprise partners without relying on slow, unmonitored email tickets.

### 12.2 Channels & Hierarchy
1. **Primary Support Channel (WhatsApp Business):**
   - Click-to-chat button pre-configured with greeting: *“Hi Ve Support, I have a question regarding...”*
2. **Dedicated Email Inboxes:**
   - General & Support: `hello@ve.ug` / `support@ve.ug`
   - Vendor Inquiries: `vendors@ve.ug`
   - Press & Partnerships: `press@ve.ug`
   - Legal & Data Protection Officer: `legal@ve.ug` / `dpo@ve.ug`
3. **Physical Address / Registered Office:**
   - Kampala registered office address for corporate legitimacy and regulatory disclosures.

### 12.3 Outbound Email Routing & Header Injection Defenses
Even with WhatsApp operating as the primary interactive escalation channel, any server-side contact forms or programmatic email forwarding services (e.g., Next.js Server Actions or Route Handlers dispatching to `support@ve.ug` or `vendors@ve.ug`) must implement defensive endpoint security (per `Securing Endpoints.md`):

1. **Defensive CRLF Sanitization (Header Injection Defense):**
   - All text inputs from web forms (such as `name`, `email`, `subject`, and single-line metadata) must be strictly sanitized by stripping Carriage Return (`\r` / `%0D`) and Line Feed (`\n` / `%0A`) characters before passing them to the outbound mail transport.
   - *Attack Prevention:* Unsanitized CRLF characters allow attackers to inject additional SMTP command headers (e.g., `Bcc: victim-list@external.com`), effectively transforming the production email server into an open relay for spam and phishing campaigns.
2. **Generic Error Responses & Credential Masking:**
   - Outbound mail dispatch endpoints must never surface internal SMTP error logs, connection timeouts, or third-party email provider hostnames/credentials to the client.
   - In the event of a mail transport failure, the route must log the error internally with error identifiers and return a generic user-facing message:
     ```json
     {
       "success": false,
       "message": "Unable to deliver message at this time. Please reach out directly via WhatsApp."
     }
     ```

---

## 13. Screen — Press / Media Kit (`/press`)

### 13.1 Purpose & Scope (`DECISION NEEDED #8`)
- **Phase 1 Implementation:** Minimalist single-page stub containing:
  - Official brand assets (PNG/SVG logos, brand color codes, app icon renders).
  - One-paragraph company boilerplate describing Ve.
  - Direct media contact: `press@ve.ug`.
- Defers complex downloadable press kits until formal seed fundraising or public PR launch.

---

# Part III: Cross-Cutting Systems & Infrastructure

## 14. Performance Budget & 3G Optimization

### 14.1 The Kampala Network Floor
In Kampala, mobile data is sold in finite MB bundles, network connections regularly throttle to 3G speeds, and consumer smartphones predominantly feature mid-tier processors with constrained RAM. The website must be engineered to feel instantaneous under these constraints.

### 14.2 Strict Performance Budget

| Performance Metric | Hard Threshold | Enforcement Method |
|---|---|---|
| **Largest Contentful Paint (LCP)** | $\le 2.5\text{s}$ on simulated Fast 3G | Preload critical hero image (`priority={true}`), inline critical CSS. |
| **First Input Delay (FID) / INP** | $\le 100\text{ms}$ | Minimal client-side JavaScript execution, chunk boundary splitting. |
| **Cumulative Layout Shift (CLS)** | $\le 0.05$ | Explicit aspect-ratio containers on all images/media. |
| **Initial Client JS Bundle (Gzip)** | $\le 150\text{KB}$ entry JS | Monitored via `@next/bundle-analyzer` in CI pipeline. |
| **Total Page Weight (Gzip/Brotli)** | $\le 500\text{KB}$ total payload | Zero heavy third-party tracking scripts or live iframes. |
| **Image Asset Formats** | WebP / AVIF only | Cloudinary automated optimization (`f_auto,q_auto`). |

### 14.3 Asset Optimization Rules
- **No Third-Party Social Iframes:** Do not inject `@instagram/embed` or TikTok JS widgets. Render Cloudinary-optimized static WebP posters with custom play badges opening a lightweight modal.
- **Font Optimization:** Subset Google Fonts (Inter / Display pairing) to Latin characters only, bundled locally via `next/font/google` with `display: 'swap'`.
- **Preconnect & DNS-Prefetch:** Preconnect to Cloudinary (`res.cloudinary.com`) and Google Analytics in the document head.

### 14.4 Two-Tier Edge Caching Architecture
To balance instantaneous page loads on mobile networks with content fresh release cycles, HTTP caching headers are governed by a strict two-tier policy (per `Client Caching & Refetching.md`):

1. **Tier 1 — Immutable Hashed Assets (`/_next/static/*`):**
   - All static JavaScript chunks, compiled CSS stylesheets, and build-time media carry unique cryptographic content hashes in their filenames.
   - Served with strict 1-year immutable caching:
     ```http
     Cache-Control: public, max-age=31536000, immutable
     ```
   - Client browsers and edge nodes cache these assets permanently, eliminating redundant conditional HTTP requests.
2. **Tier 2 — Dynamic HTML & Scheduled ISR Routes:**
   - Public marketing pages (`/`, `/about`, `/sell`, `/faq`), Trust Reports (`/trust/*`), and Journal articles (`/journal/*`) use Next.js Incremental Static Regeneration with daily revalidation (`revalidate = 86400`).
   - Served from edge CDN nodes with stale-while-revalidate headers:
     ```http
     Cache-Control: public, s-maxage=86400, stale-while-revalidate=59
     ```
   - Edge CDNs serve the cached HTML instantly. Upon cache expiration, the edge serves stale content while revalidating asynchronously in the background, shielding the origin server from traffic spikes.

### 14.5 GPU Compositor-Only CSS Motion Standards
On budget Android hardware common in Kampala (MediaTek Helio and Unisoc chipsets), animating layout properties forces continuous CPU recalculations, dropping rendering frame rates below 30fps (per `Browser-Aware Web Design.md`):

1. **Strict Compositor Whitelist:**
   - All CSS animations, hover micro-interactions, accordion expansions, and transitions must animate **only** GPU-composited properties:
     - `transform` (e.g., `transform: translate3d(0, -4px, 0)`, `scale(1.02)`)
     - `opacity`
2. **Prohibited Geometric & Paint Triggers:**
   - Animating geometric properties (`width`, `height`, `top`, `bottom`, `left`, `right`, `margin`, `padding`) or paint-heavy properties (`box-shadow`, `border-width`, `background-color`) is **strictly prohibited**.
3. **Accessibility Override (Reduced Motion):**
   - The global stylesheet must include an explicit reduced-motion query that eliminates non-essential transitions for users requesting low motion:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, ::before, ::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
         scroll-behavior: auto !important;
       }
     }
     ```

---

## 15. Analytics, Referral Attribution & Consent

### 15.1 GA4 & Core Web Vitals Pipeline via `@next/third-parties`
To monitor growth and user acquisition without incurring render-blocking performance penalties, Google Analytics 4 is integrated via official Next.js architecture (per `GA4 for Next.js.md`):

1. **Non-Blocking GA4 Mounting:**
   - Standard GA4 script tags inject render-blocking JavaScript into the document `<head>`. Ve implements GA4 using `@next/third-parties/google` mounted at the root layout (`app/layout.tsx`) strictly **after** `{children}`:
     ```tsx
     import { GoogleAnalytics } from '@next/third-parties/google';

     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="en">
           <body>
             {children}
             <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
           </body>
         </html>
       );
     }
     ```
2. **Native Real-User Web Vitals Telemetry:**
   - Rather than loading heavy third-party monitoring libraries, real-world user performance (LCP, INP, CLS) is captured via Next.js's native `useReportWebVitals` hook and forwarded directly to GA4 custom events:
     ```tsx
     // app/web-vitals.tsx
     'use client';
     import { useReportWebVitals } from 'next/web-vitals';

     export function WebVitals() {
       useReportWebVitals((metric) => {
         if (typeof window !== 'undefined' && window.gtag) {
           window.gtag('event', metric.name, {
             value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
             event_label: metric.id,
             non_interaction: true,
           });
         }
       });
       return null;
     }
     ```

### 15.2 Google Consent Mode v2 & DPPA Compliance
Under the Uganda Data Protection and Privacy Act (DPPA 2019), collecting telemetry and storing device identifiers requires prior lawful consent:

1. **Default-Denied Consent Initializer:**
   - Before Google Analytics or GTM executes, a blocking inline script initializes Google Consent Mode v2 in a fully denied state:
     ```tsx
     // app/layout.tsx (inside <head>)
     <Script id="google-consent-default" strategy="beforeInteractive">
       {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('consent', 'default', {
           'analytics_storage': 'denied',
           'ad_storage': 'denied',
           'ad_user_data': 'denied',
           'ad_personalization': 'denied',
           'wait_for_update': 500
         });
       `}
     </Script>
     ```
2. **Attribution Opt-In Banner:**
   - A discreet, non-blocking notification bar informs visitors of referral attribution and performance measurement.
   - When the user confirms consent, a client handler executes:
     ```javascript
     gtag('consent', 'update', {
       'analytics_storage': 'granted'
     });
     localStorage.setItem('ve_consent_choice', 'granted');
     ```
   - If the user dismisses the banner or ignores it, analytics remains strictly cookieless and anonymized, ensuring full regulatory compliance.

---

## 16. Content Ownership & CMS Architecture

### 16.1 Supabase Content Architecture & Hardened RLS
The Journal articles (`articles`, `categories`, `authors`) and operational scorecards (`trust_reports`) are stored in Supabase Postgres, authored by the Ve team through the internal Ve Admin portal, and statically rendered by Next.js via ISR.

To guard against unauthorized data leakage and privilege escalation (per `Database RLS & Privilege Escalation.md`), Supabase Row Level Security (RLS) is strictly enforced:

1. **Table-Level RLS Policies:**
   - RLS is enabled across all editorial tables. The public anonymous role (`anon`) used by the marketing site has read access strictly limited to published records:
     ```sql
     ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
     ALTER TABLE trust_reports ENABLE ROW LEVEL SECURITY;

     -- Public anonymous read access restricted to published records
     CREATE POLICY "Public read published articles"
       ON articles FOR SELECT
       TO anon
       USING (is_published = true AND published_at <= NOW());

     CREATE POLICY "Public read published trust reports"
       ON trust_reports FOR SELECT
       TO anon
       USING (is_published = true);
     ```
2. **Column-Level Privilege Isolation:**
   - To prevent compromised authenticated sessions (e.g. editor accounts) from modifying sensitive publication metadata directly via the PostgREST API:
     ```sql
     -- Revoke direct column updates from standard authenticated users
     REVOKE UPDATE (is_published, author_id) ON articles FROM authenticated;
     ```
3. **Version-Controlled Policy Repository:**
   - All RLS policies, table grants, and database roles must be maintained in version-controlled migration files under `docs/rls-policies.sql`. Applying database modifications via manual Supabase dashboard clicks without code review is strictly prohibited.

### 16.2 PostgREST Single Round-Trip Embedded Joins (N+1 Elimination)
Iterative queries (e.g., querying 12 articles, then executing 12 separate database queries in a loop to fetch each author and category) create devastating N+1 query cascades (per `Eliminating N+1 Queries.md`).

All Supabase queries on the website must use PostgREST embedded foreign-key resource joins, resolving all relations in a single database round-trip:

```typescript
// lib/journal.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getPublishedArticles(page = 1, pageSize = 12) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: articles, error, count } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      published_at,
      reading_time_minutes,
      author:authors ( id, name, avatar_url ),
      category:categories ( id, name, slug )
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Supabase query error:', error.message);
    throw new Error('Failed to load journal articles');
  }

  return { articles, totalCount: count };
}
```

### 16.3 Operational Ownership Roster (`DECISION NEEDED #11`)
To prevent the site from going stale post-launch, explicit functional roles are assigned in `08_engineering_operations_readiness_plan.md`:
- **Engineering Owner:** 1 named frontend engineer responsible for Next.js build integrity, performance budgets, and deployment pipelines.
- **Content Owner:** Marketing lead / Founder responsible for authoring weekly Journal posts and compiling monthly Trust Reports by the 3rd of each month.

---

# Part IV: Comprehensive Discoverability & Visibility Strategy

## 17. Core Discoverability Principle: Trust as Evidence

Traditional SEO often focuses on keyword stuffing and acquiring vanity traffic. For Ve, discoverability serves one single objective: **making the trust story findable when Ugandan buyers and vendors experience commercial friction.**

A prospective buyer searching *"how to avoid clothes scams online Kampala"* who lands on a comprehensive Ve Trust Report is exponentially more valuable than 1,000 generic hits on an unranked fashion keyword. Every search strategy, metadata tag, and preview card must serve this trust objective.

---

## 18. Traditional Technical & Content SEO

### 18.1 Technical Crawlability & Server Component Architecture
Search engine bots and messaging app preview fetchers have finite crawling budgets and rarely execute client-side JavaScript. Technical architecture is enforced per `SEO Crawlability Playbook.md`:

1. **React Server Components (RSC) Mandate:**
   - All route entrypoints (`app/**/page.tsx`) must remain React Server Components. The `"use client"` directive is strictly prohibited at page root levels.
   - Interactive components (accordions, download modals, image lightboxes) must be encapsulated as client leaf components imported into server pages.
   - *Rationale:* When link scrapers (WhatsApp, Telegram, Twitterbot, Googlebot Smartphone) request a URL, they evaluate raw server-delivered HTML. Server components guarantee that all semantic headings, body text, structured data, and Open Graph tags are present in the initial HTTP payload.
2. **Build-Time Static Param Generation (`generateStaticParams`):**
   - Dynamic routes for monthly Trust Reports (`app/trust/[month]/page.tsx`) and Journal articles (`app/journal/[slug]/page.tsx`) must implement `generateStaticParams()` to query Supabase slugs at build time, ensuring all published pages exist as pre-rendered HTML on the edge before crawler requests arrive.
3. **Automated Dynamic Sitemap (`app/sitemap.ts`):**
   - Next.js dynamically renders `/sitemap.xml` by combining static routes with published entries from Supabase:
     ```typescript
     // app/sitemap.ts
     import { MetadataRoute } from 'next';
     import { getPublishedSlugs } from '@/lib/journal';
     import { getPublishedReportMonths } from '@/lib/trust';

     export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
       const [articles, reports] = await Promise.all([
         getPublishedSlugs(),
         getPublishedReportMonths(),
       ]);

       const baseUrl = 'https://ve.ug';

       const staticRoutes = ['', '/about', '/sell', '/app', '/trust', '/journal', '/faq', '/contact', '/legal/terms', '/legal/privacy'].map((route) => ({
         url: `${baseUrl}${route}`,
         lastModified: new Date(),
         changeFrequency: 'weekly' as const,
         priority: route === '' ? 1.0 : 0.8,
       }));

       const articleRoutes = articles.map((article) => ({
         url: `${baseUrl}/journal/${article.slug}`,
         lastModified: new Date(article.updated_at),
         changeFrequency: 'monthly' as const,
         priority: 0.7,
       }));

       const reportRoutes = reports.map((report) => ({
         url: `${baseUrl}/trust/${report.month}`,
         lastModified: new Date(report.updated_at),
         changeFrequency: 'never' as const,
         priority: 0.9,
       }));

       return [...staticRoutes, ...articleRoutes, ...reportRoutes];
     }
     ```
4. **Strict Canonical Tagging:**
   - Every page emits a canonical link (`<link rel="canonical" href="https://ve.ug{pathname}" />`) generated via Next.js metadata, preventing duplicate-content penalties from marketing tracking parameters (`?utm_source=`, `?ref=`).
5. **Clean Error Handling:**
   - Strict HTTP 404 status codes for non-existent routes (zero soft-404 redirects).

### 18.2 Content Keyword Matrix

| Intent Category | High-Value Search Queries in Uganda | Target Destination Screen | Content Focus & Narrative |
|---|---|---|---|
| **Trust & Consumer Safety** | *"is it safe to buy clothes online in Uganda"*, *"how to buy clothes safely Kampala"*, *"online boutique scams Uganda"* | `/trust` & Dedicated Journal Articles | The Ve Escrow model, 48-hour return guarantee, real delivery data. |
| **Local Fashion & Trends** | *"affordable streetwear Kampala"*, *"best thrift sellers Kampala"*, *"modern ankara dress designs 2026"* | `/journal/[slug]` | Styling guides showcasing verified boutique garments available on the app. |
| **Vendor Onboarding** | *"sell clothes online Uganda"*, *"how to grow boutique business Kampala"*, *"fashion vendor marketplace"* | `/sell` & Vendor Case Studies | Net-day payouts, zero delivery logistics headache, automated catalog tools. |

### 18.3 Keyword Research Strategy (`DECISION NEEDED #12`)
Conduct a one-time targeted keyword research pass (using Ahrefs/Semrush or Google Keyword Planner focused on the Uganda region) to establish title tags and H1 conventions for the initial 10 Journal articles.

### 18.4 Structured Data (Schema.org JSON-LD `@graph` Architecture)
Per `Structured Data Guide.md`, structured data must be consolidated into a single server-rendered `@graph` block on each route rather than fragmented scripts:

1. **Sitewide Unified Entities (`app/layout.tsx`):**
   ```json
   {
     "@context": "https://schema.org",
     "@graph": [
       {
         "@type": "Organization",
         "@id": "https://ve.ug/#organization",
         "name": "Ve",
         "url": "https://ve.ug",
         "logo": {
           "@type": "ImageObject",
           "url": "https://ve.ug/images/ve-brand-logo.png",
           "width": 512,
           "height": 512
         },
         "sameAs": [
           "https://www.instagram.com/ve.ug",
           "https://www.tiktok.com/@ve.ug",
           "https://linkedin.com/company/ve-ug"
         ]
       },
       {
         "@type": "WebSite",
         "@id": "https://ve.ug/#website",
         "url": "https://ve.ug",
         "name": "Ve",
         "publisher": { "@id": "https://ve.ug/#organization" },
         "potentialAction": {
           "@type": "SearchAction",
           "target": "https://ve.ug/journal?q={search_term_string}",
           "query-input": "required name=search_term_string"
         }
       }
     ]
   }
   ```
2. **SoftwareApplication Schema (`/app`):**
   ```json
   {
     "@type": "SoftwareApplication",
     "name": "Ve",
     "operatingSystem": "Android, iOS",
     "applicationCategory": "ShoppingApplication",
     "description": "Kampala's curated fashion marketplace featuring AI Virtual Try-On and escrow-backed doorstep boda delivery.",
     "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "UGX"
     }
   }
   ```
3. **Contextual Entities:**
   - **`/faq`:** `FAQPage` mapping all accordion questions and direct answers for Google Rich Snippets.
   - **`/journal/[slug]`:** `Article` or `BlogPosting` with `headline`, `author` (Person), `datePublished`, `dateModified`, and Cloudinary preview images.
   - **All Nested Routes:** `BreadcrumbList` linking route ancestry.

### 18.5 Smart 404 & AI Hallucination Recovery (`app/not-found.tsx`)
AI search engines (Perplexity, ChatGPT) frequently synthesize or hallucinate plausible URLs when referencing platforms (e.g. `ve.ug/trust-report`, `ve.ug/kampala-thrift`, `ve.ug/sizing-guide`). To capture this lost traffic and preserve search authority (per `Technical AEO.md`):

1. **HTTP 404 Integrity:**
   - The page must emit a strict HTTP 404 status code (never a 301/302 soft-404 redirect to the homepage, which triggers Google crawl penalties).
2. **Contextual Slug Keyword Matching:**
   - The `app/not-found.tsx` component parses the incoming URL path, tokenizes the slug, and matches keywords to valid destinations:
     - Contains `trust`, `report`, `delivery`, `metric` $\rightarrow$ Suggests `/trust` (*“View our monthly Trust Reports”*).
     - Contains `sell`, `vendor`, `boutique`, `shop`, `onboard` $\rightarrow$ Suggests `/sell` (*“Learn about selling on Ve”*).
     - Contains `vto`, `try`, `size`, `app`, `download`, `apk` $\rightarrow$ Suggests `/app` (*“Download the Ve mobile app”*).
     - Contains `style`, `fashion`, `thrift`, `guide`, `trend` $\rightarrow$ Suggests `/journal` (*“Read style guides on Ve Journal”*).
     - Contains `help`, `support`, `return`, `escrow`, `refund` $\rightarrow$ Suggests `/faq` (*“Check our Customer FAQ”*).
3. **Monthly AI Hallucination Log Audit:**
   - Marketing and engineering review 404 query logs in Google Search Console and GA4 on the 1st of each month. Any hallucinated URL receiving $\ge 5$ visits/month is added to `next.config.js` as an explicit permanent 301 redirect to the appropriate canonical route.

---

## 19. AI & Answer-Engine Visibility (GEO)

### 19.1 What Generative Engine Optimization (GEO) Is
Generative AI systems (ChatGPT Search, Perplexity, Google AI Overviews, Claude) increasingly answer commercial intent questions directly rather than presenting a 10-link search page. When a user asks: *"Where can I buy thrift clothes online in Kampala without getting scammed?"*, the objective is for the AI model to cite Ve as the authoritative platform.

### 19.2 Dynamic Crawler Policy (Search vs. Training Bot Disaggregation)
A critical strategic distinction is enforced between **Search & Retrieval Bots** and **Training Scrapers** (`DECISION NEEDED #13`):
- **Search & Retrieval Bots (ALLOWED):** These bots query the web in real-time to answer end-user conversational prompts, citing source links and driving referral visits. Allowing them ensures Ve appears in live AI answers.
- **Model Training Scrapers (DISALLOWED):** These bots harvest proprietary editorial and brand content to train offline neural network weights without providing citation or traffic attribution.

This policy is implemented in `app/robots.ts`:

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Traditional search engines & AI answer/retrieval crawlers (ALLOWED)
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'OAI-SearchBot',    // OpenAI Search (SearchGPT)
          'ChatGPT-User',     // User-directed ChatGPT browsing
          'Claude-SearchBot', // Anthropic real-time search
          'PerplexityBot',    // Perplexity AI search
        ],
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      // 2. Automated AI training scrapers (DISALLOWED to protect content IP)
      {
        userAgent: [
          'GPTBot',           // OpenAI foundational model training
          'ClaudeBot',         // Anthropic model training
          'Google-Extended',  // Google Gemini training scraper
          'CCBot',            // Common Crawl bulk scraper
          'Meta-ExternalAgent',
          'Bytespider',       // ByteDance AI scraper
        ],
        disallow: '/',
      },
      // 3. Default fallback rule
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: 'https://ve.ug/sitemap.xml',
  };
}
```

### 19.3 Curated Machine Interface: `/llms.txt` (Dynamic Route Handler)
Per `Technical AEO.md`, AI agents parse clean markdown significantly faster and more accurately than complex HTML DOMs. Ve provides a dedicated Route Handler at `app/llms.txt/route.ts` (`DECISION NEEDED #14`):

```typescript
// app/llms.txt/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Ve

> Ve is Kampala's curated fashion marketplace and Virtual Try-On (VTO) platform. We eliminate sizing uncertainty and online commerce fraud across Uganda through photo-based AI sizing, 48-hour payment escrow, and verified local boda-boda doorstep delivery.

## Core Capabilities
- Virtual Try-On (VTO): AI measurement mapping for accurate clothing fit prior to checkout.
- Escrow Protection: Buyer funds are held securely until package inspection at delivery.
- Doorstep Boda Logistics: Inspected delivery within 4 hours across Central Kampala.
- Vendor Economics: Predictable Net-7, Net-3, or Net-1 payouts via MTN MoMo and Airtel Money.

## Key Documentation & Public Verification
- [Trust Reports](https://ve.ug/trust): Monthly verified scorecards of delivery speed, return rates, and verified boutique counts.
- [Sell on Ve](https://ve.ug/sell): Merchant onboarding terms, tier structures, and commission rates.
- [Mobile App](https://ve.ug/app): iOS and Android consumer download links.
- [Customer FAQ](https://ve.ug/faq): Return policies, escrow mechanics, and payment guidelines.
- [About & Manifesto](https://ve.ug/about): Operational ethos and Kampala fashion mission.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
```

### 19.4 Content Extraction Optimization
- **Direct-Answer Inversion:** Every FAQ item and Journal section must state the direct factual answer in the first sentence before providing elaborations.
- **Verifiable Quantitative Anchors:** Consistently use concrete, dated metrics (e.g., *"98.2% on-time delivery across 2,800+ orders in Q3 2026"*) which language models preferentially select as citations over vague adjectives.
- **Entity Consistency:** Maintain identical company naming and descriptors (*"Ve — Kampala's Curated Fashion Marketplace and Virtual Try-On Platform"*) across web, social profiles, and press releases.

---

## 20. Social Sharing & Rich Link Previews (Open Graph)

### 20.1 The WhatsApp Growth Loop
Per `ve_habit_strategy.md` §5.1, direct peer-to-peer sharing inside WhatsApp groups and direct chats is the primary vector of viral discovery in Uganda. When a link is shared into WhatsApp, the **Open Graph link preview card is the actual UI** most users evaluate before deciding to tap.

```
+-------------------------------------------------------+
|  [ Dynamic Branded OG Image: 1200 x 630 WebP ]        |
|  "Month 3 Trust Report: 98.2% On-Time Delivery"       |
+-------------------------------------------------------+
|  Ve — Fashion, Found                                  |
|  Verified clothes discovery and virtual try-on...     |
|  ve.ug/trust/2026-08                                  |
+-------------------------------------------------------+
```

### 20.2 Automated Dynamic OG Image Generation (`@vercel/og`)
To eliminate manual graphic creation for new Journal articles and monthly Trust Reports (`DECISION NEEDED #15`), cards are synthesized dynamically at edge runtime using `@vercel/og` (`ImageResponse`):

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Fashion, Found';
  const category = searchParams.get('category') || 'Trust Report';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#252525',
          color: '#FFFAF6',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7C8B74' }}>
            {category}
          </span>
          <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', color: '#DDE3D8' }}>VE</span>
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.15, maxWidth: '900px', color: '#FFFAF6' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DDE3D8', fontSize: 20 }}>
          <span>ve.ug · Kampala, Uganda</span>
          <span>Verified Fashion & Virtual Try-On</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

### 20.3 Tag Specifications
Every route must declare:
- `og:type` (`website` or `article`)
- `og:title` (Concise, $< 60$ characters)
- `og:description` (Compelling, $< 155$ characters)
- `og:image` (Absolute HTTPS URL, 1200x630, $< 300\text{KB}$)
- `twitter:card` (`summary_large_image`)

---

## 21. Local Directory Presence & Accessibility Standards

### 21.1 Local Ecosystem Footprint (`DECISION NEEDED #16`)
- **Google Business Profile:** Register Ve as a verified *Service Area Business* (covering Kampala Central, Nakawa, Kawempe, Makindye, Rubaga, and Wakiso/Entebbe) rather than a retail walk-in address.
- **Regional Startup Directories:** Maintain accurate, synchronized profiles on Crunchbase, F6S, and East African tech trackers to build clean domain authority backlinks.

### 21.2 Accessibility Standards (WCAG 2.1 AA)
- **Visual Contrast:** All body text must maintain a minimum contrast ratio of `4.5:1` against backgrounds (matching `ve-frontend_engineering_handoff.md` AC-012).
- **Alt Text:** Every image element must provide descriptive `alt` text explaining both garment styling and context.
- **Semantic Structure:** Single `<h1>` per page, hierarchical `<h2>` and `<h3>` tags, and native `<button>` and `<a>` elements for all interactive controls.

---

## 22. Measurement, Tracking & Phased Rollout Sequence

### 22.1 Essential Measurement Signals & AI Referral Regex

| Measurement Metric | Tool / Platform | Operational Significance |
|---|---|---|
| **Search Impressions & Clicks** | Google Search Console | Verifies indexing health, ranking positions, and crawl errors. |
| **Referral Traffic Breakdown** | Google Analytics 4 | Measures visits from WhatsApp, Instagram, and Ambassador UTM links. |
| **AI Answer Referrals** | GA4 Custom Channel Group | Leading indicator of Generative Engine Optimization (GEO) effectiveness. |
| **Core Web Vitals** | `useReportWebVitals` / GSC | Verifies real-user compliance with LCP $\le 2.5\text{s}$, INP $\le 100\text{ms}$, CLS $\le 0.05$. |
| **Store Download Click-Throughs** | Custom Event (`tap_app_download`)| Measures homepage and `/app` conversion efficiency. |

#### GA4 Custom Channel Grouping for AI Search Traffic
To prevent generative AI referral traffic from being swallowed into generic "Direct" or "Referral" buckets (per `Measuring AI Visibility.md`), configure a dedicated Custom Channel Group in GA4:
- **Channel Name:** `AI Search & Answer Engines`
- **Definition Rule:** `Source` matches regex:
  ```regex
  ^(.*(chatgpt|perplexity|claude|copilot|gemini|openai).*)$
  ```
- **Channel Priority:** Placed strictly **above** standard `Organic Search` and `Referral` channels.

#### Google Search Console Domain Property Verification
Verify `ve.ug` using a Cloudflare DNS TXT record (`google-site-verification=...`) at the root Domain Property level rather than URL Prefix level. This captures all subdomains (`vendor.ve.ug`, `admin.ve.ug`) and protocol variations within a unified property.

#### Monthly Manual Citation Audit Routine
On the 1st of each month, execute a standardized 5-prompt evaluation across ChatGPT, Perplexity, and Claude:
1. *"Where can I buy boutique clothes safely in Kampala?"*
2. *"How does Ve Uganda escrow work?"*
3. *"Best thrift fashion sellers in Kampala online."*
4. *"How to sell clothes on Ve Uganda?"*
5. *"What happens if clothes bought online in Kampala don't fit?"*
Log brand mention presence, link citations, and sentiment in the monthly growth scorecard.

### 22.2 Phased Rollout Sequence

```
[ Phase 1: Launch Foundations ]
  ├── Deploy core SSG screens (Home, About, Sell, App, FAQ, Contact, Legal)
  ├── Setup Google Search Console, Bing Webmaster Tools, robots.txt, sitemap.xml
  ├── Implement Dynamic OG Images and WhatsApp click-to-chat links
  └── Configure Cookieless Analytics and AI Crawler Allow Policies

[ Phase 2: Content & Authority Acceleration (Months 1–3) ]
  ├── Launch `/trust` archive with Month 1 verified operational data
  ├── Deploy `/llms.txt` and launch initial weekly Journal editorial cadence
  └── Establish local directory profiles and initiate East African tech press outreach

[ Phase 3: Scaling & Optimization (Months 3–6) ]
  ├── Conduct accessibility and Core Web Vitals audit pass
  ├── Review AI referral metrics; adjust GEO strategy based on real query logs
  └── Evaluate Shoppable Journal tags and mobile app MMP attribution integration
```

---

# Part V: Governance, Decisions & Master Verification

## 23. Master Acceptance Criteria (AC-001 through AC-019)

### AC-001 — Homepage 3G Performance Budget
- **Given** a first-time visitor opens `https://ve.ug/` on a simulated Fast 3G mobile network (1.6 Mbps down, 150ms RTT),
- **When** the page renders,
- **Then** the Largest Contentful Paint (LCP) occurs within $\le 2.5$ seconds,
- **And** the total initial asset transfer weight does not exceed $500\text{KB}$.

### AC-002 — Platform-Aware App Store Badges
- **Given** a visitor navigates to `/app`,
- **When** the page loads,
- **Then** an iOS user-agent highlights the Apple App Store badge,
- **And** an Android user-agent highlights the Google Play badge,
- **And** desktop viewports display a scannable QR code alongside both badges.

### AC-003 — Ambassador Referral Code Persistence
- **Given** a visitor arrives at any site page with a query parameter `?ref=CAMPUS_KLA`,
- **When** the initial document loads,
- **Then** the referral code `CAMPUS_KLA` is written into a 30-day cookie and local storage without blocking render,
- **And** outbound app store links append the attribution parameter.

### AC-004 — Trust Report Pre-Launch Empty State
- **Given** zero monthly trust reports have been published in the database/CMS,
- **When** a user visits `/trust`,
- **Then** the page renders an encouraging launch commitment card (*“Trust Report #001 lands at the end of Month 1”*),
- **And** no empty container skeletons, 404 errors, or broken data grids appear.

### AC-005 — Vendor Registration Handoff Boundary
- **Given** a prospective boutique owner taps the primary CTA on `/sell`,
- **When** the interaction fires,
- **Then** the browser executes a clean navigation to the Vendor Portal registration route (`{vendor-portal-url}/register`),
- **And** zero KYC documentation or sensitive merchant data is collected on the marketing site.

### AC-006 — Legal Route Stability
- **Given** legal policies exist in draft state prior to final advocate sign-off,
- **When** counsel approves final terms and content is updated,
- **Then** the publication occurs at the exact paths `/legal/terms` and `/legal/privacy`,
- **And** no in-app settings links or payment gateway configurations require URL updates or redirects.

### AC-007 — Native WhatsApp Contact Escalation
- **Given** a user triggers the primary contact option on `/contact` or `/faq`,
- **When** the action fires,
- **Then** the system opens a native WhatsApp click-to-chat URL (`wa.me`) pre-populated with an inquiry string,
- **And** no mandatory multi-field contact form is presented.

### AC-008 — Privacy-Compliant Cookie Consent
- **Given** a visitor lands on a page with non-essential tracking cookies enabled,
- **When** the page renders,
- **Then** an accessible, non-blocking banner informs the user of referral tracking,
- **And** declining disables all non-essential storage without hindering full site navigation.

### AC-009 — FAQ Fallback Assistance
- **Given** a user filters the FAQ accordion with a term that yields zero matches,
- **When** the filter result completes,
- **Then** an active fallback card appears stating *“No results found — message our team directly on WhatsApp”*,
- **And** tapping the link opens WhatsApp immediately.

### AC-010 — Draft Journal Access Control
- **Given** a Journal article exists in `draft` state in the repository/CMS,
- **When** an unauthenticated visitor attempts to navigate to `/journal/[draft-slug]`,
- **Then** the server responds with a strict HTTP 404 status code,
- **And** the slug does not appear in `/sitemap.xml` or the `/journal` index.

### AC-011 — Open Graph Social Card Preview
- **Given** any Journal post or Trust Report link is pasted into a WhatsApp chat or Instagram DM,
- **When** the messaging platform parses the URL,
- **Then** the preview card renders a custom 1200x630 branded image, accurate title, and descriptive summary,
- **And** never falls back to an unformatted plain link or empty container.

### AC-012 — Structured Data Schema Validation
- **Given** any public route is inspected via the Google Rich Results Validator,
- **When** the inspection runs,
- **Then** the declared JSON-LD schema (`Organization`, `Article`, `FAQPage`, `BreadcrumbList`) passes with zero missing required fields or critical errors.

### AC-013 — AI Search Crawler Disaggregation Directives
- **Given** an automated search engine or AI crawler requests `/robots.txt`,
- **When** the directives are parsed,
- **Then** explicit Allow rules are returned for live search and conversational retrieval crawlers (`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `PerplexityBot`),
- **And** explicit Disallow rules are returned for model training scrapers (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Meta-ExternalAgent`, `Bytespider`),
- **And** internal directories (`/api/`, `/_next/`, `/admin/`) are disallowed for all user agents.

### AC-014 — Automated Sitemap Ingestion
- **Given** a new Trust Report or Journal post is published via ISR/deploy,
- **When** `/sitemap.xml` is requested,
- **Then** the new canonical URL is dynamically present with its updated timestamp without requiring manual file edits.

### AC-015 — Production Security Headers & CSP Enforcement
- **Given** any public route or asset is requested in production,
- **When** the HTTP response headers are evaluated,
- **Then** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` are present,
- **And** `Content-Security-Policy` defines strict origins with wildcard subdomains for GA4, Supabase, and Cloudinary,
- **And** mutating API endpoints prohibit wildcard CORS headers (`Access-Control-Allow-Origin: *`).

### AC-016 — Smart 404 & AI Hallucination Recovery
- **Given** an end-user or AI referral arrives at a non-existent URL (e.g. `ve.ug/trust-report` or `ve.ug/sizing-guide`),
- **When** the page renders,
- **Then** the server responds with a strict HTTP 404 status code (no soft-404 redirects),
- **And** the UI parses the slug keywords to display prominent direct recovery links (e.g., suggesting `/trust` or `/app`),
- **And** the visit is logged for the monthly 404 redirect review in Google Search Console.

### AC-017 — Entry Client JS Bundle Budget & Route Error Isolation
- **Given** a production Next.js build is generated,
- **When** `@next/bundle-analyzer` evaluates client JavaScript chunks,
- **Then** the initial client entry bundle does not exceed $150\text{KB}$ gzipped,
- **And** non-critical client widgets are wrapped in `<Suspense>` and localized `error.tsx` boundaries to prevent route crashes from cascading into page-wide whiteouts.

### AC-018 — Database Aggregate Safety & Truncation Prevention
- **Given** the server renders monthly Trust Reports or Journal catalog indexes,
- **When** database metrics or articles are queried from Supabase,
- **Then** all summary metrics (`Completed Orders`, `On-Time Delivery Rate`) are computed inside PostgreSQL via stored RPC functions or Materialized Views,
- **And** zero raw transactional records are pulled into Node.js memory for JavaScript aggregation,
- **And** archive listings enforce cursor pagination on composite sort keys (`report_month DESC, id DESC`) to guard against PostgREST silent 1,000-row truncation traps.

### AC-019 — SoftwareApplication & WebSite JSON-LD Schema Validation
- **Given** the Google Rich Results Test or Schema Validator inspects `/` and `/app`,
- **When** the embedded JSON-LD scripts are evaluated,
- **Then** `/` renders a validated `WebSite` schema with a `potentialAction` search specification,
- **And** `/app` renders a validated `SoftwareApplication` schema declaring name "Ve", operating systems "Android, iOS", application category "ShoppingApplication", and price "0",
- **And** zero schema validation errors or missing required fields are reported.

---

## 24. Consolidated Open Decisions (Decisions 1 through 19)

| # | Domain | Decision Topic | Architectural Options | Recommended Path |
|---|---|---|---|---|
| **1** | Infrastructure | **Hosting Platform** (§2.1) | Cloudflare Pages vs. Vercel vs. Linux VPS | **Cloudflare Pages** or **Vercel Pro**. |
| **2** | Architecture | **Monorepo Placement** (§2.2) | Workspace package in `web-app/` vs. Dedicated Repo | **Dedicated Repository** with shared Tailwind tokens. |
| **3** | Operations | **Domain Registration** (§2.3) | Confirm acquisition and DNS control of `ve.ug` | Acquire `ve.ug` immediately via registry.co.ug. |
| **4** | Growth | **App Attribution Engine** (§7.4) | Google Play Referrer + In-App Code vs. Branch/Adjust | **Play Install Referrer + Clipboard auto-detect** (Zero-cost). |
| **5** | Architecture | **Trust Report Data Feed** (§8.3) | Manual Admin entry vs. Live DB queries vs. Database RPC | **Supabase Postgres RPC (`get_trust_report_metrics`) / Materialized Views + Scheduled Daily ISR (`revalidate: 86400`)**. Prohibits in-memory Node reductions. |
| **6** | Product Scope | **Shoppable Journal Tags** (§9.3) | In-scope for V1 vs. Defer to Phase 2 | **Defer to Phase 2**. Keep V1 Journal purely editorial. |
| **7** | Legal | **Launch Timing vs. Counsel Sign-off** (§11.2) | Launch with draft terms vs. Hard block on legal review | Launch with clearly marked draft terms; verify with DPO Pay. |
| **8** | Product Scope | **Press Kit Scope** (§13.1) | Dedicated download kit vs. `/contact` email fallback | **Minimalist stub with brand logo assets + email**. |
| **9** | Analytics | **Analytics Tooling** (§15.1) | Plausible / PostHog Cookieless vs. Google Analytics | **GA4 via `@next/third-parties/google` + Google Consent Mode v2 (default-denied)**; or **Plausible** ($< 2\text{KB}$) for pure cookieless. |
| **10** | Content | **CMS Selection** (§16.1) | MDX in Git vs. Headless CMS vs. Admin Portal Table | **Internal Ve Admin Portal + Supabase Postgres tables (`articles`, `trust_reports`) + Next.js ISR**. |
| **11** | Governance | **Named Operational Owners** (§16.2) | Assign engineering & marketing owners in Doc 08 | 1 frontend engineer (Build) + Founder/Marketing (Content). |
| **12** | Growth | **Keyword Research Investment** (§18.3) | Structured tool pass vs. Intuitive content titles | Conduct **targeted keyword research pass + DevTools network query fan-out extraction** on 10 pillar topics. |
| **13** | Discoverability| **AI Crawler Robots Policy** (§19.2) | Allow all AI crawlers vs. Block LLMs vs. Disaggregate Search vs. Training | **Disaggregate in `app/robots.ts`**: Explicitly **Allow** live search/retrieval crawlers (`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `PerplexityBot`); **Disallow** training scrapers (`GPTBot`, `ClaudeBot`, `Google-Extended`). |
| **14** | Discoverability| **`/llms.txt` Deployment** (§19.3) | Ship curated summary vs. Skip for now | **Ship dynamic Route Handler `app/llms.txt/route.ts`**. High ROI for AI model factual grounding. |
| **15** | Engineering | **Dynamic OG Image Pipeline** (§20.2) | Automated `@vercel/og` generation vs. Manual PNGs | **Automated `@vercel/og` Edge generation via `app/api/og/route.tsx`** ($< 50\text{ms}$). |
| **16** | Discoverability| **Google Business Profile** (§21.1) | Register as Service Area Business vs. Skip | **Register as Service Area Delivery Business**. |
| **17** | Integration | **Vendor Portal Route Contract** (§6.1) | Agree on immutable `/register` route with Portal team | Lock `/register` as immutable route contract. |
| **18** | Compliance | **Outbound WhatsApp Notification** (§6.4) | Meta Cloud API vs. Inbound Click-to-Chat / SMS | **Inbound WhatsApp click-to-chat** to eliminate SaaS fees. |
| **19** | Performance | **Social Proof UGC Embeds** (§4.2) | Live TikTok/Instagram iframes vs. Static WebP posters | **Static Cloudinary WebP posters + play modal** (Guards 3G). |

---

## 25. Master Risk Register

| Risk Event | Severity | Likelihood | Impact Area | Mitigation Strategy |
|---|---|---|---|---|
| **App Store Review Rejection Due to Incomplete Legal URLs** | Critical | Medium | App Store & Google Play Launch | Ensure `/legal/terms` and `/legal/privacy` are live, fully navigable, and clearly state consumer rights before app submission. |
| **Third-Party Social Embeds Explode 3G Page Budget** | High | High | User Retention & Bounce Rates | Mandate AC-001: Zero live social iframes on page load. Use Cloudinary-cached poster images that link externally or open in lightboxes. |
| **Ambassador Campaign ROI Rendered Unmeasurable** | High | Medium | Growth Capital & Marketing Budget | Resolve Decision #4 (Google Play Install Referrer + in-app clipboard detection) prior to rolling out campus ambassador codes. |
| **Outbound WhatsApp Costs Escalate Pre-Revenue** | Medium | High | Cash Runway & Operational Budget | Prevent automated WhatsApp notifications on `/sell`. Rely on free inbound click-to-chat links until paid volume is warranted. |
| **Website Content & Trust Reports Go Stale** | Medium | High | Brand Credibility & Retention | Formalize publishing schedules in Doc 08: Trust Reports published by 3rd of every month; assign named content owner. |
| **Vendor Registration Route Breaks Due to Uncoordinated Handoff** | High | Low | Merchant Acquisition Conversion | Document and enforce `/register` as a hard, immutable contract between marketing site and vendor portal teams. |
| **AI Crawlers Inadvertently Blocked by Generic Disallow Rules** | Low | Medium | Long-Term GEO & Answer Citations | Enforce AC-013: Unit test `robots.txt` output in CI/CD pipeline to guarantee explicit allow directives for major LLM agents. |
| **Silent 1,000-Row PostgREST Truncation on Public Metrics** | High | Medium | Trust Reports & Metrics | Enforce AC-018: Mandate database RPC functions (`get_trust_report_metrics`) or materialized views; enforce cursor pagination with deterministic composite sorting (`report_month DESC, id DESC`) and `{ count: 'exact', head: true }`. |
| **Contact Email Header Injection & Open Spam Relay** | High | Low | Security & Infrastructure | Enforce §12.3: Defensively strip all CRLF characters (`\r\n`) from single-line contact form inputs; prioritize direct WhatsApp click-to-chat; suppress raw server stack traces. |
| **AI-Hallucinated 404 Traffic Loss & Brand Bounce** | Medium | High | Discoverability & Conversions | Enforce AC-016: Implement Smart 404 handler (`app/not-found.tsx`) that tokenizes slug keywords and suggests valid routes; conduct monthly 404 GSC audit to establish 301 redirects. |
| **Supply Chain Package Compromise & Secret Exfiltration** | Critical | Low | Security & Infrastructure | Enforce §2.6: Configure `.npmrc` with `ignore-scripts=true`, run `npm audit` in CI, restrict `NEXT_PUBLIC_` to non-secret keys, and grep `.next/` builds for accidentally bundled API secrets. |

---

## 26. Master Cross-Reference Map

| System / Specification Area | Primary Source Document | Architectural Interdependency |
|---|---|---|
| **Trust-as-Evidence Positioning & Brand Pillars** | `ve_marketing_strategy.md` §1–3, §9 | Dictates the structure and narrative tone of the `/trust` reports and homepage trust strip. |
| **WhatsApp-First UX & Ambassador Referral Mechanics** | `ve_habit_strategy.md` §5, §6 | Informs the click-to-chat contact architecture and `?ref=` parameter capture mechanics. |
| **Vendor KYC Onboarding & Tier Matrix** | `ve_vendor_portal_specification.md` §2 | Defines the strict boundary: marketing site pitches, vendor portal handles KYC intake at `/register`. |
| **Design System Tokens, Typography & Deep Links** | `ve-frontend_engineering_handoff.md` §2.5, §18, §21 | Provides exact color tokens, type pairings, and app URL schemes (`ve://*`) for web buttons. |
| **Payment Gateway Redirects & Merchant Compliance** | `06_payments_business_logic_execution_plan.md` §1.4 | Requires stable legal URLs (`/legal/*`) for DPO Pay merchant compliance sign-off. |
| **Operational Readiness & Team Ownership Matrix** | `08_engineering_operations_readiness_plan.md` §6.2, §8 | Inherits data privacy standards (DPPA 2019) and provides the ownership slots for website maintainers. |
| **Backend Database Evaluation & Cloud Architecture** | `13-backend-architecture-evaluation.md` §1–4 | Informs the CMS selection and hosting alignment (Supabase/VPS vs. Firebase vs. Edge). |
| **Engineering & Security Hardening Guides** | `Website/guides/` (27 Guides across AEO, Performance, SEO, Security) | Informs production security headers (§2.4), CORS origins (§2.5), secret isolation (§2.6), bundle budgets (§2.7), compositor motion (§14.5), GA4 consent (§15.2), Supabase RLS (§16.1), PostgREST joins (§16.2), Smart 404 recovery (§18.5), and crawler disaggregation (§19.2). |

---
*Prepared and consolidated as the definitive master technical specification and discoverability blueprint for the Ve Main Website.*
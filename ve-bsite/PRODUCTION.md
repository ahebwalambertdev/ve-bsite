# Ve Production Deployment & Operations Guide

This guide details everything required to deploy the **Ve Marketing Website & Admin Studio** to production (e.g., on Vercel or a cloud VPS) serving **[veapp.store](https://veapp.store)**.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Production Checklist](#2-production-checklist)
3. [Environment Variables Reference](#3-environment-variables-reference)
4. [Database & Supabase Setup](#4-database--supabase-setup)
5. [Security & Access Hardening](#5-security--access-hardening)
6. [Domain, DNS & SSL Configuration](#6-domain-dns--ssl-configuration)
7. [Assets & Cloudinary CDN](#7-assets--cloudinary-cdn)
8. [Analytics & Privacy Compliance](#8-analytics--privacy-compliance)
9. [Deployment Options](#9-deployment-options)
   - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
   - [Option B: Self-Hosted Docker / VPS](#option-b-self-hosted-docker--vps)
10. [Pre-Launch Verification (Smoke Tests)](#10-pre-launch-verification-smoke-tests)

---

## 1. Architecture Overview

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Rendering Model**: Incremental Static Regeneration (ISR) with On-Demand Revalidation (`revalidatePath`)
- **CMS Backend**: Dual-tier storage:
  - **Tier 1 (Database)**: Supabase PostgreSQL (`public.site_cms_data`) for persistent serverless publishing.
  - **Tier 2 (Fallback / Local)**: Zero-latency in-memory cache with fallback to local JSON.
- **Admin Studio**: Protected single-page management portal at `/admin/studio` with live viewport iframe sync.
- **Security**: Strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), and HTTP-only signed session tokens.

---

## 2. Production Checklist

- [ ] **Supabase**: Real production Supabase project provisioned and migration executed.
- [ ] **Service Role Key**: Configured server-side to allow `/api/admin/publish` to write CMS updates through RLS.
- [ ] **Waitlist Backend**: Database table or webhook connected to capture leads from `/app`.
- [ ] **Admin Credentials**: Custom strong `ADMIN_PASSCODE` and 64-character `ADMIN_SESSION_SECRET` generated.
- [ ] **Robots Exclusion**: Search crawlers disallowed from indexing `/admin/` and `/admin/preview`.
- [ ] **Domain & DNS**: `veapp.store` and `www.veapp.store` pointed to the hosting edge network with valid SSL.
- [ ] **Google Analytics**: Real GA4 Measurement ID (`G-XXXXXXXXXX`) set in environment variables.
- [ ] **Assets**: High-resolution brand and boutique media uploaded to Cloudinary CDN.
- [ ] **Build Check**: `npm run build` passes with zero type or lint errors.

---

## 3. Environment Variables Reference

Configure these variables in your hosting environment (e.g., **Vercel Project Settings → Environment Variables**):

| Variable | Scope | Required | Description | Example / Recommendation |
| :--- | :--- | :---: | :--- | :--- |
| `ADMIN_PASSCODE` | Server | **Yes** | Passcode required to unlock the Admin Studio | `Str0ng-P@ss-2026!#` |
| `ADMIN_SESSION_SECRET` | Server | **Yes** | Secret salt used for HMAC admin auth cookies | Run `openssl rand -hex 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Client/Server | **Yes** | Supabase project API URL | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client/Server | **Yes** | Public anonymous API key for public queries | `eyJhbGciOiJIUzI1...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **Yes** | Privileged key for server-side CMS writes | `eyJhbGciOiJIUzI1...` (never expose to client) |
| `NEXT_PUBLIC_GA_ID` | Client | Optional | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client | Optional | Cloudinary cloud identifier | `ve-uganda` |
| `NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER` | Client | Optional | Official customer WhatsApp support phone | `256781602159` |
| `NEXT_PUBLIC_VENDOR_PORTAL_URL` | Client | Optional | Link to boutique merchant management portal | `https://vendor.ve.ug` |

---

## 4. Database & Supabase Setup

Because serverless environments (Vercel, AWS Lambda) use **read-only ephemeral filesystems**, CMS updates must be stored in Supabase to persist across cold starts.

### 4.1 CMS Schema Migration
Execute the following SQL in your **Supabase SQL Editor**:

```sql
-- 1. Create the site_cms_data table
CREATE TABLE IF NOT EXISTS public.site_cms_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_cms_data ENABLE ROW LEVEL SECURITY;

-- 3. Allow public unauthenticated read access for site rendering
CREATE POLICY "Allow public read access to site_cms_data"
ON public.site_cms_data
FOR SELECT
TO public
USING (true);

-- 4. Allow service role write access for the publishing API
CREATE POLICY "Allow service role write access to site_cms_data"
ON public.site_cms_data
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Seed initial record if empty
INSERT INTO public.site_cms_data (id, data, updated_at)
VALUES ('main', '{}'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Create site_cms_versions for Version History & Instant Rollback
CREATE TABLE IF NOT EXISTS public.site_cms_versions (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    author TEXT DEFAULT 'Admin',
    changes_summary JSONB DEFAULT '[]'::jsonb,
    is_rollback BOOLEAN DEFAULT false,
    rollback_from TEXT,
    data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_cms_versions_created_at 
ON public.site_cms_versions(created_at DESC);

ALTER TABLE public.site_cms_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to site_cms_versions"
ON public.site_cms_versions
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated admin write access to site_cms_versions"
ON public.site_cms_versions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### 4.2 Waitlist Lead Capture Migration
To ensure visitor submissions on `/app` are not lost:

```sql
CREATE TABLE IF NOT EXISTS public.waitlist_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact TEXT NOT NULL,
    name TEXT,
    platform TEXT,
    role TEXT,
    referral_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public lead submissions
CREATE POLICY "Allow public inserts to waitlist"
ON public.waitlist_subscribers
FOR INSERT
TO public
WITH CHECK (true);
```

---

## 5. Security & Access Hardening

### 5.1 Admin Passcode & Session Rotation
- Never use the default passcode (`ve-admin-2026`) in production.
- Generate a cryptographically secure session secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 5.2 Search Engine Crawler Disallow
Ensure [`src/app/robots.ts`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/ve-bsite/src/app/robots.ts) explicitly blocks admin studio and internal preview endpoints:

```ts
{
  userAgent: '*',
  allow: '/',
  disallow: ['/api/', '/admin/', '/admin', '/_next/'],
}
```

### 5.3 HTTP Headers
Configured in [`next.config.ts`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/ve-bsite/next.config.ts):
- **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (enabled automatically in production).
- **Clickjacking Protection**: `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`.
- **MIME Sniffing**: `X-Content-Type-Options: nosniff`.
- **Permissions**: Disables unauthorized browser sensors (camera, mic, geolocation) for marketing pages.

---

## 6. Domain, DNS & SSL Configuration

### 6.1 DNS Records for `veapp.store`
Set the following records at your DNS registrar:

| Record Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (root) | `76.76.21.21` (Vercel Edge) | Auto / 300 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Auto / 300 |

### 6.2 SSL / TLS
- Vercel automatically issues and renews Let’s Encrypt SSL certificates.
- Set canonical redirect rule in Vercel or DNS: `www.veapp.store` → `https://veapp.store`.

---

## 7. Assets & Cloudinary CDN

- Images from Cloudinary are allowed in [`next.config.ts`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/ve-bsite/next.config.ts) under `remotePatterns`:
  ```ts
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
  }
  ```
- Upload high-resolution boutique and hero images to Cloudinary with `f_auto,q_auto` to ensure fast delivery over mobile data connections across Uganda.

---

## 8. Analytics & Privacy Compliance

- **Google Analytics 4**: Integrated via `@next/third-parties/google` in [`src/app/layout.tsx`](file:///c:/Users/Lambert/Desktop/Ve%20Admin/Website/ve-bsite/src/app/layout.tsx).
- **Google Consent Mode v2**: Initialized with default `denied` state until user grants cookie consent via the on-screen banner.
- **Uganda DPPA 2019**: Compliant privacy policy live at `/legal/privacy`.

---

## 9. Deployment Options

### Option A: Vercel (Recommended)
1. Push this repository to GitHub/GitLab:
   ```bash
   git add .
   git commit -m "chore: prepare for production deployment"
   git push origin main
   ```
2. In [Vercel Dashboard](https://vercel.com/new), select **Import Project**.
3. Framework Preset: **Next.js**.
4. Configure all environment variables from [Section 3](#3-environment-variables-reference).
5. Click **Deploy**.

### Option B: Self-Hosted Docker / VPS
1. In `next.config.ts`, ensure `output: 'standalone'` is set.
2. Build and run using the standard Next.js Dockerfile:
   ```dockerfile
   FROM node:20-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY .next/standalone ./
   COPY .next/static ./.next/static
   COPY public ./public
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```
3. Put a reverse proxy (Nginx or Caddy) in front with an automated SSL certificate.

---

## 10. Pre-Launch Verification (Smoke Tests)

Before sharing the live site publicly, verify the following:

1. **Homepage Speed**: Run [PageSpeed Insights](https://pagespeed.web.dev/) on `https://veapp.store`. Mobile score should be 90+.
2. **Admin Authentication**:
   - Visit `https://veapp.store/admin/login`.
   - Verify invalid password fails with `401`.
   - Verify correct password sets secure HTTP-only cookie and redirects to `/admin/studio`.
3. **Live CMS Publishing**:
   - In `/admin/studio`, update the announcement bar text.
   - Click **Publish Changes**.
   - Open an incognito browser window at `https://veapp.store` and confirm the new text appears immediately without rebuilding.
4. **Bidirectional Navigation**:
   - In `/admin/studio`, click footer links in the preview (e.g. Terms or Contact) and verify the left editor panel automatically navigates to that screen.
5. **Mobile Viewport**:
   - Test on an actual iOS and Android phone over mobile data (MTN / Airtel Uganda) to ensure drawer navigation, animations, and image loading perform smoothly.

-- Migration: 20260925_lead_capture.sql
-- Description: Creates lead capture, vendor application, survey responses, and journal tables
-- Architecture: Row Level Security (RLS) enabled with anon INSERT only (defense against PII leakage) and authenticated/service-role access for admin inspection.

-- 1. WAITLIST LEADS (from /app)
CREATE TABLE IF NOT EXISTS public.waitlist_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    contact TEXT NOT NULL,
    platform TEXT, -- 'android' | 'ios' | 'both'
    role TEXT,     -- 'shopper' | 'vendor' | 'both'
    referral_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_leads_created_at ON public.waitlist_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_leads_contact ON public.waitlist_leads(contact);

ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous public can submit to waitlist
CREATE POLICY "Allow anon public insert to waitlist_leads"
ON public.waitlist_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admins and service role can read/manage leads
CREATE POLICY "Allow authenticated read and manage waitlist_leads"
ON public.waitlist_leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- 2. VENDOR APPLICATIONS (from /vendor)
CREATE TABLE IF NOT EXISTS public.vendor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    location TEXT,
    category TEXT,
    social_handle TEXT,
    stock_size TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'reviewing' | 'approved' | 'rejected'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_applications_created_at ON public.vendor_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON public.vendor_applications(status);

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon public insert to vendor_applications"
ON public.vendor_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and manage vendor_applications"
ON public.vendor_applications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. CUSTOMER SURVEYS (from /app post-waitlist survey)
CREATE TABLE IF NOT EXISTS public.customer_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact TEXT,
    shopping_habits JSONB DEFAULT '[]'::jsonb,
    online_frustration TEXT,
    style_categories JSONB DEFAULT '[]'::jsonb,
    try_on_excitement TEXT,
    delivery_area TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_surveys_created_at ON public.customer_surveys(created_at DESC);

ALTER TABLE public.customer_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon public insert to customer_surveys"
ON public.customer_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and manage customer_surveys"
ON public.customer_surveys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- 4. VENDOR OPERATIONS SURVEYS (from /vendor post-application profile)
CREATE TABLE IF NOT EXISTS public.vendor_operations_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_name TEXT,
    whatsapp TEXT,
    inventory_tracking TEXT,
    double_selling_frequency TEXT,
    delivery_method TEXT,
    shrinkage_issue TEXT,
    photography_method TEXT,
    top_tool_desired TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_operations_surveys_created_at ON public.vendor_operations_surveys(created_at DESC);

ALTER TABLE public.vendor_operations_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon public insert to vendor_operations_surveys"
ON public.vendor_operations_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read and manage vendor_operations_surveys"
ON public.vendor_operations_surveys
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- 5. JOURNAL POSTS (Ve Journal editorial engine)
CREATE TABLE IF NOT EXISTS public.journal_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    body TEXT NOT NULL,
    excerpt TEXT,
    author TEXT DEFAULT 'Ve Editorial Team',
    cover_image_url TEXT,
    category TEXT DEFAULT 'Ecosystem',
    read_time_minutes INTEGER DEFAULT 4,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_posts_published ON public.journal_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_posts_slug ON public.journal_posts(slug);

ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published journal posts
CREATE POLICY "Allow public read access to published journal posts"
ON public.journal_posts
FOR SELECT
TO public
USING (is_published = true);

-- Authenticated admins have full CRUD over journal posts
CREATE POLICY "Allow authenticated full management of journal posts"
ON public.journal_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

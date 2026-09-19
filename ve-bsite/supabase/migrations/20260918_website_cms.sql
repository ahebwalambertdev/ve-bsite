-- Migration: 20260918_website_cms.sql
-- Description: Creates the site_cms_data table for dynamic marketing website management
-- Architecture: Row Level Security (RLS) enabled with public read and authenticated admin write.

CREATE TABLE IF NOT EXISTS public.site_cms_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_cms_data ENABLE ROW LEVEL SECURITY;

-- Public can read published CMS data
CREATE POLICY "Allow public read access to site_cms_data"
ON public.site_cms_data
FOR SELECT
TO public
USING (true);

-- Authenticated users (admin/service) can update CMS data
CREATE POLICY "Allow authenticated admin write access to site_cms_data"
ON public.site_cms_data
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial default record if not exists
INSERT INTO public.site_cms_data (id, data, updated_at)
VALUES ('main', '{}'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

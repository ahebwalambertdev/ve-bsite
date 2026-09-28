-- Migration: 20260928_website_cms_versions.sql
-- Description: Creates the site_cms_versions table for admin visual studio version control, changelog & instant rollback.
-- Architecture: Row Level Security (RLS) enabled with public read and authenticated/service-role write.

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

-- Index for ordering by creation timestamp (latest first)
CREATE INDEX IF NOT EXISTS idx_site_cms_versions_created_at 
ON public.site_cms_versions(created_at DESC);

-- Enable RLS
ALTER TABLE public.site_cms_versions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to version history
CREATE POLICY "Allow public read access to site_cms_versions"
ON public.site_cms_versions
FOR SELECT
TO public
USING (true);

-- Allow authenticated and service role write access to site_cms_versions
CREATE POLICY "Allow authenticated admin write access to site_cms_versions"
ON public.site_cms_versions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

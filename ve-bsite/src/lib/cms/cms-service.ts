import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { SiteCmsData, CmsFaqItem, HeroContent, HowItWorksContent, VendorStripContent, WaitlistContent, TeamMemberData } from './types';
import { DEFAULT_CMS_DATA } from './defaults';
import { supabase, getServiceSupabase } from '@/lib/supabase';

const LOCAL_CMS_FILE = path.join(process.cwd(), 'src', 'lib', 'cms', 'cms-data.json');

// In-memory cache for ultra-fast zero-latency access across renders
let memoryCmsCache: SiteCmsData = { ...DEFAULT_CMS_DATA };
let isDataLoaded = false;

/**
 * Reads local disk backup if it exists
 */
function readLocalCmsFile(): SiteCmsData | null {
  try {
    if (fs.existsSync(LOCAL_CMS_FILE)) {
      const raw = fs.readFileSync(LOCAL_CMS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_CMS_DATA,
          ...parsed,
          about: { ...DEFAULT_CMS_DATA.about, ...(parsed.about || {}) },
          contact: { ...DEFAULT_CMS_DATA.contact, ...(parsed.contact || {}) },
          press: { ...DEFAULT_CMS_DATA.press, ...(parsed.press || {}) },
          legalTerms: { ...DEFAULT_CMS_DATA.legalTerms, ...(parsed.legalTerms || {}) },
          legalPrivacy: { ...DEFAULT_CMS_DATA.legalPrivacy, ...(parsed.legalPrivacy || {}) },
          journal: { ...DEFAULT_CMS_DATA.journal, ...(parsed.journal || {}) },
          navigation: {
            headerLinks: parsed.navigation?.headerLinks || DEFAULT_CMS_DATA.navigation.headerLinks,
            headerCta: parsed.navigation?.headerCta || DEFAULT_CMS_DATA.navigation.headerCta,
            socialLinks: {
              ...DEFAULT_CMS_DATA.navigation.socialLinks,
              ...(parsed.navigation?.socialLinks || {}),
            },
            footerLinks: parsed.navigation?.footerLinks || DEFAULT_CMS_DATA.navigation.footerLinks,
          },
        };
      }
    }
  } catch {
    // Disk read fallback
  }
  return null;
}

/**
 * Authoritative CMS Data Fetcher
 * Queries Supabase `site_cms_data` if available, otherwise returns disk file or default data.
 * Zero downtime, offline safe.
 */
export const getCmsData = cache(async (): Promise<SiteCmsData> => {
  // Return in-memory singleton immediately if already loaded
  if (isDataLoaded) {
    return memoryCmsCache;
  }

  // 1. Try Supabase if configured
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const { data, error } = await supabase
        .from('site_cms_data')
        .select('data, updated_at')
        .eq('id', 'main')
        .single();

      if (!error && data?.data) {
        memoryCmsCache = {
          ...DEFAULT_CMS_DATA,
          ...data.data,
          about: { ...DEFAULT_CMS_DATA.about, ...(data.data.about || {}) },
          contact: { ...DEFAULT_CMS_DATA.contact, ...(data.data.contact || {}) },
          press: { ...DEFAULT_CMS_DATA.press, ...(data.data.press || {}) },
          legalTerms: { ...DEFAULT_CMS_DATA.legalTerms, ...(data.data.legalTerms || {}) },
          legalPrivacy: { ...DEFAULT_CMS_DATA.legalPrivacy, ...(data.data.legalPrivacy || {}) },
          journal: { ...DEFAULT_CMS_DATA.journal, ...(data.data.journal || {}) },
          navigation: {
            headerLinks: data.data.navigation?.headerLinks || DEFAULT_CMS_DATA.navigation.headerLinks,
            headerCta: data.data.navigation?.headerCta || DEFAULT_CMS_DATA.navigation.headerCta,
            socialLinks: {
              ...DEFAULT_CMS_DATA.navigation.socialLinks,
              ...(data.data.navigation?.socialLinks || {}),
            },
            footerLinks: data.data.navigation?.footerLinks || DEFAULT_CMS_DATA.navigation.footerLinks,
          },
          lastUpdated: data.updated_at || new Date().toISOString(),
        };
        isDataLoaded = true;
        return memoryCmsCache;
      }
    }
  } catch {
    // Supabase network or schema fallback
  }

  // 2. Try reading persistent local file from disk
  const diskData = readLocalCmsFile();
  if (diskData) {
    memoryCmsCache = diskData;
    isDataLoaded = true;
    return memoryCmsCache;
  }

  isDataLoaded = true;
  return memoryCmsCache;
});

/**
 * Saves CMS Data
 * Writes to Supabase and updates in-memory cache and local disk file.
 */
export async function saveCmsData(newData: Partial<SiteCmsData>): Promise<{ success: boolean; data: SiteCmsData; error?: string }> {
  try {
    const updated: SiteCmsData = {
      ...memoryCmsCache,
      ...newData,
      lastUpdated: new Date().toISOString(),
    };

    memoryCmsCache = updated;
    isDataLoaded = true;

    // 1. Persist to local disk JSON file
    try {
      fs.writeFileSync(LOCAL_CMS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    } catch {
      // Ignore read-only file systems in serverless environments
    }

    // 2. Persist to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const client = getServiceSupabase();
      const { error } = await client
        .from('site_cms_data')
        .upsert({
          id: 'main',
          data: updated,
          updated_at: updated.lastUpdated,
        });

      if (error) {
        return { success: false, data: updated, error: error.message };
      }
    }

    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown CMS save error';
    return { success: false, data: memoryCmsCache, error: message };
  }
}

export async function getHeroContent(): Promise<HeroContent> {
  const data = await getCmsData();
  return data.hero;
}

export async function getFaqs(onlyFeaturedHome = false): Promise<CmsFaqItem[]> {
  const data = await getCmsData();
  let faqs = data.faqs.filter((f) => f.isPublished);
  if (onlyFeaturedHome) {
    faqs = faqs.filter((f) => f.isFeaturedHome);
  }
  return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getHowItWorks(): Promise<HowItWorksContent> {
  const data = await getCmsData();
  return data.howItWorks;
}

export async function getVendorStrip(): Promise<VendorStripContent> {
  const data = await getCmsData();
  return data.vendorStrip;
}

export async function getWaitlist(): Promise<WaitlistContent> {
  const data = await getCmsData();
  return data.waitlist;
}

export async function getTeamMembers(): Promise<TeamMemberData[]> {
  const data = await getCmsData();
  return data.team.sort((a, b) => a.sortOrder - b.sortOrder);
}

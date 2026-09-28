import fs from 'fs';
import path from 'path';
import { SiteCmsData, CmsVersionRecord, CmsVersionListItem } from './types';
import { saveCmsData, getCmsData } from './cms-service';
import { supabase, getServiceSupabase } from '@/lib/supabase';

const LOCAL_VERSIONS_FILE = path.join(process.cwd(), 'src', 'lib', 'cms', 'cms-versions.json');
const MAX_LOCAL_VERSIONS = 30;

import { computeCmsDiff } from './cms-diff';
export { computeCmsDiff };

/**
 * Read local versions file as fallback or secondary store
 */
function readLocalVersions(): CmsVersionRecord[] {
  try {
    if (fs.existsSync(LOCAL_VERSIONS_FILE)) {
      const raw = fs.readFileSync(LOCAL_VERSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Write to local versions file
 */
function writeLocalVersions(versions: CmsVersionRecord[]): void {
  try {
    const trimmed = versions.slice(0, MAX_LOCAL_VERSIONS);
    fs.writeFileSync(LOCAL_VERSIONS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch {
    // Serverless read-only filesystem safe
  }
}

/**
 * Records a new version snapshot
 */
export async function recordVersion(
  data: SiteCmsData,
  options?: {
    description?: string;
    author?: string;
    isRollback?: boolean;
    rollbackFrom?: string;
    previousData?: Partial<SiteCmsData>;
  }
): Promise<CmsVersionRecord> {
  const versionId = `v_${Date.now()}`;
  const now = new Date().toISOString();
  const author = options?.author || 'Admin';

  // Compute diff
  const { summary: diffSummary, tags } = computeCmsDiff(options?.previousData, data);
  const autoDesc = diffSummary.join(', ');
  const description = options?.description?.trim() || autoDesc;

  const versionRecord: CmsVersionRecord = {
    id: versionId,
    created_at: now,
    description,
    author,
    changes_summary: tags,
    is_rollback: options?.isRollback || false,
    rollback_from: options?.rollbackFrom,
    data,
  };

  // 1. Write to local file store
  try {
    const localList = readLocalVersions();
    localList.unshift(versionRecord);
    writeLocalVersions(localList);
  } catch {
    // ignore
  }

  // 2. Persist to Supabase site_cms_versions table if configured
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const client = getServiceSupabase();
      await client.from('site_cms_versions').insert({
        id: versionRecord.id,
        created_at: versionRecord.created_at,
        description: versionRecord.description,
        author: versionRecord.author,
        changes_summary: versionRecord.changes_summary,
        is_rollback: versionRecord.is_rollback,
        rollback_from: versionRecord.rollback_from,
        data: versionRecord.data,
      });
    }
  } catch (err) {
    console.warn('[CMS Versioning] Failed to persist version to Supabase:', err);
  }

  return versionRecord;
}

/**
 * List recent versions (metadata only, without large payload)
 */
export async function listVersions(limit = 30): Promise<CmsVersionListItem[]> {
  // 1. Try Supabase first
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const { data, error } = await supabase
        .from('site_cms_versions')
        .select('id, created_at, description, author, changes_summary, is_rollback, rollback_from')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          created_at: item.created_at,
          description: item.description || 'Snapshot',
          author: item.author || 'Admin',
          changes_summary: Array.isArray(item.changes_summary) ? item.changes_summary : [],
          is_rollback: Boolean(item.is_rollback),
          rollback_from: item.rollback_from || undefined,
        }));
      }
    }
  } catch {
    // Fall back to local
  }

  // 2. Fall back to local file store
  const localList = readLocalVersions();
  return localList.slice(0, limit).map((v) => ({
    id: v.id,
    created_at: v.created_at,
    description: v.description || 'Snapshot',
    author: v.author || 'Admin',
    changes_summary: v.changes_summary || [],
    is_rollback: Boolean(v.is_rollback),
    rollback_from: v.rollback_from,
  }));
}

/**
 * Retrieve a specific version by ID
 */
export async function getVersionById(id: string): Promise<CmsVersionRecord | null> {
  // 1. Try Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const { data, error } = await supabase
        .from('site_cms_versions')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          created_at: data.created_at,
          description: data.description,
          author: data.author,
          changes_summary: Array.isArray(data.changes_summary) ? data.changes_summary : [],
          is_rollback: Boolean(data.is_rollback),
          rollback_from: data.rollback_from,
          data: data.data,
        };
      }
    }
  } catch {
    // Fall back to local
  }

  // 2. Try local file store
  const localList = readLocalVersions();
  const match = localList.find((v) => v.id === id);
  return match || null;
}

/**
 * Rollback live CMS to a specific historical version
 */
export async function rollbackToVersion(
  versionId: string,
  author = 'Admin'
): Promise<{ success: boolean; data?: SiteCmsData; error?: string; version?: CmsVersionRecord }> {
  try {
    const targetVersion = await getVersionById(versionId);
    if (!targetVersion || !targetVersion.data) {
      return { success: false, error: `Version ${versionId} was not found` };
    }

    const currentLive = await getCmsData();

    // 1. Overwrite live main CMS data
    const saveResult = await saveCmsData(targetVersion.data);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error || 'Failed to apply rollback to live site' };
    }

    // 2. Record this action as a new rollback entry in history
    const dateStr = new Date(targetVersion.created_at).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const recorded = await recordVersion(saveResult.data, {
      description: `Rolled back to version from ${dateStr} (${targetVersion.id})`,
      author,
      isRollback: true,
      rollbackFrom: versionId,
      previousData: currentLive,
    });

    return { success: true, data: saveResult.data, version: recorded };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Rollback failed';
    return { success: false, error: message };
  }
}

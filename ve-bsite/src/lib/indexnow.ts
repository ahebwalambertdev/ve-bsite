/**
 * IndexNow Integration (§SEO/AEO)
 * Instantly notifies Bing, Yandex, Naver, and Seznam when pages change.
 * This ensures AI search engines (Copilot, ChatGPT, Perplexity) pick up changes fast.
 */

import { getJournalArticles } from '@/lib/journal-data';

const INDEXNOW_KEY = '161e5a9831ce4933a36319f56ee01a1e';
const SITE_HOST = 'www.veapp.store';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

/** Core Static Routes */
export const CORE_STATIC_URLS = [
  `https://${SITE_HOST}/`,
  `https://${SITE_HOST}/app`,
  `https://${SITE_HOST}/sell`,
  `https://${SITE_HOST}/vendor`,
  `https://${SITE_HOST}/about`,
  `https://${SITE_HOST}/team`,
  `https://${SITE_HOST}/faq`,
  `https://${SITE_HOST}/contact`,
  `https://${SITE_HOST}/journal`,
  `https://${SITE_HOST}/press`,
  `https://${SITE_HOST}/legal/privacy`,
  `https://${SITE_HOST}/legal/terms`,
];

/** Fetch all current public URLs including dynamic journal articles */
export async function getAllPublicUrls(): Promise<string[]> {
  try {
    const articles = await getJournalArticles();
    const journalUrls = articles.map((article) => `https://${SITE_HOST}/journal/${article.slug}`);
    return [...CORE_STATIC_URLS, ...journalUrls];
  } catch {
    return CORE_STATIC_URLS;
  }
}

/**
 * Submit one or more URLs to IndexNow (both global endpoint and Bing direct).
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  status: number;
  endpoints: { [endpoint: string]: number };
}> {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const endpoints = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow'];
  const endpointResults: { [endpoint: string]: number } = {};
  let anySuccess = false;
  let primaryStatus = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      endpointResults[endpoint] = response.status;
      if (response.ok) {
        anySuccess = true;
      }
      if (!primaryStatus) {
        primaryStatus = response.status;
      }
    } catch (error) {
      console.error(`[IndexNow] Error submitting to ${endpoint}:`, error);
      endpointResults[endpoint] = 0;
    }
  }

  return {
    success: anySuccess,
    status: primaryStatus,
    endpoints: endpointResults,
  };
}

/**
 * Submit all public pages to IndexNow.
 * Useful after a full site deploy or CMS bulk publish.
 */
export async function submitAllToIndexNow() {
  const allUrls = await getAllPublicUrls();
  return submitToIndexNow(allUrls);
}


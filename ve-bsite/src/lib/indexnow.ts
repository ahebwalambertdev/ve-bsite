/**
 * IndexNow Integration (§SEO/AEO)
 * Instantly notifies Bing, Yandex, Naver, and Seznam when pages change.
 * This ensures AI search engines (Copilot, ChatGPT, Perplexity) pick up changes fast.
 */

const INDEXNOW_KEY = '161e5a9831ce4933a36319f56ee01a1e';
const SITE_HOST = 'www.veapp.store';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

/** All public pages on the site */
export const ALL_PUBLIC_URLS = [
  'https://www.veapp.store/',
  'https://www.veapp.store/app',
  'https://www.veapp.store/sell',
  'https://www.veapp.store/about',
  'https://www.veapp.store/team',
  'https://www.veapp.store/faq',
  'https://www.veapp.store/contact',
  'https://www.veapp.store/journal',
  'https://www.veapp.store/press',
  'https://www.veapp.store/legal/privacy',
  'https://www.veapp.store/legal/terms',
];

/**
 * Submit one or more URLs to IndexNow.
 * Call this after CMS publish or content updates.
 */
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; status: number }> {
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error('[IndexNow] Failed to submit URLs:', error);
    return { success: false, status: 0 };
  }
}

/**
 * Submit all public pages to IndexNow.
 * Useful after a full site deploy or CMS bulk publish.
 */
export async function submitAllToIndexNow() {
  return submitToIndexNow(ALL_PUBLIC_URLS);
}

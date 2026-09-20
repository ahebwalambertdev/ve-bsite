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
  'https://veapp.store/',
  'https://veapp.store/app',
  'https://veapp.store/sell',
  'https://veapp.store/about',
  'https://veapp.store/team',
  'https://veapp.store/faq',
  'https://veapp.store/contact',
  'https://veapp.store/journal',
  'https://veapp.store/press',
  'https://veapp.store/legal/privacy',
  'https://veapp.store/legal/terms',
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

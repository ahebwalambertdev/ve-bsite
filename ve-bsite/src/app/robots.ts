import type { MetadataRoute } from 'next';

/**
 * Dynamic Crawler Policy (Section 19.2 & AGENTS.md Section 4.3)
 * Permits real-time search engine bots (Google, Bing, OAI-SearchBot, PerplexityBot)
 * Blocks bulk model training scrapers (CCBot, GPTBot, Bytespider)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'Applebot-Extended',
          'OAI-SearchBot',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'meta-externalagent',
        ],
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin', '/_next/'],
      },
      {
        userAgent: ['CCBot', 'Bytespider'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin', '/_next/'],
      },
    ],
    sitemap: 'https://www.veapp.store/sitemap.xml',
    host: 'https://www.veapp.store',
  };
}

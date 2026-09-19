# Technical AEO: Let AI Crawlers In, Serve Them Real HTML

**Purpose:** The code-level work that makes your site visible to AI answer engines. Three
jobs: let the right crawlers in, give them real content to read, and stop losing traffic to
URLs the AI made up.

> This guide assumes you have read the AEO Foundations guide and understand the difference
> between training data and live retrieval. Everything here is on the retrieval side: making
> sure that when an AI searches the web for an answer, it can find and read your pages.

---

## Job 1: Manage AI crawlers in robots.txt

There are now two categories of AI bot, and confusing them is the most common AEO mistake:

| Category | What it does | Block it and… | Examples |
|---|---|---|---|
| **Training crawlers** | Scrape your site to build future model weights. No traffic back to you. | …you opt out of training. No effect on citations. | `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`, `Meta-ExternalAgent`, `Bytespider` |
| **Search/retrieval crawlers** | Fetch your pages in real time to ground an answer. This is RAG. | …you disappear from AI answers. | `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot` |

Blocking `GPTBot` does **not** block `OAI-SearchBot`. They are separate user-agents with
separate purposes. The same split applies on the Anthropic side (`ClaudeBot` vs
`Claude-SearchBot`). Block training, allow search.

### Recommended robots.txt block

```text
# ── Standard search engines (keep these, they also feed AI Overviews) ──
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# ── AI search / retrieval bots (allow these for AEO) ──
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# ── AI training crawlers (block these to opt out of training) ──
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Bytespider
Disallow: /

# ── Catch-all default ──
User-agent: *
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

**Google-Extended vs Googlebot:** Blocking `Google-Extended` does not affect your Google
Search rankings or your presence in AI Overviews. `Google-Extended` is only used for Gemini
model training. `Googlebot` handles both traditional search and AI Overviews.

### Next.js implementation

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard + AI search bots: allow everything public
      { userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User',
                     'Claude-SearchBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/api/', '/admin/', '/account/', '/auth/'] },

      // AI training bots: block everything
      { userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot',
                     'Meta-ExternalAgent', 'Bytespider'],
        disallow: '/' },

      // Default
      { userAgent: '*', allow: '/' },
    ],
    sitemap: 'https://www.example.com/sitemap.xml',
  }
}
```

### Vite implementation

Place a `robots.txt` file in `public/`. For environment-aware builds (e.g., blocking all
crawlers on staging), use the build-step copy script described in the SEO Crawlability
Playbook.

### Verifying it works

```bash
# Fetch your live robots.txt and check each bot
curl -s https://www.example.com/robots.txt | grep -A1 "OAI-SearchBot"
# Should show: Allow: /

curl -s https://www.example.com/robots.txt | grep -A1 "GPTBot"
# Should show: Disallow: /
```

Check server logs (or Cloudflare analytics if you use it) for actual bot hits. Many
aggressive scrapers ignore `robots.txt` entirely; for those, use WAF or CDN-level blocking.
The bots that *respect* `robots.txt` are the ones you want to allow, so the file matters
most for them.

---

## Job 2: Serve real HTML, not an empty shell

AI retrieval bots hit your URL, read the HTML response, and extract text from it. If your
site is a client-side-rendered SPA that serves `<div id="root"></div>` and loads everything
via JavaScript, the bot gets nothing. This is the same crawlability problem described in the
SEO Crawlability Playbook, and the fix is the same: prerender or SSR your public pages.

The short version:

| Stack | What to do |
|---|---|
| Next.js | You are already fine. Next SSRs by default. Verify with `curl -s <url> \| grep '<title>'`. |
| Vite SPA | Add build-time prerendering. Follow the Vite branch in the SEO Crawlability Playbook. |
| Any framework | The test is `curl -s -A "OAI-SearchBot" <url>`. If the response contains real text content and a meaningful `<title>`, you pass. If it is an empty shell, you fail. |

### What AI bots specifically need in the HTML

Beyond just having content in the response, the following elements improve how accurately
an AI model reads and cites your page:

1. **A real `<title>` tag per page.** This is the primary label the model uses.
2. **A meta description.** Models read it as a summary hint.
3. **Semantic heading hierarchy.** One `<h1>`, then `<h2>`/`<h3>` subsections. The model
   uses headings to chunk your content.
4. **Structured data (JSON-LD).** Schema markup (Organization, Product, FAQ, HowTo) gives
   the model typed facts it can extract with confidence. See the Structured Data Guide.
5. **Clean, accessible HTML.** `<article>`, `<section>`, `<nav>`, `<aside>` tell the model
   which text is content and which is chrome.

You do **not** need to detect AI user-agents and serve them different content. Serve the
same good HTML to everyone. Cloaking (serving different content to bots) remains a bad idea.

---

## Job 3: Handle hallucinated URLs

AI models hallucinate URLs. A model that knows your site exists may confidently generate a
link to `/blog/how-to-verify-vendors-in-kampala/` even though that page does not exist. The
user clicks it, gets a 404, and leaves. You just lost a high-intent visitor that an AI sent
your way for free.

This is not hypothetical. Studies show that a meaningful share of AI-generated citations
point to URLs that return 404, and the problem scales with how many topics your site covers.

### Step 1: Find the hallucinated URLs

Look for 404s coming from AI referrers:

```bash
# In your server logs (nginx example)
grep ' 404 ' /var/log/nginx/access.log \
  | grep -iE 'chatgpt|perplexity|oai-searchbot|claude' \
  | awk '{print $7}' | sort | uniq -c | sort -rn | head -20
```

In GA4, check **Engagement > Pages and screens**, filter by page title containing "404" or
"not found", then add a secondary dimension of **Session source**. Look for `chatgpt.com`,
`perplexity.ai`, or other AI referrers.

### Step 2: Decide what to do with each URL

| Pattern | Action |
|---|---|
| The URL is a near-miss typo (e.g., `/blog/vendor-verification/` vs your real `/blog/vendor-verification-guide/`) | **301 redirect** to the correct page. |
| The URL describes content you should have but don't (e.g., `/pricing/enterprise/`) | **Create the page.** The AI is telling you there is demand for this content. This is a free content-gap signal. |
| The URL is nonsense or clearly fabricated | **Smart 404 page.** Parse the slug for keywords, suggest relevant pages, and return a proper 404 status code. |

### Step 3: Build a smart 404 page

Never return a generic dead-end 404. At minimum:

```tsx
// app/not-found.tsx (Next.js) or equivalent
export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>
        The page you're looking for doesn't exist. If an AI assistant sent you here,
        it may have guessed the wrong URL.
      </p>
      <h2>You might be looking for:</h2>
      {/* Suggest pages based on the URL slug keywords */}
      <SuggestedPages />
      <p><a href="/">Back to homepage</a></p>
    </main>
  )
}
```

**Critical:** Return a real HTTP `404` status code, not `200`. A "soft 404" (200 status on a
not-found page) confuses search engines and can pollute your index.

### Step 4: Monitor and iterate

Check your 404 logs monthly. As models retrain and update their knowledge, the hallucinated
URLs shift. What was a dead end last month may stop appearing, and new ones will surface.

---

## Job 4: Implement llms.txt

`llms.txt` is the AI-era companion to `robots.txt`. It is a plain Markdown file served at
your site root that gives AI crawlers a concise, authoritative summary of who you are and
what content matters. It is guidance, not access control.

### Format

```markdown
# Ve

> Uganda's trusted online marketplace for verified vendors and quality products.

## Core Pages
- [Home](https://www.ve.co.ug/): Main landing page and product discovery.
- [How It Works](https://www.ve.co.ug/how-it-works): How Ve verifies vendors and protects buyers.
- [Vendor Directory](https://www.ve.co.ug/vendors): Browse verified vendors by category.

## Help & Support
- [FAQ](https://www.ve.co.ug/faq): Common questions about ordering, payments, and delivery.
- [Contact](https://www.ve.co.ug/contact): Reach the Ve team.

## Legal
- [Terms of Service](https://www.ve.co.ug/terms): Terms and conditions.
- [Privacy Policy](https://www.ve.co.ug/privacy): How we handle user data.
```

### Rules

- Exactly one `# H1` at the top: your site name.
- A blockquote summary immediately after.
- `## H2` sections to group pages by category.
- Bulleted Markdown links with short descriptions.
- Curate 10–20 of your highest-value pages. This is not a sitemap dump.
- Serve with `Content-Type: text/plain; charset=utf-8`.

### Next.js implementation

**Option A — static file:** Drop `llms.txt` into `public/`.

**Option B — dynamic route (if your pages change often):**

```typescript
// app/llms.txt/route.ts
export async function GET() {
  const content = `# Ve
> Uganda's trusted online marketplace for verified vendors and quality products.

## Core Pages
- [Home](https://www.ve.co.ug/): Main landing page and product discovery.
- [How It Works](https://www.ve.co.ug/how-it-works): How Ve verifies vendors.
- [Vendor Directory](https://www.ve.co.ug/vendors): Browse verified vendors.

## Help & Support
- [FAQ](https://www.ve.co.ug/faq): Ordering, payments, and delivery questions.
- [Contact](https://www.ve.co.ug/contact): Reach the Ve team.

## Legal
- [Terms of Service](https://www.ve.co.ug/terms)
- [Privacy Policy](https://www.ve.co.ug/privacy)
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

### Vite implementation

Place `llms.txt` directly in `public/`. Vite copies it to `dist/` at build time.

### Verification

```bash
curl -I https://www.ve.co.ug/llms.txt
# Expect: 200 OK, Content-Type: text/plain

curl -s https://www.ve.co.ug/llms.txt | head -5
# Expect: your H1 and summary
```

---

## Checklist

- [ ] `robots.txt` explicitly allows AI search bots (`OAI-SearchBot`, `ChatGPT-User`,
      `Claude-SearchBot`, `PerplexityBot`) and blocks training bots (`GPTBot`, `ClaudeBot`,
      `Google-Extended`, `CCBot`).
- [ ] Public pages return real HTML with content, titles, and structured data when fetched
      by a crawler (test with `curl -s -A "OAI-SearchBot" <url>`).
- [ ] 404 page returns a proper `404` status code (not a soft 404 / 200).
- [ ] 404 page suggests relevant content based on the requested URL.
- [ ] A monthly log review identifies hallucinated URLs worth redirecting or creating.
- [ ] `llms.txt` exists at the site root, returns `200`, and contains a curated summary.
- [ ] `llms.txt` intent does not contradict `robots.txt` (don't link pages you've blocked).

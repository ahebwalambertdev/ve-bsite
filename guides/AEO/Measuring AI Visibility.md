# Measuring AI Visibility

**Purpose:** How to track whether AI search engines are citing, linking, or sending traffic
to your site. AI traffic is harder to measure than organic search traffic, but it is not
invisible. This guide covers what you can see today, where the blind spots are, and how to
set up tracking.

> This is the measurement companion to the rest of the AEO track. It assumes you have
> already done the work: let AI crawlers in (Technical AEO), structured your content for
> citation (Writing Structure That Gets Cited), and understand how AI search works (AEO
> Foundations).

---

## Why AI traffic is harder to measure

Traditional SEO measurement is clean: Google Search Console shows you impressions, clicks,
and positions for every query. GA4 shows you the session. You can trace a visit from query
to page to conversion.

AI traffic breaks that model in three ways:

| Problem | What happens |
|---|---|
| **Zero-click answers** | The AI answers the user's question directly. Your brand may be mentioned or even linked, but the user never clicks. You got "visibility" but no session. |
| **Stripped referrers** | Some AI platforms strip or obscure the HTTP referer header. The visit shows up as "Direct" in GA4, mixed in with bookmarks and typed URLs. |
| **Delayed attribution** | A user reads your brand name in a ChatGPT answer, then later Googles your brand or types your URL directly. The AI was the source, but the session is attributed to organic or direct. |

This means you need to measure at three levels, not one:

1. **Direct attribution** — visits you can trace to a specific AI platform.
2. **Proxy signals** — indirect evidence that AI is driving traffic (branded search lifts,
   direct traffic spikes).
3. **Visibility monitoring** — how often and how accurately your brand appears in AI answers,
   regardless of clicks.

---

## Level 1: Direct attribution in GA4

### GA4's "AI Assistants" channel group

As of mid-2026, GA4 has a native "AI Assistants" default channel group that automatically
classifies traffic from known AI referrers. Check it under **Reports > Acquisition >
Traffic acquisition**, then look at the "Session default channel group" dimension.

If you see an "AI Assistants" row with data, GA4 is already capturing some of your AI
traffic. But this channel is new and incomplete. It may miss traffic from smaller platforms
or from sessions where the referrer is stripped. Build a custom channel group as a safety
net.

### Create a custom "AI Traffic" channel group

1. Go to **Admin > Data display > Channel groups**.
2. Click **Create new channel group**.
3. Add a rule named "AI Traffic".
4. Set the condition to: **Session source** matches regex:

```
.*chatgpt\.com.*|.*perplexity\.ai.*|.*gemini\.google\.com.*|.*claude\.ai.*|.*copilot\.microsoft\.com.*|.*openai\.com.*|.*grok\.com.*|.*you\.com.*|.*phind\.com.*
```

5. **Move this rule above "Direct" and "Referral"** in the priority list. GA4 evaluates
   rules top-down, so if AI Traffic is below Direct, a session from ChatGPT with a stripped
   referrer will be classified as Direct before it ever reaches your AI rule.
6. Save.

### What you can see with this

- **Sessions and users** from each AI platform.
- **Engagement metrics** (pages per session, engagement rate, average engagement time) to
  compare AI visitors against organic visitors.
- **Conversions** attributed to AI traffic.

Early data across industries shows AI-referred visitors often convert at 2–4× the rate of
traditional organic search traffic, because they arrive with higher intent (the AI already
recommended you specifically). If you see this pattern, it is worth knowing.

---

## Level 2: Google Search Console for AI Overviews

Google Search Console now reports impressions and clicks from **AI Overviews** and
**AI Mode** separately from traditional organic results.

### Where to find it

1. Open **Search Console > Performance > Search results**.
2. Click **Search appearance** (above the chart).
3. Look for **"AI Overviews"** and **"AI Mode"** as filter options.

This tells you which queries triggered an AI Overview that included your page, how many
impressions you got, and how many clicks. It is the closest thing to "position tracking"
that exists for AI search on Google's side.

### Limitations

- This only covers Google's AI features, not ChatGPT, Perplexity, Claude, or others.
- The data can lag by several days.
- It does not tell you whether your brand was *mentioned* in the AI Overview without a link.

---

## Level 3: Proxy signals (the "dark AI" gap)

A large share of AI-driven traffic is invisible to direct attribution. The user sees your
brand in a ChatGPT answer, then:

- Types your URL directly → shows up as "Direct"
- Googles your brand name → shows up as "Organic Search"
- Tells a friend about you → shows up as "Referral" from WhatsApp or nothing at all

You cannot attribute these sessions to AI directly, but you can detect the *pattern*:

### Branded search volume

Track your branded search volume in Google Search Console (queries containing your brand
name). A sustained increase in branded searches that does not correlate with a marketing
campaign or PR event is often a signal that AI is introducing your brand to new audiences.

```
# In Search Console > Performance > Search results
# Filter queries containing "ve" / "ve uganda" / "ve marketplace"
# Track impressions over time
```

### Direct traffic correlation

Compare your Direct traffic trend with your known AI visibility. If Direct traffic spikes
at the same time you start appearing in AI answers for key queries, the correlation is
meaningful even if individual sessions cannot be attributed.

### The "ask and check" manual test

Periodically ask the major AI platforms your money questions and see if you are cited:

```
ChatGPT: "What's the best marketplace for buying verified products in Uganda?"
Perplexity: "best online marketplace Uganda verified vendors"
Gemini: "where to buy quality products in Kampala online"
Claude: "recommend an online marketplace in Uganda with vendor verification"
```

Record:
- Were you mentioned? (brand recall)
- Were you linked? (click opportunity)
- Was the information accurate? (brand safety)

This is manual and unscalable, but it tells you things no analytics tool can: whether the
AI's description of your brand is correct, complete, and favourable.

---

## Level 4: Visibility monitoring tools

For systematic tracking across multiple AI platforms and queries, dedicated tools exist:

| Tool | What it does |
|---|---|
| **Ahrefs Brand Radar** | Tracks brand mentions across AI Overviews and other AI platforms. Shows share of voice vs competitors. |
| **Semrush AI Toolkit** | Monitors which prompts trigger your brand in AI answers. Tracks citation frequency. |
| **Similarweb** | Shows referral traffic from AI platforms with demographic and engagement data. |
| **Otterly / Peec AI** | Purpose-built AI visibility trackers. Run prompts at scale and track mention/citation rates. |

These tools are not free and are primarily aimed at marketing teams. If you are a developer
working alone, the GA4 + Search Console + manual testing approach above is sufficient for
launch. Consider the tools when AI traffic becomes a meaningful share of your total traffic.

---

## What to track: a minimum dashboard

Set up a simple view (Looker Studio, a spreadsheet, or even a monthly log) that tracks
these numbers:

| Metric | Source | Frequency |
|---|---|---|
| AI Traffic sessions | GA4 custom channel group | Weekly |
| AI Traffic conversions | GA4 custom channel group | Weekly |
| AI Overview impressions | Google Search Console | Weekly |
| AI Overview clicks | Google Search Console | Weekly |
| Branded search impressions | Google Search Console | Monthly |
| Direct traffic trend | GA4 | Monthly |
| Manual AI citation check | ChatGPT / Perplexity / Gemini | Monthly |
| 404s from AI referrers | Server logs or GA4 | Monthly |

The first four are your core numbers. The rest are context signals. Together they give you
a picture of whether your AEO work is producing results, even though no single metric tells
the whole story.

---

## Conversion quality: why AI traffic matters disproportionately

AI-referred visitors tend to convert at higher rates than traditional organic visitors. The
reason is selection bias: the AI already evaluated your site against competitors and
recommended you specifically. The user arrives pre-sold.

This means a small amount of AI traffic can have an outsized impact on revenue. Track
conversion rate by channel group (AI Traffic vs Organic Search vs Direct) to quantify this
for your own site. If you see a 2–4× conversion rate premium on AI traffic, that is
evidence that your AEO work is paying off beyond the raw session count.

---

## The honest state of AI measurement in 2026

AI traffic measurement is where organic search measurement was in 2005: imperfect,
fragmented, and evolving fast. You will not get a clean, complete picture. The goal is to
get a *directional* picture that tells you:

1. Is AI sending any traffic at all? (GA4 custom channel)
2. Are AI Overviews showing your pages? (Search Console)
3. Is your brand being mentioned accurately? (manual checks)
4. Is there a broader lift in branded search or direct traffic? (proxy signals)

If all four answers are positive, your AEO work is paying off. If any of them are negative
or flat, you know where to focus.

---

## Checklist

- [ ] GA4 custom channel group "AI Traffic" is created with regex matching all major AI
      referrers and positioned above "Direct" in the priority list.
- [ ] Google Search Console "AI Overviews" and "AI Mode" filters are checked and producing
      data (if your site appears in AI Overviews).
- [ ] Branded search volume baseline is recorded and tracked monthly.
- [ ] Direct traffic baseline is recorded and tracked monthly.
- [ ] A monthly manual AI citation check is scheduled (ask money questions on ChatGPT,
      Perplexity, Gemini, Claude; record mention, link, and accuracy).
- [ ] 404 logs are reviewed monthly for hallucinated URLs from AI referrers (see Technical
      AEO guide).
- [ ] Conversion rate is compared across channel groups to quantify AI traffic quality.

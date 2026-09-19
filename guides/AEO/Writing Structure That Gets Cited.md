# Writing Structure That Gets Cited

**Purpose:** How to structure content so an AI model can extract a clean, accurate answer
and attribute it to you. This is the difference between your page being read and your page
being cited.

> This guide is for developers writing or templating content pages (landing pages, FAQ,
> how-it-works, blog posts). It is not a copywriting course. It is about the structural
> patterns that make content machine-liftable.

---

## Why structure matters more than length

AI retrieval works by chunking. When a model retrieves your page during a search, it does
not read the whole thing top to bottom like a human. It splits the page into chunks
(typically a few hundred tokens each), scores each chunk against the user's query, and reads
the top-scoring chunks. Then it synthesizes an answer and (sometimes) cites the source.

This means:

1. **Each section must stand alone.** A chunk that starts mid-thought and ends mid-sentence
   is useless to the model. A section with a clear heading, a direct answer, and supporting
   detail is a self-contained unit the model can lift cleanly.
2. **Front-load the answer.** The model scores relevance on the first few lines of a chunk.
   If your answer is buried after three paragraphs of context, the chunk scores lower and
   may not be selected at all.
3. **Structure is signal.** Headings, tables, and lists are not just formatting. They are
   semantic markers that tell the model "this is a distinct fact" or "these are the options."

---

## The answer-first rule

Put the direct, complete answer in the first 30–50 words of a section. Then expand.

**Bad (buries the answer):**

```markdown
## Payment Methods

Ve has gone through several iterations of payment integration. Initially we
supported only bank transfers, but feedback from our vendor community in 2024
showed that mobile money was the dominant preference. After evaluating multiple
providers, we integrated MTN MoMo and Airtel Money alongside Visa and Mastercard.
```

**Good (answer first, context after):**

```markdown
## Payment Methods

Ve accepts MTN Mobile Money, Airtel Money, Visa, and Mastercard. Mobile money is
the default for most Ugandan buyers.

We integrated mobile money after vendor feedback showed it was the dominant
preference in the Kampala market. Bank transfers were dropped in favour of the
four methods above.
```

The second version gives the model a clean, liftable sentence ("Ve accepts MTN Mobile
Money, Airtel Money, Visa, and Mastercard") in the first line. The first version forces the
model to read four sentences before it finds the same information.

---

## Question-led headings

Use H2 and H3 headings that mirror the questions people actually ask. AI fan-out queries
(covered in AEO Foundations) are phrased as questions or search strings, and the model
matches them against your headings.

| Weak heading | Strong heading |
|---|---|
| Payment Information | What payment methods does Ve accept? |
| Delivery | How long does delivery take in Kampala? |
| About Our Verification | How does Ve verify vendors? |
| Pricing | How much does it cost to list on Ve? |

You do not need to make every heading a question, but your key informational sections
should mirror the way someone would ask about that topic. The model treats headings as
semantic anchors for the text below them.

---

## High-citability content formats

Some formats are structurally easier for AI models to parse and cite. Use them deliberately.

### Tables

Tables are the single most machine-readable format. A model can extract a cell value from a
table far more reliably than from a paragraph that says the same thing in prose.

```markdown
| Plan | Monthly Price | Listings | Commission |
|---|---|---|---|
| Starter | Free | Up to 10 | 8% |
| Growth | UGX 50,000 | Up to 100 | 5% |
| Pro | UGX 150,000 | Unlimited | 3% |
```

Use tables for: pricing, feature comparisons, specifications, timelines, coverage areas,
anything with two or more dimensions.

### FAQ blocks

A question followed immediately by a short, direct answer is the exact pattern AI models
use to serve conversational responses. Mark them up with `FAQPage` schema (see the
Structured Data Guide) so Google AI Overviews can pull them as featured snippets too.

```markdown
### How long does delivery take?

Most Kampala deliveries arrive within 24 hours. Deliveries outside Kampala
typically take 2–4 business days depending on the courier and destination.

### Can I return a product?

Yes. Ve offers a 7-day return window for all verified vendor products. Start a
return from your order page or contact support via WhatsApp.
```

### Numbered lists (step-by-step)

When the content describes a process, use a numbered list. The model can extract and
reproduce sequential steps cleanly.

```markdown
### How to place an order on Ve

1. Browse or search for a product.
2. Tap "Add to Cart" and review your items.
3. Choose your payment method (MoMo, Airtel Money, Visa, or Mastercard).
4. Confirm your delivery address.
5. Tap "Place Order" — you'll receive a confirmation on WhatsApp within 2 minutes.
```

### Definition/stat pairs

When you have a specific, verifiable number, present it as a clear pair. Models love
extractable facts.

```markdown
**Average delivery time in Kampala:** 18 hours from order to doorstep.

**Vendor verification rate:** 100% of Ve vendors complete a 5-step verification
process before their first listing goes live.
```

---

## Atomic chunking

Each section should be a self-contained "chunk" that answers one question completely. Do
not write a 2,000-word section that covers five subtopics under one heading. Split it.

**The test:** Can you read this section in isolation, without reading the sections above or
below it, and still understand what it says? If yes, it is a good chunk. If no, break it up
or add enough context at the start of the section to make it standalone.

This does not mean every section must be short. A detailed "How Ve Verifies Vendors" section
can be 500 words and still be one chunk, as long as it covers one topic from start to finish.

---

## TL;DR / summary blocks

Add a summary block near the top of long content pages. Models weigh front-loaded content
heavily during retrieval. A 2–3 sentence summary at the top of a page increases the chance
that the page is selected and the summary is cited, even if the detailed answer is further
down.

```markdown
# How Ve Protects Buyers

**Summary:** Ve verifies every vendor through a 5-step process, holds payment in
escrow until delivery is confirmed, and offers a 7-day return window. Buyers can
track their order and contact support via WhatsApp at any point.

---

## The 5-Step Vendor Verification Process

[detailed content follows]
```

---

## Use specific, verifiable data

AI models prioritize "dense" facts: specific numbers, dates, and named entities. Vague
language gets paraphrased away; specific language gets cited.

| Vague (low citability) | Specific (high citability) |
|---|---|
| "We deliver quickly across Uganda" | "Average delivery time: 18 hours in Kampala, 2–4 days upcountry" |
| "Our vendors are carefully vetted" | "100% of vendors complete a 5-step verification including business registration, ID, and physical address check" |
| "We've grown a lot this year" | "Ve onboarded 340 verified vendors between January and September 2026" |
| "Competitive commission rates" | "Commission: 3% on the Pro plan, 5% on Growth, 8% on Starter" |

The specific versions give the model a fact it can quote. The vague versions give it
nothing it cannot generate on its own, so there is no reason to cite you.

---

## Link to primary sources

When you cite a stat, a regulation, or a standard, link directly to the primary source. AI
models evaluate source quality. Linking to original data (a government registry, a standards
body, an official report) rather than a secondary blog post signals authority.

```markdown
All Ve vendors are registered with the
[Uganda Registration Services Bureau](https://ursb.go.ug/) and verified against the
bureau's public business registry.
```

---

## Schema markup reinforces structure

Structured data (JSON-LD) does not directly cause AI citations, but it helps models
understand the relationships between entities on your page: which text is a product name,
which number is a price, which block is an FAQ. This reduces misinterpretation.

The Structured Data Guide covers the implementation. At minimum, use:

- `Organization` on the homepage.
- `FAQPage` on FAQ and how-it-works pages.
- `Product` + `Offer` on product/listing pages.
- `HowTo` on step-by-step guides.
- `BreadcrumbList` on all pages (helps the model understand site structure).

---

## The template

When you create a new content page, follow this skeleton:

```markdown
# [Page Title — clear, descriptive]

**Summary:** [2–3 sentences that directly answer the main question this page addresses.]

---

## [Question-led H2: the primary subtopic]

[Answer in the first 30–50 words. Then supporting detail, examples, or data.]

## [Question-led H2: second subtopic]

[Same pattern.]

### [H3 for sub-questions or details within a section]

[Keep each section atomic and self-contained.]

## Frequently Asked Questions

### [Question?]
[Direct answer, 1–3 sentences.]

### [Question?]
[Direct answer, 1–3 sentences.]
```

---

## Checklist

- [ ] Every informational section starts with a direct answer in the first 30–50 words.
- [ ] Key headings are phrased as questions or clear topic labels, not vague nouns.
- [ ] Comparison data, pricing, and specs are in tables, not prose.
- [ ] FAQ sections use question-answer pairs, each under its own heading.
- [ ] Process content uses numbered lists.
- [ ] Long pages have a TL;DR or summary block near the top.
- [ ] Stats and claims use specific numbers, dates, and named entities.
- [ ] External references link to primary sources, not secondary summaries.
- [ ] JSON-LD structured data matches the page content (FAQPage, Product, HowTo, etc.).
- [ ] Each section passes the "read it in isolation" test for atomic chunking.

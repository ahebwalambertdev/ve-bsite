---
name: Ve Main Website
description: Curated fashion marketplace and Virtual Try-On platform for Kampala, Uganda
colors:
  snow: "#FFFAF6"
  dusty-olive: "#7C8B74"
  carbon-black: "#252525"
  soft-linen: "#DDE3D8"
  canvas: "{colors.snow}"
  surface: "{colors.snow}"
  surface-subtle: "{colors.soft-linen}"
  surface-dark: "{colors.carbon-black}"
  text-primary: "{colors.carbon-black}"
  text-secondary: "{colors.dusty-olive}"
  text-muted: "#5A5D57"
  text-inverted: "{colors.snow}"
  border: "{colors.soft-linen}"
  accent: "{colors.dusty-olive}"
typography:
  display:
    fontFamily: "'Newsreader', 'Instrument Serif', 'Playfair Display', Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Geist Sans', 'Outfit', 'Cabinet Grotesk', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Inter', 'Geist Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  mono:
    fontFamily: "'Geist Mono', 'SF Mono', monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.carbon-black}"
    textColor: "{colors.snow}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-primary-active:
    backgroundColor: "{colors.carbon-black}"
    textColor: "{colors.snow}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-accent:
    backgroundColor: "{colors.dusty-olive}"
    textColor: "{colors.snow}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.snow}"
    textColor: "{colors.carbon-black}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.soft-linen}"
    textColor: "{colors.carbon-black}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System Constitution

## Overview

The Ve website design system translates the energy, texture, and sophistication of Kampala's fashion ecosystem into an organic editorial web experience. It moves deliberately past generic AI templates (centered hero over dark purple mesh, 3 identical cards, floating bubbles) to produce a tactile, high-agency publication feel.

### Taste Dials
- **`DESIGN_VARIANCE: 8` (Artisanal Asymmetry):** Varied card dimensions, asymmetric 2-column hero layouts, and offset editorial callouts rather than mechanical grid symmetry.
- **`MOTION_INTENSITY: 5` (Tactile Physics):** Purposeful micro-motion on interactions. Buttons compress on press; popovers scale from their trigger; hover states feel snappy. Zero gratuitous floating loops or distracting scroll locks.
- **`VISUAL_DENSITY: 4` (Art Gallery Airy):** Generous macro-spacing, high-fashion breathing room, and structured reading rhythm designed for legibility on small mobile displays.

---

## Colors

Ve's palette is grounded in an authentic 4-tone organic scale:

| Token | HEX | HSL | RGB | Role & Hierarchy |
|---|---|---|---|---|
| **`snow`** | `#FFFAF6` | `hsl(27, 100%, 98%)` | `rgb(255, 250, 246)` | **Light Canvas & Primary Surface:** Warm paper-like editorial background that prevents eye fatigue. |
| **`dusty-olive`** | `#7C8B74` | `hsl(99, 9%, 50%)` | `rgb(124, 139, 116)` | **Signature Brand Accent:** Botanical accent for active pills, verified trust icons, secondary buttons, and tags. |
| **`carbon-black`** | `#252525` | `hsl(0, 0%, 15%)` | `rgb(37, 37, 37)` | **High-Contrast Typography & Dark Surface:** Deep charcoal for body text, primary buttons, and dark footers. |
| **`soft-linen`** | `#DDE3D8` | `hsl(93, 16%, 87%)` | `rgb(221, 227, 216)` | **Containers & Structural Borders:** Subtle card fills, dividers, alternating table rows, and secondary backgrounds. |

### Semantic UI Token Mapping
- `--color-canvas`: `#FFFAF6` (Snow)
- `--color-surface`: `#FFFAF6` (Snow)
- `--color-surface-subtle`: `#DDE3D8` (Soft Linen)
- `--color-surface-dark`: `#252525` (Carbon Black)
- `--color-text-primary`: `#252525` (Carbon Black)
- `--color-text-secondary`: `#7C8B74` (Dusty Olive)
- `--color-text-muted`: `#5A5D57` (Deep Tinted Gray)
- `--color-text-inverted`: `#FFFAF6` (Snow)
- `--color-border`: `#DDE3D8` (Soft Linen)
- `--color-accent`: `#7C8B74` (Dusty Olive)

### Contrast & Legibility Matrix (WCAG 2.1 AA Standards)
- **Carbon Black on Snow:** **$14.2:1$** (Exceeds WCAG AAA requirement of $7.0:1$). Used for all body text, headings, and primary reading surfaces.
- **Carbon Black on Soft Linen:** **$11.3:1$** (Exceeds WCAG AAA). Used for cards, tags, and table rows.
- **Snow on Carbon Black:** **$14.2:1$** (Exceeds WCAG AAA). Used for dark footer text, hero inverted badges, and primary action buttons.
- **Dusty Olive Usage:** Restricted to large typography ($18\text{px}+$ or bold $14\text{px}+$ where contrast threshold is $3.0:1$), graphical borders, pill containers, and icons. Never use Dusty Olive for small body text on Snow.

### Brand Gradients
```css
/* Subtle brand gradients for cards, dynamic badges, and hero highlights */
--gradient-horizontal: linear-gradient(90deg, #FFFAF6, #DDE3D8);
--gradient-olive-glow: linear-gradient(135deg, rgba(124, 139, 116, 0.15), rgba(221, 227, 216, 0.4));
--gradient-carbon-dark: linear-gradient(180deg, #252525, #1B1B1B);
--gradient-brand-radial: radial-gradient(#FFFAF6, #7C8B74, #252525, #DDE3D8);
```

---

## Typography

Ve pairs an authoritative **editorial serif display font** with a clean, high-performance **neutral sans-serif body font**.

### Font Stacks
1. **Display & Headlines:** `'Newsreader'`, `'Instrument Serif'`, `'Playfair Display'`, serif.
   - Conveys editorial craft, fashion heritage, and curation.
   - Apply tight line-height (`1.1` to `1.2`) and negative letter-spacing (`-0.02em` to `-0.03em`).
2. **Subheadings & Functional Titles:** `'Geist Sans'`, `'Outfit'`, `'Cabinet Grotesk'`, sans-serif.
   - Clean, geometric clarity for section intros, cards, and modal titles.
3. **Body & Paragraphs:** `'Inter'`, `'Geist Sans'`, system-ui, sans-serif.
   - Engineered for maximum legibility on budget Android viewports.
   - Line-height: `1.6`. Paragraph line lengths capped at $65$ characters (`max-w-prose`).
4. **Data, Metrics & Badges:** `'Geist Mono'`, `'SF Mono'`, monospace.
   - Used for Trust Report figures, dates, SKU codes, and reading time estimates.

---

## Layout

### Strict Cumulative Layout Shift (CLS) Defense
To eliminate layout recalculations on fluctuating 3G connections (guaranteeing CLS $\le 0.05$):
- **Mandatory Aspect Ratios:** All image containers, UGC unboxing cards, and video modal triggers must specify explicit CSS aspect ratios (`aspect-[4/5]`, `aspect-square`, or `aspect-video`) or hardcoded `width`/`height` properties in `next/image`.
- **Skeleton Shimmers:** Skeletons must match the exact dimensions and aspect ratio of incoming content blocks.

### Breakpoints & Container Hierarchy
- **Mobile First ($360\text{px} - 430\text{px}$):** Single-column layout, bottom-anchored touch targets ($\ge 48\text{px}$ touch targets), horizontal scroll strips with snap points for product previews.
- **Tablet ($768\text{px} - 1024\text{px}$):** 2-column asymmetric cards.
- **Desktop ($1024\text{px} - 1280\text{px}$):** Centered container (`max-w-7xl` / `1200px`), generous horizontal gutters (`px-6` to `px-12`).

---

## Elevation & Depth

Ve avoids heavy, blurred black drop shadows that look dated and muddy on OLED screens.

- **Flat Surface with Structural Borders:** Boundaries are defined primarily through 1px solid borders in `soft-linen` (`#DDE3D8`).
- **Tactile Micro-Shadow (Cards & Modals):**
  ```css
  /* Ultra-diffuse, low-opacity ambient lift */
  --shadow-subtle: 0 1px 3px rgba(37, 37, 37, 0.04), 0 4px 12px rgba(37, 37, 37, 0.03);
  --shadow-elevated: 0 8px 24px rgba(37, 37, 37, 0.06), 0 2px 6px rgba(37, 37, 37, 0.03);
  ```
- **Surface Layering:**
  - Base: Canvas (`snow` `#FFFAF6`)
  - Elevated Container: Card (`snow` with `border: 1px solid #DDE3D8` and `--shadow-subtle`)
  - Secondary Inset: Subtle container (`soft-linen` `#DDE3D8`)
  - Overlays / Drawers: White/Snow modal surface with `--shadow-elevated` and backdrop blur (`backdrop-blur-md`).

---

## Shapes

- **Base Radius (`rounded-md` / 8px):** Primary buttons, text inputs, accordion headers.
- **Card Radius (`rounded-lg` / 12px - `rounded-xl` / 16px):** Unboxing cards, trust report panels, feature cards.
- **Pill Radius (`rounded-full` / 9999px):** Category filter tabs, status badges, secondary pill buttons (`/sell` teaser).
- **Prohibited Geometry:** Do not use `rounded-full` for large content containers, form input fields, or multi-line cards.

---

## Components (Craft Standards per Emil Kowalski)

### 1. Buttons
- **Responsive Press Physics:** Every pressable element must include an `:active` state with `transform: scale(0.97)` and `transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)`.
- **States:**
  - *Default:* High-contrast solid fill.
  - *Hover:* Micro-lift (`transform: translate3d(0, -1px, 0)`). Never animate `background-color` with heavy transitions.
  - *Active:* `transform: scale(0.97)`.
  - *Focus:* High-visibility 2px outline offset by 2px in `dusty-olive` (`#7C8B74`).

### 2. Social Proof Cards (`#VerifiedByVe`)
- **No Live Social Iframes:** Render static WebP posters cached via Cloudinary with a centered SVG play badge.
- **Fixed Aspect Ratio:** `aspect-[4/5]`.
- **Interaction:** Tapping triggers a lightweight video player modal or deep-links directly.

### 3. FAQ Accordions
- **Direct-Answer First:** Accordion content leads with a bold, complete direct answer in the first sentence.
- **GPU Motion Only:** Accordion expansion animates `transform` and `opacity`. Never animate `height` or `max-height` directly on low-spec mobile chipsets.

### 4. Popovers & Tooltips
- **Origin-Aware Scaling:** Popovers scale in from their trigger point (`transform-origin: var(--transform-origin)`), not from center.
- **Entrance Formula:** Start from `scale(0.95)` and `opacity: 0`. **Never animate from `scale(0)`.**

---

## Do's and Don'ts (Anti-Slop Guardrails)

### Do:
- **Do** treat typography and photography as the primary design heroes.
- **Do** use the exact 4-color palette tokens (`snow`, `dusty-olive`, `carbon-black`, `soft-linen`).
- **Do** specify fixed aspect ratios on every media container to protect CLS $\le 0.05$.
- **Do** anchor copy in verifiable facts, delivery guarantees, and Trust Report metrics.
- **Do** enforce `@media (prefers-reduced-motion: reduce)` globally.

### Don't:
- **Don't** use AI-purple, indigo-to-cyan, or pink neon gradients anywhere.
- **Don't** use generic stock photos of smiling models in generic Western office/urban settings.
- **Don't** embed live Instagram or TikTok iframes (destroys 3G mobile page budget).
- **Don't** nest cards inside cards inside cards.
- **Don't** animate layout properties (`width`, `height`, `margin`, `padding`, `top`, `bottom`) or paint triggers (`box-shadow`, `border-width`).
- **Don't** use pure `#000000` or generic `#808080`. Always use `carbon-black` (`#252525`) and `soft-linen` (`#DDE3D8`).
- **Don't** use AI copy clichés: *"Elevate your wardrobe"*, *"Seamless experience"*, *"Unleash your style"*. Use direct, grounded language.

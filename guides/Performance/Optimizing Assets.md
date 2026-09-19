# Optimizing Assets

**The bottleneck in one sentence:** your app ships a 2MB hero image as a raw JPEG, serves it from the same origin as your HTML, and sends no cache headers — so every visitor downloads it fresh, every time, at full desktop resolution even on a phone.

AI coding assistants are good at making things appear on screen. They'll drop an `<img src="/hero.jpg">` into your component and it works. What they skip is the chain of decisions between "it works" and "it's fast": format, compression, responsive sizing, CDN offloading, and cache headers. Each one is a separate concern, and none of them is implied by "add an image here."

---

## What it looks like

A component that renders images with no size optimization, no modern format, and no caching strategy:

```tsx
// components/ProductCard.tsx — looks done, performs badly
export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={`/uploads/${product.image}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>UGX {product.price.toLocaleString()}</p>
    </div>
  )
}
```

This is a 1600×1200 JPEG at quality 92, served from `/uploads/` on the same origin as the app, with no `width`/`height`, no `srcset`, no `loading="lazy"`, and whatever cache headers the framework defaults to (often `no-cache`).

On a Kampala 3G connection, this single image can take 4–8 seconds to load. Multiply by a product grid of 20 cards and the page is unusable.

## Why AI tools generate this

**Modern formats aren't the default.** `<img src="photo.jpg">` is the most common pattern in training data. AVIF, WebP, `<picture>` elements, and `srcset` are more complex and less common, so an assistant won't reach for them unless asked.

**Caching is invisible in the editor.** There's no feedback telling the assistant that the same image is being re-downloaded on every page load. The dev server serves everything uncached by default, so neither human nor assistant notices.

**CDN setup is infrastructure, not code.** An AI assistant generates code. Configuring Cloudflare, CloudFront, or Vercel's edge network is a deployment concern that falls outside the scope of "build this component."

---

## What it costs

| Problem | Impact |
|---|---|
| No modern format (AVIF/WebP) | 40–60% larger files than necessary. AVIF typically achieves 50% smaller files than JPEG at equivalent visual quality. |
| No responsive images | Mobile downloads the same 1600px image as desktop. A 200KB image on desktop could be 60KB at mobile resolution. |
| No `loading="lazy"` on below-fold images | Every image starts downloading immediately, competing with the above-fold content for bandwidth. |
| No cache headers | Returning visitors re-download every image. A product grid that loads in 3s on first visit should load in <0.5s on return. |
| No CDN | Images served from the origin server add latency (round-trip to wherever your server is) and load on your infrastructure. |
| No `width`/`height` | Layout shifts (CLS) as images load and push content around. |

---

## The fix: images

### 1. Use modern formats with fallbacks

```html
<picture>
  <source srcset="/images/hero-800.avif 800w, /images/hero-1400.avif 1400w"
          type="image/avif" sizes="100vw" />
  <source srcset="/images/hero-800.webp 800w, /images/hero-1400.webp 1400w"
          type="image/webp" sizes="100vw" />
  <img src="/images/hero-1400.jpg"
       srcset="/images/hero-800.jpg 800w, /images/hero-1400.jpg 1400w"
       sizes="100vw"
       width="1400" height="900"
       alt="Product dashboard showing order status"
       loading="lazy" />
</picture>
```

The browser picks the best format it supports (AVIF > WebP > JPEG) and the right size for the viewport. Always include `width` and `height` to prevent layout shift.

### 2. Next.js: use `next/image`

`next/image` handles format conversion, responsive sizing, and caching automatically:

```tsx
import Image from 'next/image'

export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Image
        src={`/uploads/${product.image}`}
        alt={product.name}
        width={400}
        height={300}
        sizes="(max-width: 768px) 100vw, 400px"
        quality={75}
      />
      <h3>{product.name}</h3>
      <p>UGX {product.price.toLocaleString()}</p>
    </div>
  )
}
```

`next/image` serves AVIF/WebP automatically, resizes on the server, and sets aggressive cache headers. Do not bypass it with a plain `<img>` tag unless you have a specific reason.

### 3. Vite: build-time compression

```bash
npm install --save-dev vite-plugin-imagemin
```

```typescript
// vite.config.ts
import imagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    imagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8] },
      webp: { quality: 75 },
      avif: { quality: 50 },
    }),
  ],
})
```

For images that are not bundled (user uploads, CDN-hosted), generate responsive variants at upload time or use an image CDN (Cloudinary, Imgix, Cloudflare Images).

### 4. Lazy-load below-fold images, eagerly load above-fold

```html
<!-- Above the fold: load immediately, high priority -->
<img src="/hero.avif" fetchpriority="high" alt="..." width="1400" height="900" />

<!-- Below the fold: lazy load -->
<img src="/product-1.avif" loading="lazy" alt="..." width="400" height="300" />
<img src="/product-2.avif" loading="lazy" alt="..." width="400" height="300" />
```

**Never** lazy-load your LCP image (the hero/main image). Use `fetchpriority="high"` on it instead.

---

## The fix: cache headers

This is the rule most people get backwards.

### The two-tier model

| Asset type | Example | Cache header |
|---|---|---|
| **Hashed/fingerprinted** (filename changes when content changes) | `main.a3f9c2.js`, `hero.b7d1e4.avif` | `Cache-Control: public, max-age=31536000, immutable` |
| **Unhashed** (same filename, content may change) | `logo.png`, `/api/products` | `Cache-Control: public, max-age=3600, must-revalidate` |

The mistake is applying short cache times to hashed assets or long cache times to unhashed ones:

- **Hashed + short cache** = the browser re-validates files that literally cannot have changed (the hash guarantees it). Wasted round-trips.
- **Unhashed + immutable** = you update the logo and users see the old one for a year. No way to bust the cache without changing the URL.

### Vite handles hashing automatically

Vite fingerprints all bundled assets (`main.a3f9c2.js`). You just need to set the right headers on your hosting.

**Vercel (`vercel.json`):**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Nginx:**

```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Cloudflare:** Set a Page Rule or Cache Rule for `/assets/*` with Edge TTL of 1 year and Browser TTL of 1 year.

### Next.js handles it by default

`next/image` and `_next/static/` assets ship with aggressive cache headers automatically. Verify with:

```bash
curl -I https://yoursite.com/_next/static/chunks/main-abc123.js | grep -i cache-control
# Should show: public, max-age=31536000, immutable
```

---

## The fix: CDN offloading

If your images are served from the same origin as your app, every image request competes with your API for server resources and adds origin-server latency.

**Minimum viable CDN setup:**

1. Upload images to an object store (S3, R2, GCS, Supabase Storage).
2. Put a CDN in front (CloudFront, Cloudflare, Vercel Edge).
3. Reference images by their CDN URL, not a local path.

```tsx
// Instead of:
<img src="/uploads/product-123.jpg" />

// Use:
<img src="https://cdn.ve.co.ug/uploads/product-123.avif" />
```

For user-uploaded images, generate AVIF/WebP variants at upload time (using Sharp or a managed image service) and store all variants. Serve the best format based on the `Accept` header or `<picture>` element.

---

## How to measure

```bash
# 1. Lighthouse: look at "Serve images in next-gen formats" and "Properly size images"
npx lighthouse https://yoursite.com --view

# 2. Check cache headers on a specific asset
curl -I https://yoursite.com/assets/hero.avif | grep -i cache-control

# 3. Check total image weight on a page
# Chrome DevTools → Network → filter by Img → look at total transferred size
```

---

## Checklist

- [ ] All images are served in AVIF or WebP with JPEG/PNG fallback.
- [ ] Product/listing images have responsive `srcset` with at least 2 sizes.
- [ ] Above-fold images use `fetchpriority="high"`; all below-fold images use `loading="lazy"`.
- [ ] All images have explicit `width` and `height` attributes (no CLS).
- [ ] Hashed static assets have `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Unhashed assets have short cache times with `must-revalidate`.
- [ ] Images are served from a CDN, not the application origin.
- [ ] `curl -I` on a production image confirms correct cache headers.

---

## Prompt for your AI assistant

```text
Audit every <img> and image-rendering pattern in this codebase. For each image:
1. Is it served in AVIF/WebP with a fallback?
2. Does it have a responsive srcset with at least two sizes?
3. Does it have explicit width and height attributes?
4. Is below-fold content using loading="lazy"?
5. Is the LCP/hero image using fetchpriority="high" and NOT lazy-loaded?

Also check the hosting/CDN config: are hashed static assets getting
Cache-Control: public, max-age=31536000, immutable? Are unhashed assets
getting short cache times with must-revalidate?

Report each finding with the file, line, and a concrete fix. Do not fix
anything yet — just report.
```

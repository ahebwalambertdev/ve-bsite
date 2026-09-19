# Rendering Large Lists

**The bottleneck in one sentence:** virtualize long feeds instead of mounting 500 cards, and fix live-update handlers that leak state across items.

A product listing page renders 300 cards by mapping over an array and mounting a React component for each one. Every card has event handlers, state, and DOM nodes. The browser creates 300 DOM subtrees, React manages 300 component instances, and the page takes 2 seconds to become interactive. On a mid-range Android phone in Kampala, it's 5 seconds. Scroll down and things get worse: all 300 stay mounted even though only 8 are visible.

---

## What it looks like

### Mount everything at once

```tsx
// ❌ Renders all 300+ cards — 300 DOM subtrees, all mounted, all in memory
export function ProductGrid({ products }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

If `ProductCard` includes an image, a price, a vendor badge, a "save" button, and a quick-view tooltip, each instance is ~30 DOM nodes. 300 cards × 30 nodes = 9,000 DOM nodes just for the grid. The browser's recommended limit is around 1,500 total nodes for smooth performance.

### Infinite scroll without virtualization

```tsx
// ❌ Appends new pages to the bottom, but never removes old ones
export function ProductFeed() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)

  const loadMore = async () => {
    const next = await fetchProducts(page + 1)
    setProducts((prev) => [...prev, ...next])  // list grows forever
    setPage((p) => p + 1)
  }

  return (
    <div>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
      <button onClick={loadMore}>Load more</button>
    </div>
  )
}
```

After 10 pages of 30 items each, there are 300 mounted cards. After 30 pages, 900. The DOM keeps growing, memory rises, scroll performance degrades, and on low-end devices the tab crashes.

### Live-update handler that leaks state across items

```tsx
// ❌ Subscription fires for ALL products, re-renders the whole list
useEffect(() => {
  const channel = supabase
    .channel('products')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' },
      (payload) => {
        // Refetches the entire list when any single product changes
        refetchAllProducts()
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
```

One product's price changes and the entire list re-renders. If the list is 300 items, React diffs all 300 components. If each card has internal state (e.g., a hover tooltip open), it may flash or reset.

## Why AI tools generate this

**`.map()` is the canonical React pattern.** Every React tutorial teaches `{items.map(item => <Component key={item.id} />)}`. Virtualization is a separate library with different API concepts. An assistant won't introduce it unless asked.

**Infinite scroll without virtualization still "works."** The page loads, items appear, load-more works. The degradation is gradual — it's fine at 50 items, noticeable at 200, and broken at 500. The assistant never sees the 500-item state.

**Targeted re-renders require architectural decisions.** Updating one card in a list of 300 without re-rendering the other 299 requires either keyed cache invalidation (TanStack Query), memoization (`React.memo` with stable props), or moving the subscription into the individual card. None of these is implied by "show live product updates."

---

## What it costs

| Items mounted | DOM nodes (~30/card) | Time to interactive (mid-range phone) | Memory |
|---|---|---|---|
| 30 | ~900 | <1s | ~15MB |
| 100 | ~3,000 | ~1.5s | ~40MB |
| 300 | ~9,000 | ~3–5s | ~100MB |
| 1,000 | ~30,000 | 10s+ / crashes | ~300MB+ |

Virtualization keeps the mounted count constant regardless of list size — typically 10–20 visible items plus a small overscan buffer.

---

## The fix: virtualize

### TanStack Virtual (recommended for new projects)

```bash
npm install @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function ProductGrid({ products }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320,  // estimated card height in px
    overscan: 5,              // render 5 extra items above/below viewport
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '100vh', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

Only the visible items (plus overscan) are rendered. Scroll through 10,000 items and the DOM stays at ~30 nodes. TanStack Virtual is "headless" — it manages the positioning logic, you control the markup.

### react-virtuoso (batteries-included alternative)

```bash
npm install react-virtuoso
```

```tsx
import { Virtuoso } from 'react-virtuoso'

export function ProductFeed({ products, loadMore }) {
  return (
    <Virtuoso
      style={{ height: '100vh' }}
      data={products}
      endReached={loadMore}
      overscan={200}
      itemContent={(index, product) => (
        <ProductCard product={product} />
      )}
    />
  )
}
```

Virtuoso handles dynamic heights, sticky headers, grouped lists, and infinite scroll out of the box. Less control, less boilerplate.

### Grid virtualization

For a product grid (multiple columns), TanStack Virtual supports a grid mode:

```tsx
const virtualizer = useVirtualizer({
  count: Math.ceil(products.length / columns),
  getScrollElement: () => parentRef.current,
  estimateSize: () => 320,
  overscan: 2,
})

// Inside the render, compute which products belong to each virtual row
{virtualizer.getVirtualItems().map((virtualRow) => {
  const startIndex = virtualRow.index * columns
  const rowProducts = products.slice(startIndex, startIndex + columns)
  return (
    <div key={virtualRow.key} className="grid-row" style={...}>
      {rowProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
})}
```

---

## The fix: infinite scroll + virtualization

Combine TanStack Query's infinite queries with virtualization:

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { Virtuoso } from 'react-virtuoso'

export function ProductFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['products'],
      queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length + 1 : undefined,
    })

  const allProducts = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <Virtuoso
      style={{ height: '100vh' }}
      data={allProducts}
      endReached={() => hasNextPage && fetchNextPage()}
      itemContent={(index, product) => (
        <ProductCard product={product} />
      )}
      components={{
        Footer: () =>
          isFetchingNextPage ? <Spinner /> : null,
      }}
    />
  )
}
```

The list grows logically (new pages are fetched) but the DOM stays constant (virtualization). Memory stays bounded. Scroll is smooth.

---

## The fix: targeted re-renders for live updates

Instead of re-rendering the entire list when one item changes, update just the affected item:

```tsx
// ✅ Update a single item in the TanStack Query cache
useEffect(() => {
  const channel = supabase
    .channel('products')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'products' },
      (payload) => {
        queryClient.setQueryData(['products'], (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              ),
            })),
          }
        })
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [queryClient])
```

Pair this with `React.memo` on `ProductCard`:

```tsx
// ✅ Only re-renders when this specific product's data changes
const ProductCard = React.memo(function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p>UGX {product.price.toLocaleString()}</p>
    </div>
  )
})
```

Now one product update re-renders one card. The other 299 are untouched.

---

## When virtualization is not worth it

- **Lists under ~50 items** that are not expected to grow. The overhead of setting up virtualization exceeds the benefit.
- **Content that must be fully rendered for SEO.** If crawlers need to see all items, prerender the full list server-side and virtualize only the client-side interaction. Or use pagination instead.
- **Print layouts.** Virtualized lists only render visible items; printing captures an empty page. Provide a separate print view or paginated export.

---

## Checklist

- [ ] Any list rendering 100+ items uses virtualization (`@tanstack/react-virtual` or `react-virtuoso`).
- [ ] Infinite scroll uses a virtualized container, not DOM append (the list doesn't grow unboundedly in the DOM).
- [ ] Product/listing cards use `React.memo` to avoid re-renders from unchanged props.
- [ ] Real-time subscriptions update individual cache entries, not the entire list.
- [ ] Below-fold images in cards use `loading="lazy"`.
- [ ] Grid layouts virtualize by row, not by individual cell.

---

## Prompt for your AI assistant

```text
Audit this codebase for list rendering performance issues:

1. Any .map() that renders more than ~50 items without virtualization.
2. Any infinite scroll or "load more" pattern that appends items to the
   DOM without removing old ones (unbounded DOM growth).
3. Any real-time subscription that refetches or re-renders an entire list
   when only one item changed.
4. Any list item component that is missing React.memo when the list is
   large or frequently updated.

For each finding, give me: the file and line, the current maximum list size,
the estimated DOM node count, and a fix using @tanstack/react-virtual or
react-virtuoso. Do not fix anything yet — just report.
```

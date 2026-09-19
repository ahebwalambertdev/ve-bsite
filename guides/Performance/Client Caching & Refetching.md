# Client Caching & Refetching

**The bottleneck in one sentence:** cache and dedupe requests with TanStack Query or SWR, and replace polling with events where a live channel exists.

Every time a user navigates to a page, the app fires a fresh API request for data that hasn't changed since the last visit 10 seconds ago. Meanwhile, a dashboard that does need live data polls the server every 3 seconds — 20 requests per minute per tab — to check if anything updated, when the backend already supports real-time subscriptions.

---

## What it looks like

### No client cache: refetch on every mount

```tsx
// ❌ Fetches vendor data on every mount — navigating away and back fires it again
export function VendorPage({ vendorId }) {
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/vendors/${vendorId}`)
      .then((res) => res.json())
      .then((data) => {
        setVendor(data)
        setLoading(false)
      })
  }, [vendorId])

  if (loading) return <Spinner />
  return <VendorProfile vendor={vendor} />
}
```

Navigate to this page, go back, come back again — three fetches for the same data. The user sees a spinner every time. On a 3G connection in Kampala, each spinner is 1–3 seconds of dead time.

### Polling instead of subscribing

```tsx
// ❌ Polls every 3 seconds for new orders — 20 requests/min/tab
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch('/api/orders?status=pending')
    const data = await res.json()
    setOrders(data)
  }, 3000)
  return () => clearInterval(interval)
}, [])
```

If 10 vendor dashboard tabs are open, that's 200 requests per minute to the same endpoint. Most of those return identical data because nothing changed.

### Duplicate requests from sibling components

```tsx
// ❌ Two components on the same page both fetch the same vendor
function VendorHeader({ vendorId }) {
  const [vendor, setVendor] = useState(null)
  useEffect(() => {
    fetch(`/api/vendors/${vendorId}`).then(r => r.json()).then(setVendor)
  }, [vendorId])
  return <h1>{vendor?.name}</h1>
}

function VendorStats({ vendorId }) {
  const [vendor, setVendor] = useState(null)
  useEffect(() => {
    fetch(`/api/vendors/${vendorId}`).then(r => r.json()).then(setVendor)
  }, [vendorId])
  return <p>{vendor?.productCount} products</p>
}
```

Two identical requests fire simultaneously because neither component knows the other exists.

## Why AI tools generate this

**`useEffect` + `fetch` is the most common pattern in training data.** It always works, it's self-contained, and it has no dependencies beyond React itself. TanStack Query and SWR require a library install, a provider wrapper, and a different mental model.

**Caching is a cross-cutting concern.** The assistant is asked to "load vendor data on this page." It produces code that loads vendor data on that page. Whether another page already loaded the same data is not part of the prompt.

**Polling is the obvious solution for "real-time."** When asked to "show live order updates," the simplest implementation is `setInterval`. It works without any backend changes. Real-time subscriptions require server support (WebSockets, SSE, Supabase Realtime), which is a separate concern the assistant won't introduce unprompted.

---

## What it costs

| Problem | Impact |
|---|---|
| No client cache | Users see spinners on every page navigation, even for data that's seconds old. Feels slow even on fast networks. |
| Duplicate requests | Wasted bandwidth and server load. Two components requesting the same data = double the API calls. |
| Polling at short intervals | Constant server load that scales linearly with active tabs. 10 open tabs × 20 req/min = 200 req/min from one user. |
| No stale-while-revalidate | Either the user sees a spinner (bad UX) or stale data (bad correctness). No middle ground. |

---

## The fix: TanStack Query

TanStack Query (formerly React Query) is the industry standard for client-side server-state management. It handles caching, deduplication, background refetching, and stale-while-revalidate out of the box.

### Setup

```bash
npm install @tanstack/react-query
```

```tsx
// app/providers.tsx (or _app.tsx)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,      // Data is "fresh" for 60 seconds
      gcTime: 5 * 60_000,     // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true, // Refresh when the user comes back to the tab
      retry: 2,
    },
  },
})

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Replace useEffect + fetch with useQuery

```tsx
// ✅ Cached, deduplicated, background-refreshed
import { useQuery } from '@tanstack/react-query'

export function VendorPage({ vendorId }) {
  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => fetch(`/api/vendors/${vendorId}`).then((r) => r.json()),
  })

  if (isLoading) return <Spinner />
  return <VendorProfile vendor={vendor} />
}
```

Now:
- Navigate away and back within 60 seconds → **no spinner**, data is served from cache instantly.
- Another component calls `useQuery({ queryKey: ['vendor', vendorId] })` → **no duplicate request**, both components share the same cache entry.
- After 60 seconds the data is "stale" → on the next render, TanStack Query shows the cached data immediately and **refetches in the background**. The user never sees a spinner for stale-while-revalidate.

### SWR as an alternative

SWR (from Vercel) follows the same pattern with slightly different syntax:

```tsx
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export function VendorPage({ vendorId }) {
  const { data: vendor, isLoading } = useSWR(
    `/api/vendors/${vendorId}`,
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 60_000 }
  )
  // ...
}
```

Both libraries solve the same problem. TanStack Query has more features (mutations, infinite queries, optimistic updates). SWR is simpler and lighter. Pick one and use it consistently.

---

## The fix: replace polling with real-time subscriptions

If your backend supports real-time channels (Supabase Realtime, Firebase onSnapshot, WebSockets), use them instead of polling.

### Supabase Realtime

```tsx
// ❌ Polling every 3 seconds
useEffect(() => {
  const interval = setInterval(() => refetchOrders(), 3000)
  return () => clearInterval(interval)
}, [])

// ✅ Subscribe to changes — zero polling, instant updates
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useOrderSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Invalidate the cache — TanStack Query will refetch
          queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

This fires exactly one request when the data actually changes, instead of 20 per minute checking if it changed.

### When polling is still the right answer

Polling is fine when:
- The backend does not support real-time channels.
- The data changes frequently enough that a subscription would fire as often as a poll.
- You need simplicity and the polling interval is long (30s+).

TanStack Query supports polling natively:

```tsx
const { data: orders } = useQuery({
  queryKey: ['orders', 'pending'],
  queryFn: fetchPendingOrders,
  refetchInterval: 30_000,  // Poll every 30 seconds, not 3
})
```

This is better than raw `setInterval` because TanStack Query still deduplicates, caches, and pauses polling when the tab is not visible.

---

## Mutation and cache invalidation

When the user creates, updates, or deletes data, invalidate the relevant cache so the UI reflects the change immediately:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newProduct) =>
      fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      }).then((r) => r.json()),

    onSuccess: () => {
      // Invalidate the product list cache — it will refetch
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

---

## Choosing staleTime

| Data type | Suggested staleTime | Why |
|---|---|---|
| User profile, settings | 5–10 minutes | Rarely changes within a session |
| Product listings, vendor info | 1–5 minutes | Changes occasionally, stale data is acceptable briefly |
| Order status, notifications | 0 (always stale) | Use with real-time subscription or short refetchInterval |
| Static content (categories, regions) | 30+ minutes or `Infinity` | Effectively never changes during a session |

---

## Checklist

- [ ] TanStack Query or SWR is installed and wrapping the app with a provider.
- [ ] All data fetching uses `useQuery` (or `useSWR`), not raw `useEffect` + `fetch`.
- [ ] `staleTime` is configured per query based on how often the data changes.
- [ ] Sibling components that need the same data use the same `queryKey` (automatic dedup).
- [ ] Mutations use `useMutation` with `onSuccess` cache invalidation.
- [ ] Polling intervals of <10 seconds are replaced with real-time subscriptions where the backend supports it.
- [ ] Remaining polling uses `refetchInterval` on a `useQuery`, not raw `setInterval`.
- [ ] Polling pauses when the tab is not visible (TanStack Query does this by default).

---

## Prompt for your AI assistant

```text
Audit this codebase for client-side data fetching inefficiencies:

1. Any useEffect + fetch (or axios) pattern that could be replaced with
   useQuery from TanStack Query or useSWR.
2. Any setInterval or setTimeout used for polling that could be replaced
   with a Supabase Realtime subscription or a useQuery refetchInterval.
3. Any two or more components on the same page that independently fetch
   the same data (duplicate requests).
4. Any page navigation that triggers a full refetch for data the user
   just saw on the previous page.

For each finding, give me: the file and line, what it currently does, the
performance impact, and a concrete fix using TanStack Query or Supabase
Realtime. Do not fix anything yet — just report.
```

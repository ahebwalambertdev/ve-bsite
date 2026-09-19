# Pagination and Scale Traps: "Get All Users" Silently Stops at the 1,000th Row

**The mistake in one sentence:** your query returns 1,000 rows, the UI shows "1,000 vendors," and everyone assumes that's the real number — but the table has 4,200 rows and the API silently capped the response. No error, just wrong data driving wrong decisions.

Supabase's PostgREST API has a default maximum of **1,000 rows per query**. Prisma's `findMany` returns everything unless you set `take`. Firebase Firestore caps at 100 documents per batch by default. Every data layer has a cap, and almost none of them throw an error when you hit it. They just return fewer rows than exist and let you assume the result is complete.

---

## What it looks like

### The dashboard that shows the wrong number

```typescript
// ❌ "Get all vendors" — returns at most 1,000, silently
export async function getVendorCount() {
  const { data: vendors } = await supabase.from('vendors').select('*')
  return vendors.length  // Returns 1000 when there are 4,200 vendors
}
```

The dashboard shows "1,000 vendors." The CEO quotes it in a pitch deck. Nobody knows it's wrong until someone manually counts in the database console and gets 4,200.

### The export that's missing half the data

```typescript
// ❌ CSV export of all orders — misses everything after row 1,000
export async function exportAllOrders() {
  const { data: orders } = await supabase.from('orders').select('*')
  return generateCSV(orders)  // Only first 1,000 orders
}
```

Finance downloads the export, reconciles against Stripe, and finds a discrepancy. Hours of investigation before someone realizes the export was silently truncated.

### The batch operation that only processes the first page

```typescript
// ❌ "Notify all vendors" — only notifies the first 1,000
export async function notifyAllVendors(message: string) {
  const { data: vendors } = await supabase.from('vendors').select('id, email')
  for (const vendor of vendors) {
    await sendNotification(vendor.email, message)
  }
  return { notified: vendors.length }
}
```

This returns `{ notified: 1000 }` and reports success. The other 3,200 vendors never hear about the price change, the policy update, or the critical security notice.

### Offset pagination that gets slower as data grows

```typescript
// ❌ Works at page 1, unusable at page 500
export async function getProducts(page: number) {
  const pageSize = 20
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' },
  })
  return products
}
```

Page 1: `skip: 0` — instant. Page 500: `skip: 9,980` — the database scans and discards 9,980 rows to return 20. At scale, this query takes seconds and puts significant load on the database.

## Why AI tools generate this

**"Get all" is the natural first pass.** An assistant asked to "show all vendors" writes `select('*')`. It returns data, the page renders, the test passes. The silent cap is invisible because the test database has 50 rows, not 5,000.

**Default limits are documented but not enforced in code.** Supabase's 1,000-row limit is mentioned in the PostgREST docs but produces no error, no warning, and no header indicating truncation. The response looks identical to one that returned everything.

**Offset pagination is the simple, obvious pattern.** `skip`/`take` maps directly to "page 1, page 2, page 3." Cursor-based pagination requires understanding indexed columns, stable sort keys, and a different API contract. An assistant won't choose the harder pattern unless asked.

---

## What it costs

| Trap | Impact |
|---|---|
| Silent row cap | Wrong counts, incomplete exports, missed notifications. Decisions made on bad data. |
| No pagination on "get all" queries | Works with 50 rows. Times out or silently truncates with 5,000. |
| Offset pagination at scale | Page 500+ takes seconds. Database burns CPU scanning and discarding rows. |
| Unstable sort order | Rows appear on multiple pages or skip pages entirely when the sort column isn't unique. |

---

## The fix: always paginate, always count separately

### Rule 1: Never trust a single "get all" query

If you need the total count, ask for it separately:

```typescript
// ✅ Count without fetching rows
const { count } = await supabase
  .from('vendors')
  .select('*', { count: 'exact', head: true })
// count = 4200 (the real number)
```

If you need all rows (for an export or batch operation), paginate through them:

```typescript
// ✅ Fetch ALL rows by paginating through the full dataset
async function fetchAll<T>(table: string, pageSize = 1000): Promise<T[]> {
  const results: T[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + pageSize - 1)
      .order('id', { ascending: true })  // stable sort key

    if (error) throw error
    if (!data || data.length === 0) break

    results.push(...data)

    if (data.length < pageSize) break  // last page
    from += pageSize
  }

  return results
}
```

### Rule 2: Use cursor-based pagination for user-facing lists

Offset pagination (`skip`/`take`) is fine for small datasets and admin dashboards. For large, growing datasets (product feeds, order logs, activity streams), use cursor-based pagination.

**Prisma:**

```typescript
// ✅ Cursor-based: O(1) regardless of how deep into the dataset
export async function getProducts(cursor?: string) {
  const pageSize = 20

  const products = await prisma.product.findMany({
    take: pageSize + 1,  // fetch one extra to detect "has more"
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,  // skip the cursor item itself
    }),
    orderBy: { id: 'asc' },
  })

  const hasMore = products.length > pageSize
  const items = hasMore ? products.slice(0, -1) : products
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return { items, nextCursor, hasMore }
}
```

**Supabase:**

```typescript
// ✅ Cursor-based with Supabase
export async function getProducts(afterId?: string) {
  const pageSize = 20

  let query = supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })
    .limit(pageSize + 1)

  if (afterId) {
    query = query.gt('id', afterId)
  }

  const { data } = await query

  const hasMore = (data?.length ?? 0) > pageSize
  const items = hasMore ? data!.slice(0, -1) : (data ?? [])
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return { items, nextCursor, hasMore }
}
```

### Rule 3: Always use a stable, unique sort key

Sorting by `created_at` alone is not stable — multiple rows can have the same timestamp, causing rows to appear on two pages or be skipped entirely. Always sort by a unique tiebreaker:

```typescript
// ❌ Unstable: rows with the same created_at can float between pages
orderBy: { createdAt: 'desc' }

// ✅ Stable: created_at + id guarantees unique ordering
orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
```

---

## Platform-specific default limits

Know your platform's caps before they surprise you:

| Platform / Tool | Default row limit | Error on exceed? | Override |
|---|---|---|---|
| **Supabase (PostgREST)** | 1,000 rows | ❌ No — silently truncated | `db-max-rows` in API settings (not recommended; paginate instead) |
| **Firebase Firestore** | 100 documents per batch | ❌ No — returns first 100 | Use `startAfter()` cursor pagination |
| **Prisma `findMany`** | No limit (returns all) | N/A | Always set `take` explicitly |
| **MongoDB `find`** | No limit (returns cursor) | N/A | Always use `.limit()` and `.skip()` or cursor |
| **Stripe API** | 100 objects per list call | ❌ No — returns `has_more: true` | Use `starting_after` cursor |

The safest rule: **never call a list/query endpoint without an explicit limit or pagination strategy, even if the ORM doesn't enforce one.**

---

## The canary test

Run this in production (read-only, non-destructive) to find which tables have hit the cap:

```sql
-- For each table, compare the actual row count with what a default
-- Supabase select would return
SELECT
  schemaname,
  relname AS table_name,
  n_live_tup AS estimated_rows,
  CASE WHEN n_live_tup > 1000 THEN '⚠️ OVER DEFAULT LIMIT' ELSE '✅ OK' END AS status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

Any table with more than 1,000 rows is at risk of silent truncation if any query hits it without pagination.

---

## Checklist

- [ ] No query uses `.select('*')` without either `head: true` (for counts) or `.range()` / `.limit()` (for data).
- [ ] Every "fetch all" operation (exports, batch jobs, notifications) paginates through the full dataset.
- [ ] Dashboard counts use `COUNT(*)` or `{ count: 'exact', head: true }`, not `.length` on a fetched array.
- [ ] User-facing lists with >100 items use cursor-based pagination, not offset.
- [ ] All paginated queries sort by a unique, stable key (e.g., `id` or `created_at + id`).
- [ ] Prisma `findMany` calls always include a `take` parameter.
- [ ] The canary SQL query above shows no tables over the platform's default cap without explicit handling.

---

## Prompt for your AI assistant

```text
Audit this codebase for silent data truncation and pagination issues:

1. Any Supabase .select() without a .range() or .limit() — these will silently
   stop at 1,000 rows.
2. Any .length on a Supabase query result used to display a count — this will
   show 1000 when the real count is higher.
3. Any Prisma findMany() without a take parameter — these return unbounded
   results.
4. Any paginated query using offset (skip) on a table expected to grow beyond
   10,000 rows — flag for cursor migration.
5. Any paginated query that sorts by a non-unique column without a tiebreaker
   (e.g., orderBy createdAt without id).

For each finding, give me: the file and line, the current behavior at 50 rows
vs 5,000 rows, and a concrete fix (add range, add cursor pagination, add
count query, add sort tiebreaker). Do not fix anything yet — just report.
```

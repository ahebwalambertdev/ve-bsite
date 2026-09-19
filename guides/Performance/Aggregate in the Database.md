# Aggregate in the Database

**The bottleneck in one sentence:** count, sum, and group-by in SQL instead of fetching whole tables into JavaScript to do the math.

A dashboard page needs to show "342 products across 28 vendors." An AI assistant fetches every product and every vendor into memory, then runs `.length` on both arrays. It works — until the table has 50,000 rows and the page takes 6 seconds to load because it's downloading and parsing a massive JSON payload just to display two numbers.

---

## What it looks like

### Counting in JavaScript

```typescript
// ❌ Fetches ALL products just to count them
export async function getStats() {
  const { data: products } = await supabase.from('products').select('*')
  const { data: vendors } = await supabase.from('vendors').select('*')
  const { data: orders } = await supabase.from('orders').select('*')

  return {
    totalProducts: products.length,
    totalVendors: vendors.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  }
}
```

This downloads potentially megabytes of data across three tables. All of it gets serialised to JSON, sent over the wire, parsed, iterated, and thrown away — all to produce four numbers.

### Grouping in JavaScript

```typescript
// ❌ Fetches ALL orders to compute per-vendor totals
export async function getVendorStats() {
  const { data: orders } = await supabase.from('orders').select('*')

  const grouped = {}
  for (const order of orders) {
    if (!grouped[order.vendor_id]) {
      grouped[order.vendor_id] = { count: 0, revenue: 0 }
    }
    grouped[order.vendor_id].count++
    grouped[order.vendor_id].revenue += order.total
  }
  return grouped
}
```

### Filtering then counting in JavaScript

```typescript
// ❌ Fetches ALL products, filters in memory, counts
export async function getActiveProductCount() {
  const { data: products } = await supabase.from('products').select('*')
  return products.filter((p) => p.status === 'active').length
}
```

Every one of these is doing work that the database can do in milliseconds, on the server, without sending any row data over the wire.

## Why AI tools generate this

**JavaScript is the assistant's strongest language.** `.length`, `.reduce()`, `.filter()`, `.group()` — these are the tools the model reaches for instinctively. SQL aggregates (`COUNT`, `SUM`, `GROUP BY`) are a different language that requires switching context.

**ORMs abstract SQL away.** Prisma and the Supabase client are designed to feel like JavaScript, not SQL. An assistant using them gravitates toward fetching data and processing it in JS, because that's what the API surface encourages.

**Small datasets mask the problem.** With 50 rows in development, fetching everything takes 20ms. The pattern is indistinguishable from the correct one until the table grows.

---

## What it costs

| Rows | Fetch all + count in JS | COUNT(*) in SQL |
|---|---|---|
| 100 | ~50ms, ~20KB | ~5ms, ~100 bytes |
| 10,000 | ~800ms, ~2MB | ~5ms, ~100 bytes |
| 100,000 | ~6s, ~20MB | ~8ms, ~100 bytes |

The SQL version returns a single number. The JS version returns every row and then throws them away. The gap only grows.

---

## The fix

### Counting: use the database

**Supabase:**

```typescript
// ✅ COUNT in the database — returns a single number, zero row data
const { count } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
```

The `head: true` option tells PostgREST to return only the count, not the rows.

**Prisma:**

```typescript
// ✅ COUNT in the database
const totalProducts = await prisma.product.count()
const activeProducts = await prisma.product.count({
  where: { status: 'active' },
})
```

**Raw SQL:**

```sql
SELECT COUNT(*) FROM products WHERE status = 'active';
```

### Summing: use the database

**Supabase (RPC — call a database function):**

```sql
-- Create a Postgres function
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS numeric AS $$
  SELECT COALESCE(SUM(total), 0) FROM orders;
$$ LANGUAGE sql STABLE;
```

```typescript
// ✅ Call it from the client
const { data: totalRevenue } = await supabase.rpc('get_total_revenue')
```

**Prisma:**

```typescript
// ✅ SUM in the database
const result = await prisma.order.aggregate({
  _sum: { total: true },
})
const totalRevenue = result._sum.total ?? 0
```

**Raw SQL:**

```sql
SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders;
```

### Grouping: use the database

**Supabase (RPC):**

```sql
CREATE OR REPLACE FUNCTION get_vendor_stats()
RETURNS TABLE(vendor_id uuid, order_count bigint, revenue numeric) AS $$
  SELECT vendor_id, COUNT(*), COALESCE(SUM(total), 0)
  FROM orders
  GROUP BY vendor_id;
$$ LANGUAGE sql STABLE;
```

```typescript
// ✅ Returns pre-grouped results, no client-side looping
const { data: vendorStats } = await supabase.rpc('get_vendor_stats')
```

**Prisma:**

```typescript
// ✅ GROUP BY in the database
const vendorStats = await prisma.order.groupBy({
  by: ['vendorId'],
  _count: { id: true },
  _sum: { total: true },
})
```

**Raw SQL:**

```sql
SELECT vendor_id, COUNT(*) AS order_count, SUM(total) AS revenue
FROM orders
GROUP BY vendor_id
ORDER BY revenue DESC;
```

### Filtered aggregates: combine WHERE and COUNT

```typescript
// ❌ Don't do this
const all = await prisma.product.findMany()
const active = all.filter(p => p.status === 'active').length

// ✅ Do this
const active = await prisma.product.count({
  where: { status: 'active' },
})
```

---

## Dashboard stats: the complete pattern

A typical dashboard needs several aggregate numbers. Fetch them all in parallel, each as a database-level aggregate:

```typescript
// ✅ 4 parallel queries, each returns a single number
export async function getDashboardStats() {
  const [productCount, vendorCount, orderCount, revenueResult] =
    await Promise.all([
      prisma.product.count({ where: { status: 'active' } }),
      prisma.vendor.count({ where: { verified: true } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ])

  return {
    totalProducts: productCount,
    totalVendors: vendorCount,
    totalOrders: orderCount,
    totalRevenue: revenueResult._sum.total ?? 0,
  }
}
```

Four fast queries running in parallel, each returning a single value. No row data transferred. Sub-50ms total even with network latency.

---

## When to use a database view or materialized view

If the same aggregate is computed on every page load and the underlying data changes infrequently, consider a Postgres view or materialized view:

```sql
-- Materialized view: precomputed, refresh on schedule
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM products WHERE status = 'active') AS total_products,
  (SELECT COUNT(*) FROM vendors WHERE verified = true) AS total_vendors,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COALESCE(SUM(total), 0) FROM orders) AS total_revenue;

-- Refresh it (e.g., via a cron job every 5 minutes)
REFRESH MATERIALIZED VIEW dashboard_stats;
```

```typescript
// Query the materialized view — instant, zero computation
const { data } = await supabase.from('dashboard_stats').select('*').single()
```

---

## How to find these in your codebase

```bash
# Find .length on fetched data (likely counts done in JS)
grep -rn "\.length" --include="*.ts" --include="*.tsx" | \
  grep -i "data\.\|result\.\|items\.\|rows\."

# Find .reduce() — likely sums/aggregates done in JS
grep -rn "\.reduce(" --include="*.ts" --include="*.tsx"

# Find .filter().length — filtered counts done in JS
grep -rn "\.filter(.*\.length" --include="*.ts" --include="*.tsx"

# Find select('*') without head:true — likely fetching full rows
grep -rn "select('\*')" --include="*.ts" --include="*.tsx" | \
  grep -v "head: true"
```

---

## Checklist

- [ ] Every count displayed in the UI uses `COUNT(*)`, `.count()`, or `select('*', { count: 'exact', head: true })`, not `.length` on a fetched array.
- [ ] Every sum or total uses `SUM()`, `.aggregate()`, or an RPC function, not `.reduce()` on a fetched array.
- [ ] Every grouped statistic uses `GROUP BY`, `.groupBy()`, or an RPC function, not a client-side loop with an accumulator object.
- [ ] No route fetches an entire table with `select('*')` when it only needs aggregate numbers.
- [ ] Dashboard stats are fetched in parallel with `Promise.all()`.
- [ ] High-traffic aggregate queries are backed by a materialized view or cache where appropriate.

---

## Prompt for your AI assistant

```text
Audit this codebase for cases where the application fetches rows from the
database and then computes aggregates in JavaScript. Specifically:

1. Any .length on an array fetched from a database query (should be COUNT).
2. Any .reduce() on fetched rows to compute a sum or total (should be SUM).
3. Any .filter().length on fetched data (should be COUNT with a WHERE).
4. Any manual grouping loop or Object.entries-based grouping on fetched rows
   (should be GROUP BY).

For each finding, give me: the file and line, what it currently does in JS,
and the equivalent database-level query (Prisma, Supabase, or raw SQL).
Do not fix anything yet — just report.
```

# Eliminating N+1 Queries

**The bottleneck in one sentence:** one database round-trip per item in a loop is the single most common performance bug AI tools generate. Batch it.

You ask an AI assistant to "load all vendors and show their products." It writes a query that fetches the vendor list, then loops through and fires a separate query for each vendor's products. 10 vendors = 11 queries. 200 vendors = 201 queries. The page loads in 200ms locally because the database is on localhost, then takes 4 seconds in production because every round-trip crosses a real network.

---

## What it looks like

The pattern shows up in every ORM and every data-fetching library. Here it is in three common stacks:

### Prisma

```typescript
// ❌ N+1: 1 query for vendors + N queries for products
const vendors = await prisma.vendor.findMany()

const vendorsWithProducts = await Promise.all(
  vendors.map(async (vendor) => {
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
    })
    return { ...vendor, products }
  })
)
```

### Supabase client

```typescript
// ❌ N+1: 1 query for vendors + N queries for products
const { data: vendors } = await supabase.from('vendors').select('*')

const vendorsWithProducts = await Promise.all(
  vendors.map(async (vendor) => {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendor.id)
    return { ...vendor, products }
  })
)
```

### Raw SQL in a loop

```typescript
// ❌ N+1: 1 query for vendors + N queries for products
const vendors = await db.query('SELECT * FROM vendors')

for (const vendor of vendors) {
  vendor.products = await db.query(
    'SELECT * FROM products WHERE vendor_id = $1',
    [vendor.id]
  )
}
```

All three do the same thing: fetch a list, then loop through it with a database call per item. The pattern is often hidden inside a `.map()` or `Promise.all()`, which makes it look concurrent but does not reduce the number of database round-trips.

## Why AI tools generate this

**It's the most literal translation of the request.** "Get all vendors, then for each vendor get their products" maps directly to two queries in a loop. The assistant writes exactly what was asked, and it works correctly — it just doesn't scale.

**The N+1 is invisible locally.** On localhost, a database query takes <1ms. 200 of them take <200ms. The developer (and the assistant) never see the problem because the feedback loop is "it works and it's fast." In production, each query takes 5–20ms of network round-trip. 200 × 15ms = 3 seconds of pure waiting.

**ORMs make joins less obvious.** In raw SQL, you'd naturally write a `JOIN`. But ORMs encourage you to think in objects, not joins. An AI assistant using Prisma or Supabase reaches for the ORM's familiar `.findMany()` pattern, not the less-obvious `include` or `.select('*, products(*)')` syntax that produces the same result in fewer round-trips.

---

## What it costs

| Vendors | N+1 queries | Batched queries | Time at 15ms/query |
|---|---|---|---|
| 10 | 11 | 1–2 | 165ms → 30ms |
| 50 | 51 | 1–2 | 765ms → 30ms |
| 200 | 201 | 1–2 | 3,015ms → 30ms |
| 1,000 | 1,001 | 1–2 | 15,015ms → 30ms |

The cost scales linearly with the number of items. A page that's fast with 10 items becomes unusable at 200.

---

## The fix

### Prisma: use `include` or `select` with nested relations

```typescript
// ✅ 1–2 queries total, regardless of how many vendors
const vendorsWithProducts = await prisma.vendor.findMany({
  include: {
    products: true,
  },
})
```

Prisma converts this into an optimized SQL query (typically a `JOIN` or a batched `IN` query) under the hood. One round-trip, all the data.

**Prune the columns too** — don't fetch what you don't render:

```typescript
// ✅ Batched AND lean
const vendorsWithProducts = await prisma.vendor.findMany({
  select: {
    id: true,
    name: true,
    verified: true,
    products: {
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
    },
  },
})
```

### Supabase: use the embedded select syntax

```typescript
// ✅ 1 query with a PostgREST embedded join
const { data: vendorsWithProducts } = await supabase
  .from('vendors')
  .select(`
    id,
    name,
    verified,
    products (
      id,
      name,
      price,
      image_url
    )
  `)
```

PostgREST (which Supabase uses under the hood) turns this into a single query with a lateral join. No loop needed.

### Raw SQL: use a JOIN or an IN clause

```sql
-- ✅ Option A: JOIN (1 query, denormalized result)
SELECT v.id, v.name, p.id AS product_id, p.name AS product_name, p.price
FROM vendors v
LEFT JOIN products p ON p.vendor_id = v.id
ORDER BY v.id;

-- ✅ Option B: IN clause (2 queries, normalized result)
SELECT * FROM vendors;
SELECT * FROM products WHERE vendor_id IN (1, 2, 3, ...);
-- Then group products by vendor_id in application code
```

Option B (two queries with an `IN` clause) is often cleaner in application code because you get two clean result sets instead of one denormalized one.

### GraphQL: use DataLoader

If you're using GraphQL and the N+1 happens in field resolvers, wrap the data access in a DataLoader:

```typescript
import DataLoader from 'dataloader'

const productLoader = new DataLoader(async (vendorIds: string[]) => {
  const products = await prisma.product.findMany({
    where: { vendorId: { in: vendorIds } },
  })
  // Group by vendorId and return in the same order as the input
  return vendorIds.map((id) =>
    products.filter((p) => p.vendorId === id)
  )
})

// In your resolver:
resolve: (vendor) => productLoader.load(vendor.id)
```

DataLoader batches all `.load()` calls within a single tick into one database query.

---

## How to find N+1s in your codebase

### 1. Enable query logging

```typescript
// Prisma: log every query to the console
const prisma = new PrismaClient({
  log: ['query'],
})

// Supabase: no built-in query log, but you can check the
// Supabase Dashboard > Database > Query Performance
```

Load any page that shows a list with related data. If you see the same `SELECT` statement repeated with different `WHERE` values, you have an N+1.

### 2. Search for the pattern in code

```bash
# Find loops that contain database calls (Prisma)
grep -rn "\.map\(async" --include="*.ts" --include="*.tsx" | \
  grep -l "prisma\." 

# Find loops that contain database calls (Supabase)
grep -rn "\.map\(async" --include="*.ts" --include="*.tsx" | \
  grep -l "supabase\."
```

### 3. Check the network in production

If your database is on Supabase, check the **Query Performance** page in the dashboard. Look for queries that execute hundreds of times per page load.

---

## Checklist

- [ ] No `await` inside `.map()`, `for`, or `forEach` that calls the database or an API.
- [ ] Prisma relations use `include` or nested `select`, not separate `findMany` calls.
- [ ] Supabase queries use the embedded `select('*, relation(*)')` syntax for related data.
- [ ] Query logging is enabled in development; repeated identical queries are investigated.
- [ ] Any remaining loops that must call an external service use batching or DataLoader.

---

## Prompt for your AI assistant

```text
Audit this codebase for N+1 query patterns. Specifically look for:
1. Any await inside a .map(), for...of, forEach, or Promise.all that calls
   prisma, supabase, or any database/API client.
2. Any route handler or server component that fetches a list and then loops
   through it to fetch related data for each item.
3. Any GraphQL resolver that calls the database without using DataLoader.

For each finding, give me: the file and line, the current number of queries
it would generate for N items, and a concrete fix using include, embedded
select, JOIN, IN clause, or DataLoader as appropriate. Do not fix anything
yet — just report.
```

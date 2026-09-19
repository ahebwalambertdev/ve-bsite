# Offload Heavy Work

**The bottleneck in one sentence:** background bulk email sends and large-file processing instead of blocking the request handler until it times out.

An AI assistant builds a "send welcome emails to all new vendors" endpoint that loops through 500 vendors, calls the email API for each one, and returns a response when they're all done. On localhost it works in 8 seconds. In production behind a 30-second serverless timeout, it works until the vendor list hits 200. Then it times out, silently drops the remaining emails, and returns a 504 to the user. Nobody knows which emails were sent and which were not.

---

## What it looks like

### Blocking email sends in a request handler

```typescript
// ❌ Blocks the request until ALL emails are sent
export async function POST(req: Request) {
  const vendors = await getNewVendors()

  for (const vendor of vendors) {
    await sendWelcomeEmail(vendor.email, vendor.name)  // ~200ms per email
  }

  return Response.json({ sent: vendors.length })
}
```

200 vendors × 200ms = 40 seconds. The request times out before finishing. The client gets a 504. Some emails were sent, some were not. There's no way to tell which.

### Blocking file processing in a request handler

```typescript
// ❌ Processes a 50MB CSV upload synchronously
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const buffer = await file.arrayBuffer()

  // Parse 100,000 rows, validate each one, insert into database
  const rows = parseCSV(buffer)
  for (const row of rows) {
    await validateAndInsert(row)
  }

  return Response.json({ imported: rows.length })
}
```

The file upload itself might succeed, but parsing and inserting 100,000 rows takes minutes. The request handler was never designed for this. It blocks the server, consumes memory, and eventually times out.

### Blocking image processing in a request handler

```typescript
// ❌ Resizes and converts images before responding
export async function POST(req: Request) {
  const { imageUrl } = await req.json()
  const image = await downloadImage(imageUrl)

  // Generate 4 variants: thumbnail, small, medium, large
  const thumbnail = await sharp(image).resize(150, 150).avif().toBuffer()
  const small = await sharp(image).resize(400, 300).avif().toBuffer()
  const medium = await sharp(image).resize(800, 600).avif().toBuffer()
  const large = await sharp(image).resize(1400, 1050).avif().toBuffer()

  await uploadAll([thumbnail, small, medium, large])

  return Response.json({ success: true })
}
```

Each `sharp()` call is CPU-intensive. Four variants of a large image can take 2–5 seconds. The request handler is blocked the entire time, and if you're on a serverless function, you're paying for every millisecond.

## Why AI tools generate this

**The request-response model is the default mental model.** Request comes in → do work → return response. That's the shape of every handler in training data. Returning a response *before the work is done* requires a different architecture (queues, workers, webhooks) that the assistant won't introduce unprompted.

**"It works" feedback is immediate.** The assistant sends 5 test emails, it takes 1 second, everything looks fine. The 500-email case is never tested.

**Queues and workers are infrastructure decisions.** Setting up BullMQ + Redis, or Inngest, or Trigger.dev requires choosing a service, configuring it, and deploying separately. An AI assistant generates application code, not infrastructure.

**Serverless timeouts are invisible in the code.** Nothing in the code says "this function must finish in 30 seconds." The assistant doesn't know about the deployment environment's limits.

---

## What it costs

| Problem | Impact |
|---|---|
| Request timeout | 504 errors for the user. Partial execution with no way to know what completed. |
| Blocked event loop | While the handler is processing, no other request can be served by that worker/function. |
| Memory spikes | Processing a 50MB file in memory can OOM a 256MB serverless function. |
| No retry logic | If the email API or database throws on item 150 of 500, items 151–500 are never processed. |
| No visibility | Nobody knows whether the job succeeded, failed, or is still running. |

---

## The fix: the queue pattern

The correct architecture is:

1. **The request handler** accepts the job, enqueues it, and returns immediately.
2. **A background worker** processes the job asynchronously, with retries and logging.
3. **The client** polls for status or receives a webhook/subscription when the job completes.

```
User → API Handler → Queue → Worker → Done
       (returns 202)  (async)  (retries)
```

---

## Option 1: Inngest (serverless, zero infrastructure)

Inngest runs inside your existing Next.js app. No Redis, no separate worker process.

```bash
npm install inngest
```

### Define the function

```typescript
// inngest/functions/send-vendor-emails.ts
import { inngest } from '@/inngest/client'

export const sendVendorEmails = inngest.createFunction(
  {
    id: 'send-vendor-welcome-emails',
    retries: 3,
  },
  { event: 'vendor/batch-welcome' },
  async ({ event, step }) => {
    const vendors = await step.run('fetch-vendors', async () => {
      return getNewVendors()
    })

    // Process each vendor as a separate step — if one fails,
    // only that step retries, not the whole batch
    for (const vendor of vendors) {
      await step.run(`email-${vendor.id}`, async () => {
        await sendWelcomeEmail(vendor.email, vendor.name)
      })
    }

    return { sent: vendors.length }
  }
)
```

### Trigger from the API handler

```typescript
// app/api/vendors/send-welcome/route.ts
import { inngest } from '@/inngest/client'

export async function POST() {
  await inngest.send({ name: 'vendor/batch-welcome', data: {} })

  // Return immediately — the work happens in the background
  return Response.json(
    { status: 'queued', message: 'Emails are being sent in the background.' },
    { status: 202 }
  )
}
```

Key benefit: **durable execution.** If the function fails at step 150, it resumes at step 150 on retry, not from the beginning. Each step is independently retryable.

---

## Option 2: BullMQ + Redis (self-hosted, maximum control)

For teams that run their own infrastructure and need full control over concurrency, rate limiting, and prioritisation.

```bash
npm install bullmq ioredis
```

### Producer (API handler)

```typescript
// lib/queues/email-queue.ts
import { Queue } from 'bullmq'
import { redis } from '@/lib/redis'

export const emailQueue = new Queue('email', { connection: redis })

// app/api/vendors/send-welcome/route.ts
export async function POST() {
  const vendors = await getNewVendors()

  // Add one job per vendor — each processes independently
  await emailQueue.addBulk(
    vendors.map((vendor) => ({
      name: 'welcome-email',
      data: { email: vendor.email, name: vendor.name },
    }))
  )

  return Response.json(
    { status: 'queued', jobs: vendors.length },
    { status: 202 }
  )
}
```

### Consumer (separate worker process)

```typescript
// workers/email-worker.ts — runs as a SEPARATE process, not inside Next.js
import { Worker } from 'bullmq'
import { redis } from '@/lib/redis'

const worker = new Worker(
  'email',
  async (job) => {
    const { email, name } = job.data
    await sendWelcomeEmail(email, name)
  },
  {
    connection: redis,
    concurrency: 5,          // Process 5 emails at a time
    limiter: { max: 10, duration: 1000 },  // Rate limit: 10/sec
  }
)

worker.on('completed', (job) => console.log(`✅ ${job.id} done`))
worker.on('failed', (job, err) => console.error(`❌ ${job.id}:`, err))
```

**Critical:** Run the worker as a separate Node.js process or container. Do not run it inside your Next.js server — it will block the event loop and cause scaling issues.

```bash
# Start the worker separately
node workers/email-worker.js
```

---

## Option 3: Supabase Edge Functions + pg_cron (for Supabase projects)

If you're already on Supabase and don't want to add another service:

```sql
-- Schedule a function to run every hour
SELECT cron.schedule(
  'send-pending-welcome-emails',
  '0 * * * *',  -- every hour
  $$
    SELECT net.http_post(
      'https://your-project.supabase.co/functions/v1/send-welcome-emails',
      '{}',
      '{}'::jsonb,
      ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.service_role_key'))]
    );
  $$
);
```

This is simpler but less flexible than Inngest or BullMQ. Good for scheduled batch jobs, less suitable for event-driven or high-throughput workloads.

---

## Large file uploads: use presigned URLs

Never upload large files through your API handler. Upload directly to object storage, then trigger processing.

```typescript
// 1. API handler generates a presigned URL
export async function POST(req: Request) {
  const { filename, contentType } = await req.json()

  const { data, error } = await supabase.storage
    .from('uploads')
    .createSignedUploadUrl(`imports/${Date.now()}-${filename}`)

  return Response.json({ uploadUrl: data.signedUrl })
}

// 2. Client uploads directly to storage (no server involvement)
const res = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
})

// 3. A webhook or database trigger fires AFTER the upload completes,
//    triggering the background processing job
```

The file never touches your API server. No memory pressure, no timeout risk. Processing happens in a background worker after the upload is confirmed.

---

## Status tracking for the client

Return a 202 (Accepted) and give the client a way to check progress:

```typescript
// API handler returns a job ID
return Response.json(
  { status: 'queued', jobId: 'job_abc123' },
  { status: 202 }
)

// Client polls for status (or subscribes via Supabase Realtime)
// GET /api/jobs/job_abc123
// → { status: 'processing', progress: 150, total: 500 }
// → { status: 'completed', result: { sent: 500, failed: 3 } }
```

Or, if you use Supabase Realtime, push status updates to the client without polling:

```typescript
// Write job status to a table
await supabase.from('jobs').update({
  status: 'completed',
  result: { sent: 500, failed: 3 },
}).eq('id', jobId)

// Client subscribes to changes on that row
supabase.channel('job-status')
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'jobs', filter: `id=eq.${jobId}` },
    (payload) => setJobStatus(payload.new)
  )
  .subscribe()
```

---

## Decision guide

| Situation | Recommendation |
|---|---|
| Serverless (Vercel, Netlify), simple workflows | **Inngest** — zero infra, durable steps, works inside Next.js |
| Self-hosted, high throughput, need rate limiting | **BullMQ + Redis** — maximum control, separate worker process |
| Already on Supabase, simple scheduled batches | **pg_cron + Edge Functions** — no extra service |
| Large file uploads | **Presigned URLs** + background worker (any of the above) |

---

## Checklist

- [ ] No API handler processes more than ~10 items in a loop before responding.
- [ ] Bulk operations (email sends, CSV imports, image processing) are enqueued and processed asynchronously.
- [ ] The API handler returns `202 Accepted` with a job ID, not `200 OK` after blocking for 30 seconds.
- [ ] Background workers have retry logic (individual item failures don't abort the whole batch).
- [ ] Large file uploads use presigned URLs (file never passes through the API handler).
- [ ] Job status is trackable by the client (polling endpoint or real-time subscription).
- [ ] Workers run as separate processes, not inside the web server.

---

## Prompt for your AI assistant

```text
Audit this codebase for request handlers that do too much work before
responding. Specifically:

1. Any API route or Server Action that loops through a list and calls an
   external service (email, SMS, payment) for each item.
2. Any handler that processes an uploaded file (CSV, image, PDF) inline
   before returning a response.
3. Any handler that runs a database operation on more than ~50 rows in a
   loop (batch inserts, updates, deletes).
4. Any handler that uses sharp, ffmpeg, or similar CPU-intensive processing
   before responding.

For each finding, give me: the file and line, the estimated time to complete
for a realistic workload (e.g., 500 emails, 50MB file), whether it would
exceed a typical serverless timeout (30s), and a concrete recommendation to
offload it to a background job (Inngest, BullMQ, or pg_cron). Do not fix
anything yet — just report.
```

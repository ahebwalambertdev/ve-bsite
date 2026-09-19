# Rate Limiting and Abuse: Your Endpoints Have No Speed Limit

**The mistake in one sentence:** every public mutating endpoint — login, signup, contact form, password reset, checkout — is wide open to unlimited requests from anyone, because rate limiting was never part of "build this feature."

An AI assistant scaffolds a `/api/auth/login` endpoint that checks credentials and returns a token. It works. Ship it. A week later, someone runs a credential-stuffing script at 10,000 requests per minute, your email provider's API quota is burned through password-reset floods, and the contact form is being used to send spam through your domain.

---

## What it looks like

### An unprotected login endpoint

```typescript
// app/api/auth/login/route.ts — no rate limit
export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await findUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = generateToken(user.id)
  return Response.json({ token })
}
```

This endpoint handles 10 requests per second exactly the same way it handles 10,000. There's no counter, no cooldown, no lockout. Credential stuffing is just a `for` loop away.

### An unprotected form submission

```typescript
// app/api/contact/route.ts — no rate limit
export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  await sendEmail({ to: 'support@ve.co.ug', subject: `Contact: ${name}`, body: message })
  return Response.json({ sent: true })
}
```

Anyone can hit this 1,000 times and send 1,000 emails from your sending domain. Your sender reputation drops, your email provider may suspend the account, and your support inbox is buried.

### In-memory rate limiting that doesn't actually work

```typescript
// ❌ In-memory counter — only works on ONE server instance
const requestCounts = new Map<string, number>()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const count = (requestCounts.get(ip) ?? 0) + 1
  requestCounts.set(ip, count)

  if (count > 10) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ...handle request
}
```

This counter lives in the memory of one serverless function invocation. On Vercel, each invocation is a fresh instance — the `Map` is empty every time. On a multi-instance deployment, each instance has its own counter. The rate limit is per-instance, not per-user, which is the same as no rate limit at all.

## Why AI tools generate this

**Rate limiting is a cross-cutting concern.** It's not part of "build a login endpoint" or "build a contact form." The assistant produces code that correctly handles the business logic and considers the security job done. Rate limiting is infrastructure that wraps the endpoint, and it requires choosing a strategy, a storage backend, and failure semantics — none of which is implied by the feature request.

**In-memory is the easy default.** If an assistant does add rate limiting, it reaches for a `Map` or a local variable because it requires no dependencies. It works in a single-process development server. It fails silently in production.

**"Fail open" vs "fail closed" is a design decision.** When the rate limiter's backing store (Redis) is down, should you allow all requests (fail open) or block all requests (fail closed)? The answer depends on the endpoint. An assistant can't make this decision without context.

---

## What it costs

| Unprotected endpoint | Abuse scenario |
|---|---|
| `/api/auth/login` | Credential stuffing: automated login attempts with leaked email/password lists. Account takeover. |
| `/api/auth/signup` | Bot signups: fake accounts that poison your metrics and may be used for fraud. |
| `/api/auth/reset-password` | Email flooding: burn your email quota and harass users with reset emails. |
| `/api/contact` | Spam relay: use your domain to send spam. Sender reputation destroyed. |
| `/api/orders` | Order bombing: fake orders that consume inventory or payment processing resources. |
| `/api/upload` | Storage abuse: fill your storage bucket with junk. |
| Any public POST/PUT/DELETE | General abuse: DoS by exhausting server resources or downstream API quotas. |

---

## The fix: Upstash Rate Limit (serverless)

Upstash provides a Redis-based rate limiter designed for serverless and edge environments. State is shared across all function instances and regions.

### Install

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Create the limiter

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Sliding window: 10 requests per 60 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),  // reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 've-app',
})
```

### Apply to an endpoint (fail closed)

```typescript
// app/api/auth/login/route.ts
import { ratelimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return Response.json(
        { error: 'Too many requests. Try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    }
  } catch (error) {
    // Fail CLOSED: if Redis is down, block the request.
    // For a login endpoint, this is safer than allowing unlimited attempts.
    console.error('Rate limit check failed:', error)
    return Response.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 }
    )
  }

  // ...business logic
}
```

### Apply via Edge Middleware (protect all routes at once)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '60 s'),
  prefix: 've-global',
})

// Only rate-limit mutating API routes
export const config = {
  matcher: '/api/:path*',
}

export async function middleware(req: NextRequest) {
  if (req.method === 'GET') return NextResponse.next()  // don't limit reads

  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown'

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    }
  } catch {
    // Fail open for global middleware (blocking all API routes is too aggressive)
    // Per-endpoint limiters should fail closed for sensitive routes
    console.error('Global rate limit check failed')
  }

  return NextResponse.next()
}
```

---

## Choosing limits per endpoint

Not every endpoint needs the same limit. Sensitive endpoints need tight limits; general browsing needs looser ones.

| Endpoint type | Suggested limit | Fail mode | Identifier |
|---|---|---|---|
| Login / password reset | 5 per minute | **Closed** (block on Redis failure) | IP address |
| Signup | 3 per 10 minutes | **Closed** | IP address |
| Contact / feedback form | 3 per 5 minutes | **Closed** | IP address |
| Checkout / order creation | 5 per minute | **Closed** | User ID + IP |
| General API (read) | 60 per minute | **Open** (allow on Redis failure) | IP or user ID |
| File upload | 5 per 10 minutes | **Closed** | User ID |
| Webhook receiver | 100 per minute | **Open** | Source IP |

### Multiple limiters

```typescript
// Tighter limit for auth, looser for general API
export const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  prefix: 've-auth',
})

export const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '60 s'),
  prefix: 've-api',
})
```

---

## Fail open vs fail closed

This is a design decision, not a default. Get it right per endpoint.

| Fail mode | When the Redis check itself fails, the request is… | Use when… |
|---|---|---|
| **Fail open** | Allowed through | The endpoint is low-risk and blocking all traffic is worse than allowing abuse (general reads, public content) |
| **Fail closed** | Blocked with 503 | The endpoint handles money, credentials, or sends emails — abuse during a Redis outage is worse than temporary downtime |

The Upstash SDK defaults to fail-open. Wrap the `.limit()` call in a try/catch and decide explicitly for each endpoint. Do not let the default decide for you.

---

## Beyond rate limiting: abuse prevention layers

Rate limiting is the foundation, not the whole defence. Layer these on top for sensitive endpoints:

| Layer | What it does | When to add |
|---|---|---|
| **CAPTCHA** (Turnstile, reCAPTCHA v3) | Blocks automated form submissions. | Signup, contact form, password reset. |
| **Account lockout** | Lock the account after N failed login attempts. | Login endpoint. |
| **IP reputation** (Cloudflare WAF, Vercel Firewall) | Block known-bad IPs at the edge before they reach your app. | All public endpoints. |
| **Honeypot fields** | Hidden form fields that only bots fill in. Zero UX cost. | Any public form. |
| **Request signing** | Verify that the request came from your own frontend, not a script. | Sensitive mutations. |

---

## How to check your own app

```bash
# 1. Find all POST/PUT/DELETE API routes
grep -rn "export async function POST\|export async function PUT\|export async function DELETE" \
  --include="*.ts" --include="*.tsx" app/api/

# 2. Check which ones have rate limiting
grep -rn "ratelimit\|Ratelimit\|rate.limit\|rateLimiter" \
  --include="*.ts" --include="*.tsx" app/api/

# 3. Any route in list 1 but not in list 2 is unprotected
```

---

## Checklist

- [ ] Every public POST/PUT/DELETE endpoint has a rate limiter.
- [ ] Rate limiter state is stored in a shared store (Redis/Upstash), not in-memory.
- [ ] Auth endpoints (login, signup, password reset) use tight limits (3–5/min) and fail closed.
- [ ] Non-critical endpoints use looser limits and may fail open.
- [ ] 429 responses include `Retry-After` and `X-RateLimit-*` headers.
- [ ] Sensitive forms (signup, contact) have an additional bot-prevention layer (CAPTCHA or honeypot).
- [ ] The identifier is appropriate: IP for anonymous, user ID for authenticated.

---

## Prompt for your AI assistant

```text
Audit this codebase for unprotected public endpoints. Specifically:

1. List every POST, PUT, and DELETE API route.
2. For each one, check whether a rate limiter is applied (Upstash, Redis,
   or any other mechanism).
3. For any route that has no rate limiting, assess the abuse risk
   (credential stuffing, email flooding, order bombing, etc.).
4. For any route that uses in-memory rate limiting (a Map, a variable,
   or any non-shared store), flag it as broken in production.

For each finding, give me: the file and line, the HTTP method, the abuse
risk, a recommended limit (requests per window), and whether it should fail
open or closed. Do not fix anything yet — just report.
```

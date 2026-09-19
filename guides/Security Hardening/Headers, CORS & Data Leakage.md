# Headers, CORS, and Data Leakage: The Sieve You Don't Know You Have

**The mistake in one sentence:** wildcard CORS, a permissive CSP, raw error messages in responses, and PII in logs — no one alone is fatal; together they're a sieve.

These are the "boring" security issues. They don't make dramatic exploits. They make quiet, ongoing leaks: a competitor reads your API from their domain because CORS allows anyone, a user's email shows up in Sentry because nobody redacted it, a stack trace in a 500 response tells an attacker exactly which ORM and database version you run. Each one is a small hole. Together they compound into a porous application.

---

## Problem 1: Wildcard CORS

### What it looks like

```typescript
// ❌ Allows any website in the world to call your API
export async function GET(req: Request) {
  return Response.json({ data: 'sensitive' }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
```

Or in Next.js middleware:

```typescript
// ❌ Global wildcard — every API route is open to every origin
res.headers.set('Access-Control-Allow-Origin', '*')
```

`Access-Control-Allow-Origin: *` tells the browser: "any website can make requests to this endpoint and read the response." If the endpoint returns user data, order history, or anything behind authentication, any malicious site can fetch it on behalf of a logged-in user.

### Why AI tools generate this

The assistant is asked to "fix the CORS error." The fastest fix is `*`. It works, the error goes away, and the feature ships. Origin whitelisting requires knowing which domains should be allowed — context the assistant doesn't have.

### The fix

```typescript
// lib/cors.ts
const ALLOWED_ORIGINS = new Set([
  'https://www.ve.co.ug',
  'https://ve.co.ug',
  'https://admin.ve.co.ug',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
])

export function getCorsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('origin') ?? ''

  if (!ALLOWED_ORIGINS.has(origin)) {
    return {}  // No CORS headers = browser blocks the request
  }

  return {
    'Access-Control-Allow-Origin': origin,  // echo the allowed origin, not *
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}
```

```typescript
// app/api/[...route]/route.ts or middleware.ts
import { getCorsHeaders } from '@/lib/cors'

export async function GET(req: Request) {
  const data = await fetchSensitiveData()
  return Response.json(data, { headers: getCorsHeaders(req) })
}

// Handle preflight
export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(req) })
}
```

**Rules:**
- Never use `*` on endpoints that handle authentication or return user-specific data.
- `*` is acceptable for truly public, anonymous endpoints (e.g., a public product catalog API with no auth).
- When using `Access-Control-Allow-Credentials: true`, you **cannot** use `*` as the origin — browsers reject it. You must echo the specific allowed origin.

---

## Problem 2: Missing or permissive Content Security Policy

### What it looks like

```html
<!-- No CSP at all — the browser allows anything -->
<head>
  <title>Ve Marketplace</title>
  <!-- No Content-Security-Policy meta tag or header -->
</head>
```

Or a CSP that allows everything:

```
Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval'
```

This is the same as no CSP. It allows inline scripts, `eval()`, and resources from any origin. An XSS vulnerability becomes trivially exploitable because the browser has no restrictions on what code can run.

### Why AI tools generate this

CSP is fiddly. A strict CSP breaks inline styles, third-party scripts (analytics, chat widgets), and CDN-loaded fonts. The assistant either doesn't add one, or adds a permissive one to avoid breaking things. Getting CSP right requires knowing every external resource your app loads.

### The fix: a practical starter CSP

```typescript
// middleware.ts or next.config.js headers
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-{{NONCE}}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://cdn.ve.co.ug https://*.supabase.co data:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://api.ve.co.ug;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\n/g, ' ').trim()
```

**Next.js implementation:**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self';
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://cdn.ve.co.ug data:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.supabase.co;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\n/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}
```

**Start with `Content-Security-Policy-Report-Only`** to see what would break without actually blocking anything:

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /api/csp-report
```

Monitor the reports, fix violations, then switch to enforcing mode.

---

## Problem 3: Raw error messages in responses

### What it looks like

```typescript
// ❌ Sends the full error to the client
export async function POST(req: Request) {
  try {
    const result = await prisma.order.create({ data: req.body })
    return Response.json(result)
  } catch (error) {
    return Response.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
```

The client receives:

```json
{
  "error": "Invalid `prisma.order.create()` invocation: Unique constraint failed on the fields: (`stripe_payment_id`)",
  "stack": "PrismaClientKnownRequestError: ...\n    at /app/node_modules/@prisma/client/..."
}
```

This tells an attacker: you use Prisma, you have a `stripe_payment_id` column with a unique constraint, and the exact internal path of your app. That's free reconnaissance.

### The fix

```typescript
// ✅ Generic message to client, detailed log to server
export async function POST(req: Request) {
  try {
    const result = await prisma.order.create({ data: req.body })
    return Response.json(result)
  } catch (error) {
    // Log the full error server-side (for debugging)
    console.error('Order creation failed:', error)

    // Return a generic message to the client
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

For known, user-actionable errors, return a helpful but non-revealing message:

```typescript
import { Prisma } from '@prisma/client'

catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint — but don't say which column
      return Response.json(
        { error: 'This order has already been processed.' },
        { status: 409 }
      )
    }
  }

  console.error('Order creation failed:', error)
  return Response.json(
    { error: 'Something went wrong. Please try again.' },
    { status: 500 }
  )
}
```

**Rules:**
- Never send `error.message`, `error.stack`, or raw database errors to the client.
- Always log the full error server-side (console, Sentry, etc.).
- Map known error codes to user-friendly messages without revealing internals.

---

## Problem 4: PII in logs and error tracking

### What it looks like

```typescript
// ❌ Logs the full user object, including email, phone, address
console.log('User signed up:', user)
// Output: { id: 'abc', email: 'amina@gmail.com', phone: '+256701234567', ... }

// ❌ Sentry captures the full request body, including passwords
Sentry.captureException(error, {
  extra: { requestBody: req.body },
  // req.body contains { email, password, address }
})
```

Your logs now contain PII. If the logging service is breached, or if a developer with log access leaves the company, you've exposed user data. In many jurisdictions, this is a regulatory violation.

### The fix: redact before logging

```typescript
// lib/sanitize.ts
const SENSITIVE_KEYS = new Set([
  'password', 'passwordHash', 'token', 'secret',
  'email', 'phone', 'address', 'idNumber',
  'creditCard', 'cvv', 'ssn',
])

export function sanitize(obj: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value)
    } else {
      clean[key] = value
    }
  }
  return clean
}
```

```typescript
// Usage
console.log('User signed up:', sanitize(user))
// Output: { id: 'abc', email: '[REDACTED]', phone: '[REDACTED]', ... }

// Sentry: redact before sending
Sentry.captureException(error, {
  extra: { requestBody: sanitize(req.body) },
})
```

**Sentry-specific:** Configure `beforeSend` to strip PII globally:

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    // Strip user PII from all events
    if (event.user) {
      delete event.user.email
      delete event.user.ip_address
    }
    return event
  },
})
```

---

## Problem 5: Missing security headers

Beyond CSP, several headers should be present on every response:

| Header | Value | What it prevents |
|---|---|---|
| `X-Frame-Options` | `DENY` | Clickjacking: embedding your site in a malicious iframe |
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing: browser interpreting a file as a different type |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leaking full URLs (including query params with tokens) in the Referer header |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Prevents embedded content from accessing device APIs |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Forces HTTPS for 2 years, including subdomains |

---

## How to check your own app

```bash
# 1. Check security headers on your production site
curl -I https://www.ve.co.ug | grep -iE "content-security|x-frame|x-content-type|referrer|permissions|strict-transport|access-control"

# 2. Use a scanner
npx is-website-vulnerable https://www.ve.co.ug

# 3. Check for raw error messages
curl -s -X POST https://www.ve.co.ug/api/some-endpoint \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}' | python3 -m json.tool
# If the response contains stack traces, ORM names, or SQL, it's leaking

# 4. Check CORS on an API endpoint
curl -I -H "Origin: https://evil.com" https://www.ve.co.ug/api/products
# If Access-Control-Allow-Origin is * or echoes evil.com, it's too permissive

# 5. Search your codebase for raw error forwarding
grep -rn "error\.message\|error\.stack\|err\.message" --include="*.ts" --include="*.tsx" | \
  grep -i "response\|json\|res\."

# 6. Search for console.log that might include PII
grep -rn "console\.log.*user\|console\.log.*email\|console\.log.*password" \
  --include="*.ts" --include="*.tsx"
```

---

## Checklist

- [ ] No endpoint uses `Access-Control-Allow-Origin: *` unless it's a truly public, anonymous API.
- [ ] CORS uses an explicit allowlist of origins, with the allowed origin echoed (not `*`).
- [ ] A Content Security Policy header is present in production (at least `default-src 'self'`).
- [ ] `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` are set.
- [ ] `Strict-Transport-Security` is set for HTTPS enforcement.
- [ ] No API endpoint returns `error.message`, `error.stack`, or raw database error strings to the client.
- [ ] 500 responses use a generic "Something went wrong" message; details are logged server-side only.
- [ ] No `console.log`, `console.error`, or error-tracking call includes raw PII (email, phone, password, address).
- [ ] Sentry (or equivalent) has a `beforeSend` hook that strips user PII.
- [ ] Passwords and tokens are never logged, even in debug mode.

---

## Prompt for your AI assistant

```text
Audit this codebase for header, CORS, error leakage, and PII issues:

1. Find every place where Access-Control-Allow-Origin is set. Flag any use
   of '*' on an endpoint that handles auth or returns user-specific data.
2. Check whether a Content-Security-Policy header is configured. If yes,
   check whether it uses 'unsafe-inline' or 'unsafe-eval' in script-src.
3. Find every catch block that forwards error.message, error.stack, or raw
   database error objects to the client in a Response or res.json().
4. Find every console.log, console.error, or Sentry call that includes user
   objects, email addresses, passwords, phone numbers, or other PII.
5. Check next.config.js (or equivalent) for the presence of security headers:
   X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy, Strict-Transport-Security.

For each finding, give me: the file and line, the current behavior, the
security risk, and a concrete fix. Do not fix anything yet — just report.
```

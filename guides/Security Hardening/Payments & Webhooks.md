# Payments and Webhooks: Money Bugs Hide in the Retry Path

**The mistake in one sentence:** payment code is written and tested for the single, successful, non-concurrent request — and webhooks, refunds, and duplicate deliveries all happen outside that path, so that's exactly where the bugs live.

---

## What it looks like

**Idempotency without a database constraint.** An AI assistant asked to "grant credits when a purchase completes, but don't grant twice for the same purchase" will typically write exactly that logic, in application code, as a check-then-insert:

```typescript
// Looks idempotent. Isn't, under concurrency.
async function grantCredits(paymentId: string, userId: string, amount: number) {
  const existing = await db.creditTransactions.findFirst({
    where: { relatedPaymentId: paymentId },
  });
  if (existing) return; // "already granted, skip"

  await db.creditTransactions.create({
    data: { userId, relatedPaymentId: paymentId, amount },
  });
}
```

This is correct for sequential calls. It is **not** correct for concurrent ones. If the same payment confirmation arrives twice in close succession — a retried webhook, a double-tap on a mobile purchase flow, a client that fires the confirmation call twice — both requests can run the `findFirst` check before either one's `create` has committed. Both see "no existing row," both insert, and the user is granted credits twice for one purchase. Nothing in the database schema prevents it, because there's no `UNIQUE` constraint backing the check — the "idempotency" is purely a race-prone application-level guess.

**Errors mistaken for "not applicable."** A webhook handler often needs to look something up (a product, a price) before deciding what to do with an event. If that lookup's error handling collapses "this isn't our product" and "the lookup API call failed" into the same `null`/skip outcome, a transient network blip on a paid event gets **silently treated as success**:

```typescript
// A timeout here looks identical to "not one of ours" — both return null
async function getProductIdFromSession(session: Stripe.Checkout.Session) {
  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id);
    return items.data[0]?.price?.product ?? null;
  } catch {
    return null; // WRONG: a timeout/429 looks exactly like "not our product"
  }
}

// Caller treats null as "ignore this event" and marks it processed —
// so a real paid event with a transient API hiccup never gets retried.
if (!productId) {
  await logWebhookEvent(event.id, 'success'); // credits/access never granted
  return;
}
```

**No refund/chargeback handling at all.** Nearly every payment integration correctly handles "money comes in, grant access." Far fewer handle the reverse: a refund or chargeback arrives, and the credits/access/entitlement that were granted just... stay granted, because nobody wrote the clawback path — it wasn't part of "add checkout."

## Why AI tools generate this

Payment code has an asymmetry that maps badly onto how AI coding tools work: the **happy path is a single request, easy to describe, and easy to test** ("call checkout, get a webhook, grant the credits"). The failure and adversarial paths — concurrent duplicate deliveries, transient upstream errors, refunds, disputes, retried webhooks — are **each a separate scenario that has to be specifically prompted for**, and none of them show up when you manually click through a checkout once in a test environment. An assistant given "implement Stripe checkout" will produce something that correctly handles the one request it was shown; it won't spontaneously reason about "what happens if this exact webhook is delivered twice within 50ms of each other," because that's not implied by the feature description, and simulating it isn't part of a quick manual test either.

Idempotency in particular is a well-known trap even for experienced engineers: a check-then-insert *looks* like it prevents duplicates, and it does, right up until concurrency is introduced — and concurrency is precisely the condition webhooks are designed to produce (most payment providers explicitly warn that webhooks can be delivered more than once, and recommend a database-level unique constraint for exactly this reason).

## Why it's dangerous

- **Duplicated grants are a direct, exploitable revenue loss.** Once someone notices that firing a request twice yields double the credits/entitlement, it's trivially scriptable and repeatable — real money out, indefinitely, until caught.
- **Silently dropped paid events mean customers paid and got nothing.** Worse, because the event gets marked "processed," most systems' built-in retry/redelivery mechanism never gets a second chance to fix it — the bug is permanent for that transaction unless someone manually reconciles.
- **No refund clawback means refunds and chargebacks are pure loss** — the customer gets their money back *and* keeps what they paid for, with zero visibility unless you're specifically watching for it.
- **These bugs are invisible in normal development and QA** because manual testing is inherently sequential and non-adversarial — you don't naturally fire the same webhook twice or simulate a timeout mid-lookup.

## How to check your own app

```bash
# 1. Find every "idempotency" check that's implemented as a SELECT before an
#    INSERT — this is the racy pattern
grep -rn "findFirst\|findOne\|\.select(" --include="*.ts" server/ api/ | grep -i "existing\|already\|duplicate"
# For each hit, check the underlying table's schema — is there a UNIQUE
# constraint that would make a duplicate INSERT fail, independent of the
# application-level check?

# 2. Check your migrations/schema for UNIQUE constraints on the columns that
#    should be unique per real-world event (payment ID, webhook event ID)
grep -rn "UNIQUE\|unique:" --include="*.sql" --include="*.prisma" .
grep -rn "relatedPaymentId\|payment_id\|stripe_event_id\|event_id" --include="*.sql" .

# 3. Find webhook handlers and check whether their catch blocks distinguish
#    "not applicable" from "the lookup failed" — a bare `catch { return null }`
#    that gets treated as "skip" is the bug
grep -rn "catch" -A 3 --include="*.ts" server/src/routes/*webhook* server/src/config/*catalogue*

# 4. Check whether you handle refund/dispute events at all
grep -rln "refund\|chargeback\|dispute" --include="*.ts" server/src/
# If your webhook handler's switch/if-chain has cases for
# checkout.session.completed but nothing for charge.refunded or
# charge.dispute.created (or your platform's equivalent), you have no
# clawback path.
```

## The fix

**Make idempotency a database guarantee, not an application-level guess.** A `UNIQUE` constraint (or a partial unique index, if the column is reused for non-unique purposes elsewhere) turns a race condition into a clean, catchable error:

```sql
-- Partial unique index — scoped to the reasons where the payment ID really
-- must be unique, since the same column might be reused for other things
-- (e.g. non-unique audit strings from manual admin adjustments)
CREATE UNIQUE INDEX credit_transaction_payment_unique
ON credit_transactions ("relatedPaymentId")
WHERE reason IN ('purchase', 'subscription_grant');
```

```typescript
// Catch the constraint violation instead of racing a check-then-insert
async function grantCredits(paymentId: string, userId: string, amount: number) {
  try {
    await db.creditTransactions.create({
      data: { userId, relatedPaymentId: paymentId, amount, reason: 'purchase' },
    });
  } catch (e) {
    if (isUniqueConstraintError(e)) {
      // Already granted — this is the expected, safe outcome of a duplicate
      // delivery, not an error.
      return await getExistingGrant(paymentId);
    }
    throw e;
  }
}
```

**Distinguish "not applicable" from "the lookup failed."** Let unexpected errors propagate so the caller can retry, instead of swallowing them into a false "skip":

```typescript
async function getProductIdFromSession(session: Stripe.Checkout.Session) {
  const items = await stripe.checkout.sessions.listLineItems(session.id);
  // No try/catch here — let a genuine API failure bubble up and cause
  // the webhook handler to return a 5xx, so the provider retries delivery.
  return items.data[0]?.price?.product ?? null;
}
```

**Verify webhook signatures, and do it on the raw body** — this one is usually done correctly by AI tools because it's explicitly documented by every payment provider, but it's worth confirming:

```typescript
// Signature verification MUST run on the raw, unparsed request body
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature']!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed`);
  }
  // ... handle event
});
```

**Mobile Money (MTN MoMo, Airtel Money, DPO Pay) Callbacks** — in East Africa, mobile money gateways (MTN MoMo Open API, Airtel Money, DPO Group) frequently redeliver callbacks when cellular packet delivery acknowledges slowly:

```typescript
// Dedicated Mobile Money callback endpoint (MTN MoMo / Airtel / DPO)
app.post('/api/webhooks/momo', express.json(), async (req, res) => {
  // 1. Authenticate callback via gateway signature, HMAC token, or telco IP whitelist
  if (!verifyMomoSignature(req)) {
    return res.status(401).json({ error: 'Unauthorized callback' });
  }

  const { financialTransactionId, externalId, status, amount, currency } = req.body;
  // financialTransactionId: Issued by MTN/Airtel
  // externalId: Ve's internal order or payment reference passed during collection request

  // 2. Validate expected currency (e.g., UGX)
  if (currency !== 'UGX') {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  // 3. Process via database UNIQUE constraint on financialTransactionId
  if (status === 'SUCCESSFUL') {
    try {
      await processMoMoSuccess({
        internalId: externalId,
        gatewayRef: financialTransactionId,
        amount,
      });
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        // Safe duplicate delivery from telco retry: acknowledge 200 OK
        return res.status(200).json({ status: 'ALREADY_PROCESSED' });
      }
      throw err; // Transient failure: let gateway retry
    }
  }

  return res.status(200).json({ status: 'RECEIVED' });
});
```

**Add the refund/chargeback path explicitly**, even if the first version just alerts a human rather than auto-clawing back:

```typescript
switch (event.type) {
  case 'checkout.session.completed':
    await grantCredits(/* ... */);
    break;
  case 'refund.created':
  case 'charge.dispute.created':
    // At minimum: alert a human with enough context to manually claw back.
    // Better: automatically debit min(currentBalance, originallyGranted).
    await alertAdminOfRefund(event);
    break;
}
```

**Always resolve the buyer by the identifier you set yourself** (a `userId` or `orderId` in metadata / `externalId` you attached at checkout creation), not by a secondary lookup like phone or email — numbers switch between SIMs, emails change, and a secondary lookup failure can drop paid webhooks.

## Checklist

- [ ] Every "grant once per payment" flow is backed by a database `UNIQUE` (or partial unique) constraint, not just an application-level check-then-insert.
- [ ] Constraint violations are caught and treated as "already processed, return the existing result" — not as a hard failure.
- [ ] Webhook handlers verify the provider's signature on the raw request body.
- [ ] Any error inside a webhook handler that isn't explicitly "this event doesn't apply to us" is re-thrown/propagated so the provider's retry mechanism gets a chance to redeliver — it's never silently logged as success.
- [ ] There's an explicit handler for refund and dispute/chargeback events, even if it's alert-only to start.
- [ ] Buyer/user resolution in webhook handlers uses an ID you set yourself at checkout time (metadata), with any secondary lookup (email) as a fallback only.
- [ ] You've fired the same webhook payload twice in quick succession in a test environment and confirmed no double-grant occurs.
- [ ] Checkout session creation passes an idempotency key where the provider supports one.

## Prompt your AI assistant

```
Audit this repository's payment and webhook handling for the following
classes of bug, common in AI-assisted payment integrations:

1. Idempotency implemented as an application-level check-then-insert (e.g.
   "look up whether this payment ID already has a record, insert if not")
   with NO backing database UNIQUE constraint. This is a race condition: two
   concurrent/duplicate webhook deliveries or retried requests can both pass
   the check before either insert commits, causing a double-grant (credits,
   access, entitlements). Find every such pattern and check the schema for a
   matching unique/partial-unique index. Flag any that's missing one.

2. Webhook or payment-lookup error handling that collapses "this event/
   product doesn't apply to us" and "the lookup API call failed" into the
   same silent-skip / null-return path. This causes real paid events to be
   marked processed with no clawback attempted after a transient error.
   Flag any catch block that swallows an error and returns a value
   indistinguishable from a legitimate "not applicable" result.

3. Missing handling for refund, chargeback, or dispute events — check
   whether the webhook handler has any case for these event types at all.
   If credits/access/entitlements are granted on purchase but never revoked
   on refund, flag it.

4. Buyer/user resolution inside webhook handlers that relies on a secondary
   lookup (e.g. matching by email) instead of an identifier set at checkout
   creation time (e.g. a userId passed in metadata/client_reference_id).
   Flag if the secondary lookup is used as primary rather than fallback.

5. Confirm webhook signature verification happens on the raw, unparsed
   request body, not a body that's already been through a JSON-parsing
   middleware.

For each finding: file/line, the concrete failure scenario, and a fix
(migration + code) following this project's existing schema conventions.
Do not apply fixes yet — just report.
```

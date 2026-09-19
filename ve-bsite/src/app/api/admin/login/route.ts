import { NextRequest, NextResponse } from 'next/server';
import { signAdminSession, ADMIN_COOKIE_NAME, DEFAULT_SESSION_MAX_AGE } from '@/lib/admin/auth';
import { getClientIp, checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } from '@/lib/admin/rate-limiter';

/**
 * Constant-time string comparison using SHA-256 digests
 * Prevents side-channel timing analysis on passcode matching
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const hashA = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(a)));
  const hashB = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(b)));

  if (hashA.length !== hashB.length) return false;
  let diff = 0;
  for (let i = 0; i < hashA.length; i++) {
    diff |= hashA[i] ^ hashB[i];
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);

    // 1. Check Rate Limit
    const rateLimit = checkLoginRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 900),
          },
        }
      );
    }

    const body = await req.json();
    const { passcode } = body;

    const validPasscode = process.env.ADMIN_PASSCODE || 've-admin-2026';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 've-kampala-admin-secret-session-salt-2026';

    const isValid =
      typeof passcode === 'string' &&
      (await timingSafeEqual(passcode.trim(), validPasscode.trim()));

    if (!isValid) {
      // Record failed attempt and compute remaining tries
      recordFailedLogin(clientIp);
      const updatedLimit = checkLoginRateLimit(clientIp);

      // Artificial jitter delay (150ms) to defeat rapid automated guessing
      await new Promise((resolve) => setTimeout(resolve, 150));

      return NextResponse.json(
        {
          success: false,
          error: updatedLimit.allowed
            ? `Incorrect admin passcode. ${updatedLimit.remainingAttempts} attempt(s) remaining before temporary lockout.`
            : 'Incorrect admin passcode. Maximum attempts reached. Account locked for 15 minutes.',
        },
        { status: 401 }
      );
    }

    // 2. Success: Reset rate limit counter for this IP
    resetLoginRateLimit(clientIp);

    // 3. Generate signed token
    const token = await signAdminSession(sessionSecret);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: DEFAULT_SESSION_MAX_AGE,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

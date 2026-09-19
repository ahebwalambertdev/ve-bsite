/**
 * In-Memory Sliding-Window Rate Limiter for Admin Authentication
 * Protects /api/admin/login against brute-force passcode dictionary attacks.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// Periodic garbage collection for expired IP records to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of loginAttempts.entries()) {
      if (now > record.resetAt) {
        loginAttempts.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL_MS).unref?.();
}

/**
 * Extracts client IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || '127.0.0.1';
}

/**
 * Checks whether an IP has exceeded the allowed login attempt threshold
 */
export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - record.count,
  };
}

/**
 * Records a failed login attempt for an IP
 */
export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
}

/**
 * Clears failed login attempts for an IP upon successful authentication
 */
export function resetLoginRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

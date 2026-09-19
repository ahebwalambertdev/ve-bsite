/**
 * Edge-compatible Web Crypto Authentication Utilities for Ve Admin Studio
 * Works seamlessly in Next.js Edge Middleware and Node.js Server Runtimes.
 */

export const ADMIN_COOKIE_NAME = 've_admin_session';
export const DEFAULT_SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

interface SessionPayload {
  role: 'admin';
  exp: number; // Unix epoch ms
  iat: number;
}

function base64UrlEncode(buffer: Uint8Array | string): string {
  let base64: string;
  if (typeof buffer === 'string') {
    base64 = btoa(unescape(encodeURIComponent(buffer)));
  } else {
    let binary = '';
    for (let i = 0; i < buffer.byteLength; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    base64 = btoa(binary);
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed JWT-style token for the admin session
 */
export async function signAdminSession(secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: SessionPayload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + DEFAULT_SESSION_MAX_AGE * 1000,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await getHmacKey(secret);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${dataToSign}.${signatureB64}`;
}

/**
 * Verifies the admin session token
 */
export async function verifyAdminSession(token: string | undefined | null, secret: string): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;
  const dataToVerify = `${headerB64}.${payloadB64}`;

  try {
    const key = await getHmacKey(secret);
    const enc = new TextEncoder();

    // Decode signature
    let sigBase64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';
    const binarySig = atob(sigBase64);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(dataToVerify));
    if (!isValid) return false;

    // Check expiration
    const payloadJson = base64UrlDecode(payloadB64);
    const payload: SessionPayload = JSON.parse(payloadJson);
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return payload.role === 'admin';
  } catch {
    return false;
  }
}

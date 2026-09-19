/**
 * Strict Origin CORS Protection Helper
 * Enforces AGENTS.md Section 2.4 & Security Hardening guidelines
 * Blocks wildcard CORS (*) on private/stateful routes.
 */

const ALLOWED_ORIGINS = [
  'https://veapp.store',
  'https://www.veapp.store',
  'https://vendor.veapp.store',
  'https://admin.veapp.store',
  'https://ve.ug',
  'https://www.ve.ug',
  'https://admin.ve.ug',
  // Local development environments
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];

export function getCorsHeaders(requestOrigin?: string | null): HeadersInit {
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : 'https://veapp.store';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

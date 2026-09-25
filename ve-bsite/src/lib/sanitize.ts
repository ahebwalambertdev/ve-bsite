/**
 * Input sanitization helpers conforming to AGENTS.md standards:
 * - Strip CRLF to prevent header/log injection
 * - Truncate overly long strings
 * - Validate contacts and text fields
 */

export function sanitizeText(val: unknown, maxLength = 255): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\r\n\x00]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[^\d+()\s-]/g, '')
    .trim()
    .slice(0, 32);
}

export function sanitizeContact(val: unknown): string {
  if (typeof val !== 'string') return '';
  const cleaned = val.replace(/[\r\n\x00]/g, '').trim();
  return cleaned.slice(0, 120);
}

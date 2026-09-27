/**
 * Contact and phone number validation utilities for Ve.
 * Prevents invalid submissions like incomplete emails (e.g. "test@") or malformed phone numbers.
 */

export type ContactIntent = 'phone' | 'email' | 'none';

export interface ContactValidationResult {
  intent: ContactIntent;
  isValid: boolean;
  status: 'empty' | 'typing' | 'valid' | 'invalid';
  message?: string;
  formatted?: string;
}

/**
 * Automatically detects whether user is entering a phone number or email,
 * and validates the format dynamically.
 */
export function detectContactIntent(input: string): ContactValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      intent: 'none',
      isValid: false,
      status: 'empty',
    };
  }

  const hasAt = trimmed.includes('@');
  // Digits, plus symbol, or typical phone dial codes
  const isDigitsOrPlus = /^[\+0-9]/.test(trimmed);

  // Email Intent
  if (hasAt || (!isDigitsOrPlus && /[a-zA-Z]/.test(trimmed))) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(trimmed);

    if (isValid) {
      return {
        intent: 'email',
        isValid: true,
        status: 'valid',
        message: 'Valid email address',
      };
    }

    return {
      intent: 'email',
      isValid: false,
      status: trimmed.length < 5 || !hasAt ? 'typing' : 'invalid',
      message: !hasAt
        ? 'Complete with @ domain (e.g. name@gmail.com)'
        : 'Complete email domain (e.g. .com)',
    };
  }

  // Phone Intent
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^(\+?[0-9]{9,15})$/;
  const isValid = phoneRegex.test(cleaned);

  if (isValid) {
    return {
      intent: 'phone',
      isValid: true,
      status: 'valid',
      message: 'Valid phone number',
      formatted: cleaned,
    };
  }

  return {
    intent: 'phone',
    isValid: false,
    status: cleaned.length < 9 ? 'typing' : 'invalid',
    message:
      cleaned.length < 9
        ? `Enter full number (${cleaned.length}/10 digits)`
        : 'Invalid phone format (9–15 digits)',
  };
}

export function validateContact(input: string): { isValid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your phone number or email address' };
  }

  const result = detectContactIntent(trimmed);
  if (result.isValid) {
    return { isValid: true };
  }

  if (result.intent === 'email') {
    return {
      isValid: false,
      error: 'Please enter a complete email address (e.g. name@example.com)',
    };
  }

  return {
    isValid: false,
    error: 'Please enter a valid phone number (e.g. 0772 000 000 or +256 700 000 000)',
  };
}

export function validatePhoneNumber(input: string): { isValid: boolean; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter your WhatsApp phone number' };
  }

  if (trimmed.includes('@')) {
    return {
      isValid: false,
      error: 'Please enter a WhatsApp phone number for shop pickups (e.g. 0772 000 000)',
    };
  }

  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^(\+?[0-9]{9,15})$/;
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number (e.g. 0772 000 000 or +256 700 000 000)',
    };
  }

  return { isValid: true };
}

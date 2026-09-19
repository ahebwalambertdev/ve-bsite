/**
 * Centralized Contact Configuration
 * Standardizes email inboxes and WhatsApp chat links across the Ve platform.
 */

export const CONTACT_CONFIG = {
  // Support & Onboarding WhatsApp Number (E.164 format without +)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || '256781602159',
  formattedPhone: '+256 781 602 159',

  // Official Email Inboxes (@veapp.store)
  emails: {
    help: 'help@veapp.store',       // Buyer care, order status, delivery questions
    support: 'support@veapp.store', // Merchant onboarding, boutique success
    info: 'info@veapp.store',       // General inquiries, brand, press
    legal: 'legal@veapp.store',     // Terms, privacy policy, DPPA 2019 compliance
    dev: 'dev@veapp.store',         // Engineering, technical partnerships, developer API
  },

  /**
   * Helper to construct a WhatsApp direct chat URL with pre-filled message
   */
  getWhatsappUrl: (message?: string, customNumber?: string) => {
    const num = customNumber || process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || '256781602159';
    const cleanNum = num.replace(/[^0-9]/g, '');
    const query = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${cleanNum}${query}`;
  },
};

import { SiteCmsData } from './types';

/**
 * Computes a human-readable diff summary and tag list between two CMS states.
 * Client-safe pure function with zero server/Node dependencies.
 */
export function computeCmsDiff(
  oldData?: Partial<SiteCmsData>,
  newData?: Partial<SiteCmsData>
): { summary: string[]; tags: string[] } {
  if (!oldData || !newData) {
    return { summary: ['Initial content state'], tags: ['Initial'] };
  }

  const summary: string[] = [];
  const tags: string[] = [];

  const check = (key: keyof SiteCmsData, label: string, tag: string, customSummary?: string) => {
    try {
      const oldStr = JSON.stringify(oldData[key] || null);
      const newStr = JSON.stringify(newData[key] || null);
      if (oldStr !== newStr) {
        tags.push(tag);
        summary.push(customSummary || `${label} modified`);
      }
    } catch {
      // ignore
    }
  };

  check('hero', 'Hero Banner & Looks', 'Hero', `Hero section updated (${(newData.hero?.looks || []).length} looks)`);
  check('team', 'Team Members', 'Team', `Team members updated (${(newData.team || []).length} members)`);
  check('about', 'About Us', 'About', 'About Us narrative updated');
  check('howItWorks', 'How It Works', 'How It Works', 'How It Works steps updated');
  check('faqs', 'Support FAQs', 'FAQ', `FAQs updated (${(newData.faqs || []).length} items)`);
  check('waitlist', 'Waitlist & App', 'Waitlist', 'Waitlist & App launch copy updated');
  check('vendorStrip', 'Vendor Strip', 'Vendors', 'Vendor partnership strip updated');
  check('announcementBar', 'Announcement Bar', 'Announcement', 'Announcement bar updated');
  check('contact', 'Contact & Escalations', 'Contact', 'Contact inboxes & phone updated');
  check('press', 'Press & Media Kit', 'Press', 'Press page updated');
  check('legalTerms', 'Terms of Service', 'Terms', 'Terms of Service updated');
  check('legalPrivacy', 'Privacy Policy', 'Privacy', 'Privacy Policy updated');
  check('navigation', 'Navigation & Social', 'Navigation', 'Navigation links or social handles updated');
  check('journal', 'Journal Metadata', 'Journal', 'Journal metadata updated');

  if (summary.length === 0) {
    summary.push('Minor copy or metadata adjustments');
    tags.push('General');
  }

  return { summary, tags };
}

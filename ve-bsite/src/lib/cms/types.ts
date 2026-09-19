export interface HeroLook {
  id: string;
  label: string;
  image: string;
  tag?: string;
  location?: string;
  sortOrder: number;
}

export interface HeroContent {
  megaHeadingLine1: string;
  megaHeadingLine2: string;
  subHeadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  demoVideoTitle: string;
  demoVideoDescription: string;
  looks: HeroLook[];
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  iconName?: 'Sparkles' | 'ShieldCheck' | 'Truck' | 'Camera' | 'Bike';
}

export interface HowItWorksContent {
  sectionTitle: string;
  sectionSubtitle: string;
  steps: HowItWorksStep[];
}

export interface CmsFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  iconName?: string;
  sortOrder: number;
  isFeaturedHome: boolean;
  isPublished: boolean;
}

export interface VendorStripContent {
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface WaitlistContent {
  title: string;
  titleItalic: string;
  description: string;
  perks: string[];
  systemRequirementsNote: string;
}

export interface AnnouncementBarContent {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinkedin?: string;
  socialTwitter?: string;
  socialEmail?: string;
  sortOrder: number;
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderCtaConfig {
  text: string;
  href: string;
}

export interface SocialLinkConfig {
  whatsappUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  twitterUrl: string;
  supportEmail: string;
  vendorEmail: string;
}

export interface NavigationConfig {
  headerLinks: NavLinkItem[];
  headerCta: HeaderCtaConfig;
  socialLinks: SocialLinkConfig;
  footerLinks?: NavLinkItem[];
}

export interface AboutProblemPoint {
  id: string;
  title: string;
  text: string;
}

export interface AboutPillarItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface AboutPageContent {
  badge: string;
  manifestoHeadline: string;
  manifestoItalic: string;
  manifestoDescription: string;
  problemTitle: string;
  problemDescription: string;
  problemPoints: AboutProblemPoint[];
  solutionTitle: string;
  solutionDescription: string;
  pillars: AboutPillarItem[];
}

export interface ContactInboxItem {
  id: string;
  label: string;
  email: string;
  description?: string;
}

export interface ContactPageContent {
  badge: string;
  headline: string;
  subheadline: string;
  supportCardTitle: string;
  supportCardDescription: string;
  supportCardHours: string;
  supportCardCtaText: string;
  merchantCardTitle: string;
  merchantCardDescription: string;
  merchantCardHours: string;
  merchantCardCtaText: string;
  inboxesTitle: string;
  inboxes: ContactInboxItem[];
  officeTitle: string;
  officeName: string;
  officeAddress: string;
  officeHours: string;
  officeNote: string;
}

export interface PressPaletteItem {
  name: string;
  hex: string;
  role: string;
}

export interface PressPageContent {
  badge: string;
  title: string;
  description: string;
  boilerplateTitle: string;
  boilerplateText: string;
  paletteTitle: string;
  palette: PressPaletteItem[];
  inquiriesEmail: string;
  mediaKitDownloadUrl?: string;
}

export interface LegalSectionItem {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface LegalTermsContent {
  title: string;
  effectiveDate: string;
  version: string;
  jurisdiction: string;
  sections: LegalSectionItem[];
}

export interface LegalPrivacyContent {
  title: string;
  effectiveDate: string;
  version: string;
  complianceBadge: string;
  sections: LegalSectionItem[];
}

export interface JournalPageContent {
  title: string;
  description: string;
  categories: string[];
}

export interface SiteCmsData {
  announcementBar: AnnouncementBarContent;
  hero: HeroContent;
  howItWorks: HowItWorksContent;
  faqs: CmsFaqItem[];
  vendorStrip: VendorStripContent;
  waitlist: WaitlistContent;
  team: TeamMemberData[];
  navigation: NavigationConfig;
  about: AboutPageContent;
  contact: ContactPageContent;
  press: PressPageContent;
  legalTerms: LegalTermsContent;
  legalPrivacy: LegalPrivacyContent;
  journal: JournalPageContent;
  lastUpdated: string;
}

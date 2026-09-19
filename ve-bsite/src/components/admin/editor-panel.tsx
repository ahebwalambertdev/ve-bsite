'use client';

import React, { useState, useEffect } from 'react';
import { 
  SiteCmsData, 
  CmsFaqItem, 
  HeroLook, 
  TeamMemberData,
  NavLinkItem,
  HeaderCtaConfig,
  SocialLinkConfig,
  AboutPageContent,
  AboutProblemPoint,
  AboutPillarItem,
  ContactPageContent,
  ContactInboxItem,
  PressPageContent,
  PressPaletteItem,
  LegalTermsContent,
  LegalPrivacyContent,
  LegalSectionItem,
  JournalPageContent
} from '@/lib/cms/types';
import { DEFAULT_CMS_DATA } from '@/lib/cms/defaults';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Image as ImageIcon, 
  HelpCircle, 
  Layers, 
  Store, 
  Smartphone, 
  Bell, 
  Plus, 
  Trash2, 
  ChevronDown,
  Sparkles,
  Users,
  Link2,
  FileText,
  Mail,
  BookOpen,
  Lock,
  Palette,
  Phone,
  Info,
  Heart
} from 'lucide-react';

interface EditorPanelProps {
  data: SiteCmsData;
  onChange: (updated: SiteCmsData) => void;
  currentRoute?: string;
  onRouteChange?: (route: string) => void;
}

type SectionKey = 
  | 'hero' 
  | 'media' 
  | 'howItWorks' 
  | 'faqs' 
  | 'vendor' 
  | 'waitlist' 
  | 'announcement' 
  | 'team'
  | 'about'
  | 'contact'
  | 'press'
  | 'terms'
  | 'privacy'
  | 'journal'
  | 'navigation';

const sectionToRoute: Partial<Record<SectionKey, string>> = {
  hero: '/',
  media: '/',
  howItWorks: '/',
  vendor: '/sell',
  waitlist: '/app',
  faqs: '/faq',
  team: '/team',
  about: '/about',
  contact: '/contact',
  press: '/press',
  terms: '/legal/terms',
  privacy: '/legal/privacy',
  journal: '/journal',
};

export function EditorPanel({ data, onChange, currentRoute = '/', onRouteChange }: EditorPanelProps) {
  const [filterMode, setFilterMode] = useState<'page' | 'all'>('page');
  const [openSection, setOpenSection] = useState<SectionKey>('hero');

  // Automatically sync open section with current route when page view is active
  useEffect(() => {
    const route = currentRoute.split('?')[0].split('#')[0] || '/';
    if (route === '/app') {
      setOpenSection('waitlist');
    } else if (route === '/sell') {
      setOpenSection('vendor');
    } else if (route === '/faq') {
      setOpenSection('faqs');
    } else if (route === '/team') {
      setOpenSection('team');
    } else if (route === '/about') {
      setOpenSection('about');
    } else if (route === '/contact') {
      setOpenSection('contact');
    } else if (route === '/press') {
      setOpenSection('press');
    } else if (route === '/legal/terms') {
      setOpenSection('terms');
    } else if (route === '/legal/privacy') {
      setOpenSection('privacy');
    } else if (route === '/journal') {
      setOpenSection('journal');
    } else {
      setOpenSection('hero');
    }
  }, [currentRoute]);

  const toggleSection = (key: SectionKey) => {
    const isOpening = openSection !== key;
    setOpenSection(isOpening ? key : 'hero');
    if (isOpening && sectionToRoute[key] && onRouteChange && filterMode === 'all') {
      onRouteChange(sectionToRoute[key]!);
    }
  };

  const shouldShowSection = (section: SectionKey) => {
    if (filterMode === 'all') return true;
    if (section === 'navigation') return true; // Always easily accessible
    const route = currentRoute.split('?')[0].split('#')[0] || '/';
    if (route === '/app') return section === 'waitlist' || section === 'announcement';
    if (route === '/sell') return section === 'vendor' || section === 'announcement';
    if (route === '/faq') return section === 'faqs';
    if (route === '/team') return section === 'team';
    if (route === '/about') return section === 'about' || section === 'team';
    if (route === '/contact') return section === 'contact';
    if (route === '/press') return section === 'press';
    if (route === '/legal/terms') return section === 'terms';
    if (route === '/legal/privacy') return section === 'privacy';
    if (route === '/journal') return section === 'journal';
    // Homepage
    return (
      section === 'hero' ||
      section === 'media' ||
      section === 'howItWorks' ||
      section === 'faqs' ||
      section === 'vendor' ||
      section === 'announcement'
    );
  };

  // Safe navigation object fallback
  const navData = data.navigation || DEFAULT_CMS_DATA.navigation;

  // 1. Hero Updates
  const updateHero = (field: keyof SiteCmsData['hero'], value: any) => {
    onChange({
      ...data,
      hero: {
        ...data.hero,
        [field]: value,
      },
    });
  };

  // 2. FAQ Updates
  const updateFaq = (index: number, field: keyof CmsFaqItem, value: any) => {
    const updated = [...(data.faqs || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({ ...data, faqs: updated });
  };

  const addFaq = () => {
    const newFaq: CmsFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'General',
      question: 'New Question title?',
      answer: 'Provide clear, factual answer here.',
      iconName: 'ShieldCheck',
      sortOrder: (data.faqs || []).length + 1,
      isFeaturedHome: false,
      isPublished: true,
    };
    onChange({ ...data, faqs: [...(data.faqs || []), newFaq] });
  };

  const deleteFaq = (index: number) => {
    const updated = (data.faqs || []).filter((_, i) => i !== index);
    onChange({ ...data, faqs: updated });
  };

  // 3. Media / Lookbook Updates
  const updateLook = (index: number, field: keyof HeroLook, value: any) => {
    const updated = [...data.hero.looks];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateHero('looks', updated);
  };

  const addLook = () => {
    const newLook: HeroLook = {
      id: `look-${Date.now()}`,
      label: `Look 0${data.hero.looks.length + 1} · Kampala Style`,
      image: '/images/hero-kampala-street.webp',
      tag: 'New Drop',
      location: 'Kampala',
      sortOrder: data.hero.looks.length + 1,
    };
    updateHero('looks', [...data.hero.looks, newLook]);
  };

  const deleteLook = (index: number) => {
    if (data.hero.looks.length <= 1) return;
    const updated = data.hero.looks.filter((_, i) => i !== index);
    updateHero('looks', updated);
  };

  // 4. How It Works Updates
  const updateHowItWorks = (field: keyof SiteCmsData['howItWorks'], value: any) => {
    onChange({
      ...data,
      howItWorks: {
        ...data.howItWorks,
        [field]: value,
      },
    });
  };

  const updateStep = (index: number, field: string, value: string) => {
    const updated = [...data.howItWorks.steps];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateHowItWorks('steps', updated);
  };

  // 5. Vendor Strip
  const updateVendor = (field: keyof SiteCmsData['vendorStrip'], value: string) => {
    onChange({
      ...data,
      vendorStrip: {
        ...data.vendorStrip,
        [field]: value,
      },
    });
  };

  // 6. Waitlist
  const updateWaitlist = (field: keyof SiteCmsData['waitlist'], value: any) => {
    onChange({
      ...data,
      waitlist: {
        ...data.waitlist,
        [field]: value,
      },
    });
  };

  // 7. Team Updates
  const updateTeamMember = (index: number, field: keyof TeamMemberData, value: any) => {
    const updated = [...(data.team || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({ ...data, team: updated });
  };

  const addTeamMember = () => {
    const newMember: TeamMemberData = {
      id: `team-${Date.now()}`,
      name: 'New Team Member',
      role: 'Role Title',
      image: '/images/hero-kampala-street.webp',
      bio: 'Write member bio here.',
      socialTwitter: 'https://twitter.com',
      sortOrder: (data.team || []).length + 1,
    };
    onChange({ ...data, team: [...(data.team || []), newMember] });
  };

  const deleteTeamMember = (index: number) => {
    const updated = (data.team || []).filter((_, i) => i !== index);
    onChange({ ...data, team: updated });
  };

  // 8. Navigation & Links Updates
  const updateHeaderLink = (index: number, field: keyof NavLinkItem, value: string) => {
    const currentLinks = [...(navData.headerLinks || [])];
    currentLinks[index] = {
      ...currentLinks[index],
      [field]: value,
    };
    onChange({
      ...data,
      navigation: {
        ...navData,
        headerLinks: currentLinks,
      },
    });
  };

  const addHeaderLink = () => {
    const newLink: NavLinkItem = {
      id: `link-${Date.now()}`,
      label: 'New Link',
      href: '/#',
    };
    onChange({
      ...data,
      navigation: {
        ...navData,
        headerLinks: [...(navData.headerLinks || []), newLink],
      },
    });
  };

  const deleteHeaderLink = (index: number) => {
    const currentLinks = (navData.headerLinks || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      navigation: {
        ...navData,
        headerLinks: currentLinks,
      },
    });
  };

  const updateFooterLink = (index: number, field: keyof NavLinkItem, value: string) => {
    const currentLinks = [...(navData.footerLinks || [])];
    currentLinks[index] = {
      ...currentLinks[index],
      [field]: value,
    };
    onChange({
      ...data,
      navigation: {
        ...navData,
        footerLinks: currentLinks,
      },
    });
  };

  const addFooterLink = () => {
    const newLink: NavLinkItem = {
      id: `footer-link-${Date.now()}`,
      label: 'New Link',
      href: '/#',
    };
    onChange({
      ...data,
      navigation: {
        ...navData,
        footerLinks: [...(navData.footerLinks || []), newLink],
      },
    });
  };

  const deleteFooterLink = (index: number) => {
    const currentLinks = (navData.footerLinks || []).filter((_, i) => i !== index);
    onChange({
      ...data,
      navigation: {
        ...navData,
        footerLinks: currentLinks,
      },
    });
  };

  const updateHeaderCta = (field: keyof HeaderCtaConfig, value: string) => {
    onChange({
      ...data,
      navigation: {
        ...navData,
        headerCta: {
          ...navData.headerCta,
          [field]: value,
        },
      },
    });
  };

  const updateSocialLink = (field: keyof SocialLinkConfig, value: string) => {
    onChange({
      ...data,
      navigation: {
        ...navData,
        socialLinks: {
          ...navData.socialLinks,
          [field]: value,
        },
      },
    });
  };

  // Safe page object fallbacks
  const aboutData = data.about || DEFAULT_CMS_DATA.about;
  const contactData = data.contact || DEFAULT_CMS_DATA.contact;
  const pressData = data.press || DEFAULT_CMS_DATA.press;
  const termsData = data.legalTerms || DEFAULT_CMS_DATA.legalTerms;
  const privacyData = data.legalPrivacy || DEFAULT_CMS_DATA.legalPrivacy;
  const journalData = data.journal || DEFAULT_CMS_DATA.journal;

  // About Updates
  const updateAbout = (field: keyof AboutPageContent, value: any) => {
    onChange({
      ...data,
      about: {
        ...aboutData,
        [field]: value,
      },
    });
  };

  const updateProblemPoint = (index: number, field: keyof AboutProblemPoint, value: string) => {
    const updated = [...aboutData.problemPoints];
    updated[index] = { ...updated[index], [field]: value };
    updateAbout('problemPoints', updated);
  };

  const addProblemPoint = () => {
    const newPoint: AboutProblemPoint = {
      id: `point-${Date.now()}`,
      title: 'New Issue / Limitation',
      text: 'Describe how fashion commerce struggled with this issue.',
    };
    updateAbout('problemPoints', [...aboutData.problemPoints, newPoint]);
  };

  const deleteProblemPoint = (index: number) => {
    const updated = aboutData.problemPoints.filter((_, i) => i !== index);
    updateAbout('problemPoints', updated);
  };

  const updatePillar = (index: number, field: keyof AboutPillarItem, value: string) => {
    const updated = [...aboutData.pillars];
    updated[index] = { ...updated[index], [field]: value };
    updateAbout('pillars', updated);
  };

  const addPillar = () => {
    const newPillar: AboutPillarItem = {
      id: `pillar-${Date.now()}`,
      title: 'New Operational Guarantee',
      description: 'Describe how this safeguards buyers and boutiques in Kampala.',
      iconName: 'Sparkles',
    };
    updateAbout('pillars', [...aboutData.pillars, newPillar]);
  };

  const deletePillar = (index: number) => {
    const updated = aboutData.pillars.filter((_, i) => i !== index);
    updateAbout('pillars', updated);
  };

  // Contact Updates
  const updateContact = (field: keyof ContactPageContent, value: any) => {
    onChange({
      ...data,
      contact: {
        ...contactData,
        [field]: value,
      },
    });
  };

  const updateInbox = (index: number, field: keyof ContactInboxItem, value: string) => {
    const updated = [...contactData.inboxes];
    updated[index] = { ...updated[index], [field]: value };
    updateContact('inboxes', updated);
  };

  const addInbox = () => {
    const newInbox: ContactInboxItem = {
      id: `inbox-${Date.now()}`,
      label: 'New Department / Desk',
      email: 'team@veapp.store',
      description: 'Department responsibilities',
    };
    updateContact('inboxes', [...contactData.inboxes, newInbox]);
  };

  const deleteInbox = (index: number) => {
    const updated = contactData.inboxes.filter((_, i) => i !== index);
    updateContact('inboxes', updated);
  };

  // Press Updates
  const updatePress = (field: keyof PressPageContent, value: any) => {
    onChange({
      ...data,
      press: {
        ...pressData,
        [field]: value,
      },
    });
  };

  const updatePaletteItem = (index: number, field: keyof PressPaletteItem, value: string) => {
    const updated = [...pressData.palette];
    updated[index] = { ...updated[index], [field]: value };
    updatePress('palette', updated);
  };

  const addPaletteItem = () => {
    const newItem: PressPaletteItem = {
      name: 'New Color',
      hex: '#000000',
      role: 'Surface / Accent',
    };
    updatePress('palette', [...pressData.palette, newItem]);
  };

  const deletePaletteItem = (index: number) => {
    const updated = pressData.palette.filter((_, i) => i !== index);
    updatePress('palette', updated);
  };

  // Terms Updates
  const updateTerms = (field: keyof LegalTermsContent, value: any) => {
    onChange({
      ...data,
      legalTerms: {
        ...termsData,
        [field]: value,
      },
    });
  };

  const updateTermsSection = (index: number, field: 'title' | 'paragraphs', value: any) => {
    const updated = [...termsData.sections];
    updated[index] = { ...updated[index], [field]: value };
    updateTerms('sections', updated);
  };

  const addTermsSection = () => {
    const newSec: LegalSectionItem = {
      id: `sec-${Date.now()}`,
      title: `${termsData.sections.length + 1}. New Clause Title`,
      paragraphs: ['Enter the legal text for this section here.'],
    };
    updateTerms('sections', [...termsData.sections, newSec]);
  };

  const deleteTermsSection = (index: number) => {
    const updated = termsData.sections.filter((_, i) => i !== index);
    updateTerms('sections', updated);
  };

  // Privacy Updates
  const updatePrivacy = (field: keyof LegalPrivacyContent, value: any) => {
    onChange({
      ...data,
      legalPrivacy: {
        ...privacyData,
        [field]: value,
      },
    });
  };

  const updatePrivacySection = (index: number, field: 'title' | 'paragraphs', value: any) => {
    const updated = [...privacyData.sections];
    updated[index] = { ...updated[index], [field]: value };
    updatePrivacy('sections', updated);
  };

  const addPrivacySection = () => {
    const newSec: LegalSectionItem = {
      id: `priv-${Date.now()}`,
      title: `${privacyData.sections.length + 1}. New Privacy Clause`,
      paragraphs: ['Enter statutory compliance and privacy policy details here.'],
    };
    updatePrivacy('sections', [...privacyData.sections, newSec]);
  };

  const deletePrivacySection = (index: number) => {
    const updated = privacyData.sections.filter((_, i) => i !== index);
    updatePrivacy('sections', updated);
  };

  // Journal Updates
  const updateJournal = (field: keyof JournalPageContent, value: any) => {
    onChange({
      ...data,
      journal: {
        ...journalData,
        [field]: value,
      },
    });
  };

  const updateJournalCategory = (index: number, value: string) => {
    const updated = [...journalData.categories];
    updated[index] = value;
    updateJournal('categories', updated);
  };

  const addJournalCategory = () => {
    updateJournal('categories', [...journalData.categories, 'New Category']);
  };

  const deleteJournalCategory = (index: number) => {
    const updated = journalData.categories.filter((_, i) => i !== index);
    updateJournal('categories', updated);
  };

  const routeLabels: Record<string, string> = {
    '/': 'Homepage',
    '/app': 'App / Waitlist',
    '/sell': 'Become a Ve-ndor',
    '/about': 'About Ve',
    '/team': 'Our Team',
    '/journal': 'Ve Journal',
    '/faq': 'Support & FAQ',
    '/contact': 'Contact & Escalations',
    '/press': 'Press & Media Kit',
    '/legal/terms': 'Terms of Service',
    '/legal/privacy': 'Privacy Policy',
  };

  return (
    <aside className="w-full md:w-[420px] lg:w-[460px] h-full bg-snow border-r border-soft-linen flex flex-col overflow-y-auto shrink-0 shadow-sm">
      {/* Panel Top Header with Route Context & Quick Filters */}
      <div className="p-4 border-b border-soft-linen bg-soft-linen/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-neutral-500">
              Editing:{' '}
              <span className="font-semibold text-dusty-olive-dark">
                {routeLabels[currentRoute] || 'Homepage'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1 bg-snow p-0.5 rounded-md border border-soft-linen text-[10px]">
            <button
              type="button"
              onClick={() => setFilterMode('page')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterMode === 'page'
                  ? 'bg-carbon-black text-snow font-medium'
                  : 'text-neutral-500 hover:text-carbon-black'
              }`}
            >
              Page View
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-carbon-black text-snow font-medium'
                  : 'text-neutral-500 hover:text-carbon-black'
              }`}
            >
              All Sections
            </button>
          </div>
        </div>

        {/* Quick Route Switcher inside Sidebar */}
        {onRouteChange && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {[
              { path: '/', label: 'Home' },
              { path: '/app', label: 'Waitlist' },
              { path: '/sell', label: 'Sell' },
              { path: '/about', label: 'About' },
              { path: '/team', label: 'Team' },
              { path: '/faq', label: 'FAQ' },
              { path: '/contact', label: 'Contact' },
              { path: '/journal', label: 'Journal' },
              { path: '/press', label: 'Press' },
              { path: '/legal/terms', label: 'Terms' },
              { path: '/legal/privacy', label: 'Privacy' },
            ].map((tab) => (
              <button
                key={tab.path}
                type="button"
                onClick={() => onRouteChange(tab.path)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  currentRoute === tab.path
                    ? 'bg-dusty-olive text-snow border-dusty-olive font-semibold shadow-xs'
                    : 'bg-snow text-neutral-600 border-soft-linen hover:border-neutral-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOpenSection('navigation')}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                openSection === 'navigation'
                  ? 'bg-carbon-black text-snow border-carbon-black font-semibold'
                  : 'bg-snow text-neutral-600 border-soft-linen hover:border-neutral-400'
              }`}
            >
              <Link2 className="w-2.5 h-2.5" />
              Links
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-soft-linen">
        {/* SECTION 9: NAVIGATION & GLOBAL LINKS */}
        {shouldShowSection('navigation') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('navigation')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Link2 className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Navigation &amp; Global Links</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'navigation' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'navigation' && (
              <div className="mt-4 space-y-5 animate-in fade-in-50 duration-200">
                {/* 1. Header Navigation Menu Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-carbon-black">
                        Header Navigation Menu
                      </h3>
                      <p className="text-[10px] text-neutral-500">
                        Links visible across the top of every page.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHeaderLink}
                      className="text-xs h-7 gap-1 border-soft-linen"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Link
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {(navData.headerLinks || []).map((link, idx) => (
                      <div
                        key={link.id || idx}
                        className="p-2.5 bg-white rounded-lg border border-soft-linen space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            Item #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteHeaderLink(idx)}
                            className="text-neutral-400 hover:text-red-500 p-0.5 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-neutral-500 uppercase">
                              Display Text
                            </label>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateHeaderLink(idx, 'label', e.target.value)}
                              className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-neutral-500 uppercase">
                              Destination URL
                            </label>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateHeaderLink(idx, 'href', e.target.value)}
                              className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                              placeholder="/sell or https://..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Header Primary Action CTA Button */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2.5">
                  <h3 className="text-xs font-semibold text-carbon-black">
                    Header Primary Action Button
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-neutral-500 uppercase">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={navData.headerCta?.text || ''}
                        onChange={(e) => updateHeaderCta('text', e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-neutral-500 uppercase">
                        Button Destination Link
                      </label>
                      <input
                        type="text"
                        value={navData.headerCta?.href || ''}
                        onChange={(e) => updateHeaderCta('href', e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Footer Ecosystem Navigation Links */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-carbon-black">
                        Footer Ecosystem Links
                      </h3>
                      <p className="text-[10px] text-neutral-500">
                        Links displayed in the footer navigation column.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFooterLink}
                      className="text-xs h-7 gap-1 border-soft-linen"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Link
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {(navData.footerLinks || []).map((link, idx) => (
                      <div
                        key={link.id || idx}
                        className="p-2.5 bg-white rounded-lg border border-soft-linen space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            Footer #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteFooterLink(idx)}
                            className="text-neutral-400 hover:text-red-500 p-0.5 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-neutral-500 uppercase">
                              Display Text
                            </label>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateFooterLink(idx, 'label', e.target.value)}
                              className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-neutral-500 uppercase">
                              Destination URL
                            </label>
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateFooterLink(idx, 'href', e.target.value)}
                              className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                              placeholder="/sell or https://..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Social & Direct Contact Links */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2.5">
                  <h3 className="text-xs font-semibold text-carbon-black">
                    Social &amp; Contact Destinations
                  </h3>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-neutral-500 uppercase">
                        WhatsApp Click-to-Chat URL
                      </label>
                      <input
                        type="text"
                        value={navData.socialLinks?.whatsappUrl || ''}
                        onChange={(e) => updateSocialLink('whatsappUrl', e.target.value)}
                        placeholder="https://wa.me/256..."
                        className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Instagram Profile
                        </label>
                        <input
                          type="text"
                          value={navData.socialLinks?.instagramUrl || ''}
                          onChange={(e) => updateSocialLink('instagramUrl', e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          TikTok Profile
                        </label>
                        <input
                          type="text"
                          value={navData.socialLinks?.tiktokUrl || ''}
                          onChange={(e) => updateSocialLink('tiktokUrl', e.target.value)}
                          placeholder="https://tiktok.com/@..."
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Support Email Inbox
                        </label>
                        <input
                          type="text"
                          value={navData.socialLinks?.supportEmail || ''}
                          onChange={(e) => updateSocialLink('supportEmail', e.target.value)}
                          placeholder="info@veapp.store"
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Twitter / X Profile
                        </label>
                        <input
                          type="text"
                          value={navData.socialLinks?.twitterUrl || ''}
                          onChange={(e) => updateSocialLink('twitterUrl', e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-snow text-carbon-black outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 1: HERO HEADLINES & CTAS */}
        {shouldShowSection('hero') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('hero')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-dusty-olive" />
                <span>Hero Headlines &amp; CTAs</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'hero' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'hero' && (
              <div className="mt-4 space-y-3.5 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Mega Heading (Line 1)
                  </label>
                  <input
                    type="text"
                    value={data.hero.megaHeadingLine1}
                    onChange={(e) => updateHero('megaHeadingLine1', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Italic Sub-Heading (Line 2)
                  </label>
                  <input
                    type="text"
                    value={data.hero.megaHeadingLine2}
                    onChange={(e) => updateHero('megaHeadingLine2', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none font-serif italic"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Hero Sub-headline
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.subHeadline}
                    onChange={(e) => updateHero('subHeadline', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryCtaText}
                      onChange={(e) => updateHero('primaryCtaText', e.target.value)}
                      className="w-full text-xs p-2 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryCtaText}
                      onChange={(e) => updateHero('secondaryCtaText', e.target.value)}
                      className="w-full text-xs p-2 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none"
                    />
                  </div>
                </div>

                {/* Primary & Secondary CTA Destination Links */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Primary CTA Link (URL)
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryCtaLink || ''}
                      onChange={(e) => updateHero('primaryCtaLink', e.target.value)}
                      placeholder="/app"
                      className="w-full text-xs p-2 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Secondary CTA Link (URL)
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryCtaLink || ''}
                      onChange={(e) => updateHero('secondaryCtaLink', e.target.value)}
                      placeholder="/sell"
                      className="w-full text-xs p-2 rounded-md border border-soft-linen bg-white text-carbon-black focus:ring-1 focus:ring-dusty-olive outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: HERO BACKGROUND PHOTOS */}
        {shouldShowSection('media') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('media')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 text-dusty-olive" />
                <span>Editorial Photos &amp; Slideshow</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'media' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'media' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {data.hero.looks.length} Look{data.hero.looks.length === 1 ? '' : 's'} configured
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLook}
                    className="text-xs h-7 gap-1 border-soft-linen"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Look
                  </Button>
                </div>

                <div className="space-y-3">
                  {data.hero.looks.map((look, idx) => (
                    <div
                      key={look.id}
                      className="p-3 bg-soft-linen/30 rounded-lg border border-soft-linen space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase text-neutral-600">
                          Slide #{idx + 1}
                        </span>
                        {data.hero.looks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteLook(idx)}
                            className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Label Caption
                        </label>
                        <input
                          type="text"
                          value={look.label}
                          onChange={(e) => updateLook(idx, 'label', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Image Source URL / Path
                        </label>
                        <input
                          type="text"
                          value={look.image}
                          onChange={(e) => updateLook(idx, 'image', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: HOW IT WORKS */}
        {shouldShowSection('howItWorks') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('howItWorks')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-dusty-olive" />
                <span>How It Works (Steps 1–3)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'howItWorks' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'howItWorks' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.howItWorks.sectionTitle}
                    onChange={(e) => updateHowItWorks('sectionTitle', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.howItWorks.sectionSubtitle}
                    onChange={(e) => updateHowItWorks('sectionSubtitle', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 bg-soft-linen/40 px-3 py-2 rounded-lg border border-soft-linen">
                    <span>3:4 Editorial Cards with gradient text overlay</span>
                    <span className="font-mono text-[10px] text-dusty-olive-dark font-semibold">Live Preview</span>
                  </div>

                  {data.howItWorks.steps.map((step, idx) => {
                    const currentImg = step.image || (
                      idx === 0
                        ? '/images/how-it-works-discover.jpeg'
                        : idx === 1
                        ? '/images/how-it-works-tryon.jpg'
                        : '/images/how-it-works-pay.jpg'
                    );

                    return (
                      <div
                        key={step.stepNumber || idx}
                        className="p-3.5 bg-white rounded-xl border border-soft-linen space-y-3 shadow-xs"
                      >
                        <div className="flex items-center justify-between border-b border-soft-linen/60 pb-2">
                          <span className="text-[11px] font-mono font-semibold uppercase text-dusty-olive-dark">
                            Card #{idx + 1} · {idx === 0 ? 'Discover' : idx === 1 ? 'Try-On' : 'Courier'}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            3:4 Ratio
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-neutral-500 uppercase">
                            Card Headline
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateStep(idx, 'title', e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-soft-linen bg-snow text-carbon-black outline-none focus:border-dusty-olive"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-neutral-500 uppercase">
                            Supporting Copy
                          </label>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => updateStep(idx, 'description', e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-soft-linen bg-snow text-carbon-black outline-none resize-none focus:border-dusty-olive leading-relaxed"
                          />
                        </div>

                        <div className="space-y-2 pt-1 border-t border-soft-linen/50">
                          <label className="text-[10px] font-medium text-neutral-500 uppercase flex items-center justify-between">
                            <span>Background Editorial Photo</span>
                            <span className="text-[9px] font-mono text-neutral-400 lowercase">3:4 aspect ratio</span>
                          </label>

                          <div className="flex gap-3 items-start">
                            <div className="relative w-14 h-[75px] rounded-md overflow-hidden bg-soft-linen border border-soft-linen shrink-0 shadow-xs group">
                              <img
                                src={currentImg}
                                alt={step.title}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/how-it-works-discover.jpeg';
                                }}
                              />
                            </div>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              <input
                                type="text"
                                value={step.image || ''}
                                onChange={(e) => updateStep(idx, 'image', e.target.value)}
                                placeholder={currentImg}
                                className="w-full text-xs p-1.5 rounded-md border border-soft-linen bg-snow text-carbon-black outline-none font-mono text-[11px] focus:border-dusty-olive"
                              />

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] text-neutral-400 uppercase font-mono">Presets:</span>
                                <button
                                  type="button"
                                  onClick={() => updateStep(idx, 'image', '/images/how-it-works-discover.jpeg')}
                                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                    currentImg === '/images/how-it-works-discover.jpeg'
                                      ? 'bg-dusty-olive text-snow border-dusty-olive font-medium'
                                      : 'bg-white text-neutral-600 border-soft-linen hover:border-neutral-400'
                                  }`}
                                >
                                  Discover
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStep(idx, 'image', '/images/how-it-works-tryon.jpg')}
                                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                    currentImg === '/images/how-it-works-tryon.jpg'
                                      ? 'bg-dusty-olive text-snow border-dusty-olive font-medium'
                                      : 'bg-white text-neutral-600 border-soft-linen hover:border-neutral-400'
                                  }`}
                                >
                                  Try-On
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateStep(idx, 'image', '/images/how-it-works-pay.jpg')}
                                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                    currentImg === '/images/how-it-works-pay.jpg'
                                      ? 'bg-dusty-olive text-snow border-dusty-olive font-medium'
                                      : 'bg-white text-neutral-600 border-soft-linen hover:border-neutral-400'
                                  }`}
                                >
                                  Courier
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: FAQS */}
        {shouldShowSection('faqs') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('faqs')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-dusty-olive" />
                <span>Frequently Asked Questions</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'faqs' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'faqs' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {(data.faqs || []).length} questions configured
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFaq}
                    className="text-xs h-7 gap-1 border-soft-linen"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add FAQ
                  </Button>
                </div>

                <div className="space-y-3">
                  {(data.faqs || []).map((faq, idx) => (
                    <div
                      key={faq.id}
                      className="p-3 bg-soft-linen/30 rounded-lg border border-soft-linen space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase text-neutral-600">
                          Q#{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[10px] text-neutral-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={faq.isFeaturedHome}
                              onChange={(e) => updateFaq(idx, 'isFeaturedHome', e.target.checked)}
                              className="rounded border-soft-linen text-dusty-olive focus:ring-dusty-olive"
                            />
                            Home Featured
                          </label>
                          <button
                            type="button"
                            onClick={() => deleteFaq(idx)}
                            className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Answer
                        </label>
                        <textarea
                          rows={3}
                          value={faq.answer}
                          onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: VENDOR STRIP */}
        {shouldShowSection('vendor') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('vendor')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-dusty-olive" />
                <span>Vendor Callout &amp; Terms</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'vendor' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'vendor' && (
              <div className="mt-4 space-y-3 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Callout Headline
                  </label>
                  <input
                    type="text"
                    value={data.vendorStrip.title}
                    onChange={(e) => updateVendor('title', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Pitch Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.vendorStrip.description}
                    onChange={(e) => updateVendor('description', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.vendorStrip.primaryCtaText}
                      onChange={(e) => updateVendor('primaryCtaText', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={data.vendorStrip.secondaryCtaText}
                      onChange={(e) => updateVendor('secondaryCtaText', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                </div>

                {/* Vendor Button Destination Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={data.vendorStrip.primaryCtaLink || ''}
                      onChange={(e) => updateVendor('primaryCtaLink', e.target.value)}
                      placeholder="/sell"
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      value={data.vendorStrip.secondaryCtaLink || ''}
                      onChange={(e) => updateVendor('secondaryCtaLink', e.target.value)}
                      placeholder="https://veapp.store/vendor"
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 6: WAITLIST & APP */}
        {shouldShowSection('waitlist') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('waitlist')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-dusty-olive" />
                <span>App Waitlist &amp; Early Access</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'waitlist' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'waitlist' && (
              <div className="mt-4 space-y-3.5 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={data.waitlist.title}
                    onChange={(e) => updateWaitlist('title', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Italic Accent Line
                  </label>
                  <input
                    type="text"
                    value={data.waitlist.titleItalic}
                    onChange={(e) => updateWaitlist('titleItalic', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-serif italic"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.waitlist.description}
                    onChange={(e) => updateWaitlist('description', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    System Requirements Note
                  </label>
                  <input
                    type="text"
                    value={data.waitlist.systemRequirementsNote}
                    onChange={(e) => updateWaitlist('systemRequirementsNote', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 7: TEAM MEMBERS */}
        {shouldShowSection('team') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('team')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-dusty-olive" />
                <span>Team Members</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'team' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'team' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {(data.team || []).length} member{(data.team || []).length === 1 ? '' : 's'} listed
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                    className="text-xs h-7 gap-1 border-soft-linen"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Member
                  </Button>
                </div>

                <div className="space-y-3.5">
                  {(data.team || []).map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className="p-3 bg-soft-linen/30 rounded-lg border border-soft-linen space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase text-neutral-600">
                          Member #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTeamMember(idx)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-neutral-500 uppercase">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                            className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-neutral-500 uppercase">
                            Role / Title
                          </label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => updateTeamMember(idx, 'role', e.target.value)}
                            className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Photo URL
                        </label>
                        <input
                          type="text"
                          value={member.image}
                          onChange={(e) => updateTeamMember(idx, 'image', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Bio
                        </label>
                        <textarea
                          rows={2}
                          value={member.bio}
                          onChange={(e) => updateTeamMember(idx, 'bio', e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-neutral-500 uppercase">
                          Twitter URL
                        </label>
                        <input
                          type="text"
                          value={member.socialTwitter || ''}
                          onChange={(e) => updateTeamMember(idx, 'socialTwitter', e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full text-xs p-1.5 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 8: TOP ANNOUNCEMENT BAR */}
        {shouldShowSection('announcement') && (
          <div className="p-4">
            <button
              type="button"
              onClick={() => toggleSection('announcement')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-dusty-olive" />
                <span>Top Announcement Bar</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'announcement' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'announcement' && (
              <div className="mt-4 space-y-3 animate-in fade-in-50 duration-200">
                <label className="flex items-center gap-2 text-xs font-medium text-carbon-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.announcementBar.enabled}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        announcementBar: {
                          ...data.announcementBar,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-soft-linen text-dusty-olive focus:ring-dusty-olive"
                  />
                  <span>Enable Top Announcement Bar</span>
                </label>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Banner Message
                  </label>
                  <input
                    type="text"
                    value={data.announcementBar.text}
                    onChange={(e) =>
                      onChange({
                        ...data,
                        announcementBar: {
                          ...data.announcementBar,
                          text: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Action Link Text
                    </label>
                    <input
                      type="text"
                      value={data.announcementBar.linkText || ''}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          announcementBar: {
                            ...data.announcementBar,
                            linkText: e.target.value,
                          },
                        })
                      }
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Action Link URL
                    </label>
                    <input
                      type="text"
                      value={data.announcementBar.linkUrl || ''}
                      onChange={(e) =>
                        onChange({
                          ...data,
                          announcementBar: {
                            ...data.announcementBar,
                            linkUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="/app"
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 10: ABOUT VE */}
        {shouldShowSection('about') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('about')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">About Ve (Story &amp; Mission)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'about' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'about' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={aboutData.badge}
                    onChange={(e) => updateAbout('badge', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Manifesto Headline
                  </label>
                  <input
                    type="text"
                    value={aboutData.manifestoHeadline}
                    onChange={(e) => updateAbout('manifestoHeadline', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Manifesto Italic Subtitle
                  </label>
                  <input
                    type="text"
                    value={aboutData.manifestoItalic}
                    onChange={(e) => updateAbout('manifestoItalic', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none italic"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Manifesto Story Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={aboutData.manifestoDescription}
                    onChange={(e) => updateAbout('manifestoDescription', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none leading-relaxed"
                  />
                </div>

                {/* Problem Section */}
                <div className="pt-3 border-t border-soft-linen space-y-3">
                  <span className="text-xs font-semibold text-carbon-black">The Core Problem</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Problem Title
                    </label>
                    <input
                      type="text"
                      value={aboutData.problemTitle}
                      onChange={(e) => updateAbout('problemTitle', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Problem Intro
                    </label>
                    <textarea
                      rows={2}
                      value={aboutData.problemDescription}
                      onChange={(e) => updateAbout('problemDescription', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-neutral-600">
                        Problem Breakdown Points
                      </span>
                      <button
                        type="button"
                        onClick={addProblemPoint}
                        className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Plus className="w-3 h-3" /> Add Point
                      </button>
                    </div>

                    {aboutData.problemPoints.map((point, pIdx) => (
                      <div key={point.id || pIdx} className="p-2.5 bg-white rounded-lg border border-soft-linen space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) => updateProblemPoint(pIdx, 'title', e.target.value)}
                            placeholder="Point Title"
                            className="flex-1 text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => deleteProblemPoint(pIdx)}
                            className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={point.text}
                          onChange={(e) => updateProblemPoint(pIdx, 'text', e.target.value)}
                          placeholder="Point description"
                          className="w-full text-xs p-1 rounded border border-soft-linen outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solution Pillars */}
                <div className="pt-3 border-t border-soft-linen space-y-3">
                  <span className="text-xs font-semibold text-carbon-black">Operational Guarantees</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Solution Title
                    </label>
                    <input
                      type="text"
                      value={aboutData.solutionTitle}
                      onChange={(e) => updateAbout('solutionTitle', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-neutral-600">
                        Solution Pillars
                      </span>
                      <button
                        type="button"
                        onClick={addPillar}
                        className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Plus className="w-3 h-3" /> Add Pillar
                      </button>
                    </div>

                    {aboutData.pillars.map((pillar, pilIdx) => (
                      <div key={pillar.id || pilIdx} className="p-2.5 bg-white rounded-lg border border-soft-linen space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => updatePillar(pilIdx, 'title', e.target.value)}
                            placeholder="Pillar Title"
                            className="flex-1 text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                          />
                          <select
                            value={pillar.iconName || 'Sparkles'}
                            onChange={(e) => updatePillar(pilIdx, 'iconName', e.target.value)}
                            className="text-[10px] p-1 rounded border border-soft-linen bg-snow"
                          >
                            <option value="Sparkles">Sparkles</option>
                            <option value="ShieldCheck">ShieldCheck</option>
                            <option value="Truck">Truck</option>
                            <option value="Camera">Camera</option>
                            <option value="Heart">Heart</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deletePillar(pilIdx)}
                            className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => updatePillar(pilIdx, 'description', e.target.value)}
                          placeholder="Pillar Description"
                          className="w-full text-xs p-1 rounded border border-soft-linen outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-soft-linen flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Need to edit team members on this page?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSection('team');
                      if (onRouteChange) onRouteChange('/team');
                    }}
                    className="text-dusty-olive-dark font-medium hover:underline cursor-pointer"
                  >
                    Open Team Editor →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 11: CONTACT & ESCALATIONS */}
        {shouldShowSection('contact') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Contact &amp; Escalations</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'contact' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'contact' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Badge Pill
                  </label>
                  <input
                    type="text"
                    value={contactData.badge}
                    onChange={(e) => updateContact('badge', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Page Headline
                  </label>
                  <input
                    type="text"
                    value={contactData.headline}
                    onChange={(e) => updateContact('headline', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={contactData.subheadline}
                    onChange={(e) => updateContact('subheadline', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                {/* Buyer Support Card */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                  <span className="text-xs font-semibold text-carbon-black">Buyer &amp; Order Support Card</span>
                  <input
                    type="text"
                    value={contactData.supportCardTitle}
                    onChange={(e) => updateContact('supportCardTitle', e.target.value)}
                    placeholder="Support Card Title"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <textarea
                    rows={2}
                    value={contactData.supportCardDescription}
                    onChange={(e) => updateContact('supportCardDescription', e.target.value)}
                    placeholder="Description"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={contactData.supportCardHours}
                      onChange={(e) => updateContact('supportCardHours', e.target.value)}
                      placeholder="Hours (e.g. Mon-Sat)"
                      className="text-xs p-1.5 rounded border border-soft-linen outline-none"
                    />
                    <input
                      type="text"
                      value={contactData.supportCardCtaText}
                      onChange={(e) => updateContact('supportCardCtaText', e.target.value)}
                      placeholder="CTA text"
                      className="text-xs p-1.5 rounded border border-soft-linen outline-none"
                    />
                  </div>
                </div>

                {/* Merchant Partnerships Card */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                  <span className="text-xs font-semibold text-carbon-black">Merchant Partnerships Card</span>
                  <input
                    type="text"
                    value={contactData.merchantCardTitle}
                    onChange={(e) => updateContact('merchantCardTitle', e.target.value)}
                    placeholder="Merchant Card Title"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <textarea
                    rows={2}
                    value={contactData.merchantCardDescription}
                    onChange={(e) => updateContact('merchantCardDescription', e.target.value)}
                    placeholder="Description"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={contactData.merchantCardHours}
                      onChange={(e) => updateContact('merchantCardHours', e.target.value)}
                      placeholder="Hours (e.g. Mon-Fri)"
                      className="text-xs p-1.5 rounded border border-soft-linen outline-none"
                    />
                    <input
                      type="text"
                      value={contactData.merchantCardCtaText}
                      onChange={(e) => updateContact('merchantCardCtaText', e.target.value)}
                      placeholder="CTA text"
                      className="text-xs p-1.5 rounded border border-soft-linen outline-none"
                    />
                  </div>
                </div>

                {/* Official Email Inboxes */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-neutral-600">
                      Official Email Inboxes
                    </span>
                    <button
                      type="button"
                      onClick={addInbox}
                      className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Inbox
                    </button>
                  </div>

                  {contactData.inboxes.map((inbox, inIdx) => (
                    <div key={inbox.id || inIdx} className="p-2.5 bg-white rounded-lg border border-soft-linen space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={inbox.label}
                          onChange={(e) => updateInbox(inIdx, 'label', e.target.value)}
                          placeholder="Department Label"
                          className="flex-1 text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteInbox(inIdx)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="email"
                        value={inbox.email}
                        onChange={(e) => updateInbox(inIdx, 'email', e.target.value)}
                        placeholder="email@veapp.store"
                        className="w-full text-xs p-1 rounded border border-soft-linen outline-none font-mono"
                      />
                      <input
                        type="text"
                        value={inbox.description || ''}
                        onChange={(e) => updateInbox(inIdx, 'description', e.target.value)}
                        placeholder="Brief scope description"
                        className="w-full text-[11px] p-1 rounded border border-soft-linen outline-none text-neutral-600"
                      />
                    </div>
                  ))}
                </div>

                {/* Registered Office */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                  <span className="text-xs font-semibold text-carbon-black">Registered Physical Office</span>
                  <input
                    type="text"
                    value={contactData.officeName}
                    onChange={(e) => updateContact('officeName', e.target.value)}
                    placeholder="Entity Name"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <textarea
                    rows={2}
                    value={contactData.officeAddress}
                    onChange={(e) => updateContact('officeAddress', e.target.value)}
                    placeholder="Physical Street Address"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <input
                    type="text"
                    value={contactData.officeHours}
                    onChange={(e) => updateContact('officeHours', e.target.value)}
                    placeholder="Visiting Hours"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none"
                  />
                  <input
                    type="text"
                    value={contactData.officeNote}
                    onChange={(e) => updateContact('officeNote', e.target.value)}
                    placeholder="Appointment notice note"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none text-neutral-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 12: PRESS & MEDIA KIT */}
        {shouldShowSection('press') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('press')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Press &amp; Media Kit</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'press' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'press' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={pressData.badge}
                    onChange={(e) => updatePress('badge', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={pressData.title}
                    onChange={(e) => updatePress('title', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={pressData.description}
                    onChange={(e) => updatePress('description', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                {/* Boilerplate */}
                <div className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                  <span className="text-xs font-semibold text-carbon-black">Official Company Boilerplate</span>
                  <input
                    type="text"
                    value={pressData.boilerplateTitle}
                    onChange={(e) => updatePress('boilerplateTitle', e.target.value)}
                    placeholder="Boilerplate Title"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none font-semibold"
                  />
                  <textarea
                    rows={5}
                    value={pressData.boilerplateText}
                    onChange={(e) => updatePress('boilerplateText', e.target.value)}
                    placeholder="Official boilerplate text for press coverage"
                    className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none leading-relaxed"
                  />
                </div>

                {/* Color Palette Tokens */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-neutral-600">
                      Brand Color Palette Tokens
                    </span>
                    <button
                      type="button"
                      onClick={addPaletteItem}
                      className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Color
                    </button>
                  </div>

                  {pressData.palette.map((color, cIdx) => (
                    <div key={cIdx} className="p-2.5 bg-white rounded-lg border border-soft-linen flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updatePaletteItem(cIdx, 'hex', e.target.value)}
                        className="w-7 h-7 rounded border border-soft-linen cursor-pointer shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) => updatePaletteItem(cIdx, 'name', e.target.value)}
                            placeholder="Color Name"
                            className="text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                          />
                          <input
                            type="text"
                            value={color.hex}
                            onChange={(e) => updatePaletteItem(cIdx, 'hex', e.target.value)}
                            placeholder="#HEX"
                            className="text-xs font-mono p-1 border-b border-soft-linen outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={color.role}
                          onChange={(e) => updatePaletteItem(cIdx, 'role', e.target.value)}
                          placeholder="Design role"
                          className="w-full text-[10px] text-neutral-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deletePaletteItem(cIdx)}
                        className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Media Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={pressData.inquiriesEmail}
                    onChange={(e) => updatePress('inquiriesEmail', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 13: TERMS OF SERVICE */}
        {shouldShowSection('terms') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('terms')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Terms of Service</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'terms' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'terms' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Effective Date
                    </label>
                    <input
                      type="text"
                      value={termsData.effectiveDate}
                      onChange={(e) => updateTerms('effectiveDate', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Version
                    </label>
                    <input
                      type="text"
                      value={termsData.version}
                      onChange={(e) => updateTerms('version', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Governing Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={termsData.jurisdiction}
                    onChange={(e) => updateTerms('jurisdiction', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                {/* Legal Sections */}
                <div className="space-y-2 pt-2 border-t border-soft-linen">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-neutral-600">
                      Terms Clauses &amp; Sections ({termsData.sections.length})
                    </span>
                    <button
                      type="button"
                      onClick={addTermsSection}
                      className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Section
                    </button>
                  </div>

                  {termsData.sections.map((sec, sIdx) => (
                    <div key={sec.id || sIdx} className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => updateTermsSection(sIdx, 'title', e.target.value)}
                          placeholder="Section Title"
                          className="flex-1 text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteTermsSection(sIdx)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 uppercase tracking-wider">
                          Section Content (separate paragraphs with blank line)
                        </label>
                        <textarea
                          rows={4}
                          value={sec.paragraphs.join('\n\n')}
                          onChange={(e) =>
                            updateTermsSection(
                              sIdx,
                              'paragraphs',
                              e.target.value.split('\n\n').filter((p) => p.trim())
                            )
                          }
                          className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 14: PRIVACY POLICY */}
        {shouldShowSection('privacy') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('privacy')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Privacy Policy (DPPA 2019)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'privacy' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'privacy' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Effective Date
                    </label>
                    <input
                      type="text"
                      value={privacyData.effectiveDate}
                      onChange={(e) => updatePrivacy('effectiveDate', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase text-neutral-600">
                      Compliance Badge
                    </label>
                    <input
                      type="text"
                      value={privacyData.complianceBadge}
                      onChange={(e) => updatePrivacy('complianceBadge', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                    />
                  </div>
                </div>

                {/* Legal Sections */}
                <div className="space-y-2 pt-2 border-t border-soft-linen">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-neutral-600">
                      Privacy Sections ({privacyData.sections.length})
                    </span>
                    <button
                      type="button"
                      onClick={addPrivacySection}
                      className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Section
                    </button>
                  </div>

                  {privacyData.sections.map((sec, sIdx) => (
                    <div key={sec.id || sIdx} className="p-3 bg-white rounded-lg border border-soft-linen space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => updatePrivacySection(sIdx, 'title', e.target.value)}
                          placeholder="Section Title"
                          className="flex-1 text-xs font-semibold p-1 border-b border-soft-linen outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deletePrivacySection(sIdx)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 uppercase tracking-wider">
                          Section Content (separate paragraphs with blank line)
                        </label>
                        <textarea
                          rows={4}
                          value={sec.paragraphs.join('\n\n')}
                          onChange={(e) =>
                            updatePrivacySection(
                              sIdx,
                              'paragraphs',
                              e.target.value.split('\n\n').filter((p) => p.trim())
                            )
                          }
                          className="w-full text-xs p-1.5 rounded border border-soft-linen outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 15: VE JOURNAL */}
        {shouldShowSection('journal') && (
          <div className="p-4 bg-soft-linen/15">
            <button
              type="button"
              onClick={() => toggleSection('journal')}
              className="flex items-center justify-between w-full text-left font-medium text-sm text-carbon-black cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-dusty-olive" />
                <span className="font-semibold">Ve Journal (Editorial)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  openSection === 'journal' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSection === 'journal' && (
              <div className="mt-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Journal Headline
                  </label>
                  <input
                    type="text"
                    value={journalData.title}
                    onChange={(e) => updateJournal('title', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-neutral-600">
                    Journal Description
                  </label>
                  <textarea
                    rows={2}
                    value={journalData.description}
                    onChange={(e) => updateJournal('description', e.target.value)}
                    className="w-full text-xs p-2 rounded border border-soft-linen bg-white text-carbon-black outline-none"
                  />
                </div>

                {/* Editorial Categories */}
                <div className="space-y-2 pt-1 border-t border-soft-linen">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase text-neutral-600">
                      Filter Categories
                    </span>
                    <button
                      type="button"
                      onClick={addJournalCategory}
                      className="text-[11px] text-dusty-olive hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add Category
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {journalData.categories.map((cat, catIdx) => (
                      <div key={catIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateJournalCategory(catIdx, e.target.value)}
                          className="flex-1 text-xs p-1.5 rounded border border-soft-linen bg-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => deleteJournalCategory(catIdx)}
                          className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

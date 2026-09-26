import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Store, 
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact';
import { CopyEmailButton } from '@/components/ui/copy-email-button';
import { getCmsData } from '@/lib/cms/cms-service';
import { InboxesDropdown } from '@/components/contact/inboxes-dropdown';

export const metadata: Metadata = {
  title: 'Contact Ve — Kampala Customer & Vendor Support',
  description:
    'Get in touch with the Ve team in Kampala. WhatsApp instant support, merchant onboarding help, press inquiries, and digital operations coverage.',
  openGraph: {
    title: 'Contact Ve — Direct Support in Kampala',
    description: 'WhatsApp live support, merchant inquiries, and digital operations coverage across Kampala.',
    url: 'https://www.veapp.store/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export const revalidate = 60;

export default async function ContactPage() {
  const cmsData = await getCmsData();
  const contactData = cmsData.contact;

  const whatsappSupportUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Support, I have a question about my order'
  );
  const whatsappVendorUrl = CONTACT_CONFIG.getWhatsappUrl(
    'Hi Ve Team, I want to learn about becoming a merchant'
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="inline-block text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-dusty-olive/15 text-dusty-olive-dark font-semibold">
          {contactData.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
          {contactData.headline}
        </h1>
        <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
          {contactData.subheadline}
        </p>
      </div>

      {/* Primary WhatsApp Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Support */}
        <Card className="p-8 bg-snow border-soft-linen flex flex-col justify-between space-y-6 shadow-subtle">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-carbon-black">
              {contactData.supportCardTitle}
            </h2>
            <p className="text-sm text-carbon-black/70 leading-relaxed">
              {contactData.supportCardDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-carbon-black/60 pt-2">
              <Clock className="w-4 h-4 text-dusty-olive flex-shrink-0" />
              <span>{contactData.supportCardHours}</span>
            </div>
          </div>

          <div className="pt-2">
            <a href={whatsappSupportUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="primary" size="md">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                {contactData.supportCardCtaText}
              </Button>
            </a>
          </div>
        </Card>

        {/* Merchant Onboarding */}
        <Card className="p-8 bg-snow border-soft-linen flex flex-col justify-between space-y-6 shadow-subtle">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-carbon-black">
              {contactData.merchantCardTitle}
            </h2>
            <p className="text-sm text-carbon-black/70 leading-relaxed">
              {contactData.merchantCardDescription}
            </p>
            <div className="flex items-center gap-2 text-xs text-carbon-black/60 pt-2">
              <Clock className="w-4 h-4 text-dusty-olive flex-shrink-0" />
              <span>{contactData.merchantCardHours}</span>
            </div>
          </div>

          <div className="pt-2">
            <a href={whatsappVendorUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="secondary" size="md">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-dusty-olive" />
                {contactData.merchantCardCtaText}
              </Button>
            </a>
          </div>
        </Card>
      </div>

      {/* Email Directory & Operations Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Email Directory as Dropdown */}
        <Card className="p-6 bg-snow border-soft-linen md:col-span-2 shadow-subtle">
          <InboxesDropdown
            title={contactData.inboxesTitle}
            inboxes={contactData.inboxes}
          />
        </Card>

        {/* Operations & Coverage */}
        <Card className="p-6 bg-snow border-soft-linen space-y-4 flex flex-col justify-between shadow-subtle">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
              <div className="w-6 h-6 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span>{contactData.officeTitle}</span>
            </div>

            <div className="space-y-1.5 text-xs text-carbon-black/80">
              <div className="font-semibold text-carbon-black">{contactData.officeName}</div>
              <p className="leading-relaxed text-neutral-600">{contactData.officeAddress}</p>
              <p className="text-[11px] text-dusty-olive-dark font-mono pt-1">{contactData.officeHours}</p>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 border-t border-soft-linen pt-2">
            {contactData.officeNote}
          </div>
        </Card>
      </div>
    </div>
  );
}

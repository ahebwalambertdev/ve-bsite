import type { Metadata } from 'next';
import { CardSplitAccordion, type CardSplitAccordionItemData } from '@/components/ui/card-split-accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle, HelpCircle, ShieldCheck, Bike, RotateCcw, Camera, Store, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ & Support — Ve Marketplace Kampala',
  description:
    'Instant answers about safe Mobile Money payments, fast Kampala delivery, Try-On on your phone, and our easy 48-hour return policy.',
  openGraph: {
    title: 'Ve FAQ — Answers on Payments, Delivery, Try-On & Returns',
    description: 'Direct answers to how Ve protects buyers and boutiques across Kampala.',
    url: 'https://www.veapp.store/faq',
  },
};

const FAQ_DATA = [
  {
    category: 'Protected Payments & Refunds',
    icon: ShieldCheck,
    items: [
      {
        question: 'How does Ve protect my money when I buy clothes?',
        answer:
          'When you place an order, Ve holds your payment safely in the middle. The boutique is only paid after our rider brings the package to your door and you confirm you love what you ordered. If the piece doesn’t fit, looks different from the pictures, or has a fault, your money is promptly returned to your MTN Mobile Money or Airtel Money.',
      },
      {
        question: 'Which payment methods are accepted on Ve in Uganda?',
        answer:
          'Ve accepts MTN Mobile Money, Airtel Money, and Visa/Mastercard debit and credit cards. You can also choose Cash on Delivery in central Kampala, where the courier collects payment only after you have inspected the garment.',
      },
      {
        question: 'How are prices and fees displayed at checkout?',
        answer:
          'Everything is completely transparent. The total price you see on your screen before tapping pay is the exact amount deducted from your Mobile Money wallet. There are no surprise charges when the rider arrives at your door.',
      },
    ],
  },
  {
    category: 'Deliveries & Tracking',
    icon: Bike,
    items: [
      {
        question: 'How fast does delivery take in Kampala?',
        answer:
          'Orders in Central Kampala typically arrive the same day, often within hours. Deliveries to outer suburbs like Entebbe, Kira, and Mukono arrive same-day or the next morning depending on when you place your order.',
      },
      {
        question: 'Can I open and check the package before the rider leaves?',
        answer:
          'Yes, absolutely! Checking your package before the rider leaves is encouraged for every delivery on Ve. Our riders will gladly wait at your door while you verify the fabric, seams, zipper, and size before you confirm.',
      },
      {
        question: 'How much does delivery cost?',
        answer:
          'Delivery fees in Kampala start from around UGX 4,000 for central locations, with outer areas adjusted by distance. Your exact delivery fee is clearly calculated and displayed before you confirm your order.',
      },
    ],
  },
  {
    category: 'Returns & 48-Hour Refunds',
    icon: RotateCcw,
    items: [
      {
        question: 'What is Ve’s return and refund policy?',
        answer:
          'You have 48 hours from delivery to return or exchange any item that doesn’t fit or has an issue. As long as the clothes are unworn and unwashed with tags intact, our rider will pick them up from your doorstep for free, and your refund is sent straight to your Mobile Money.',
      },
      {
        question: 'How do I request a return or size exchange?',
        answer:
          'Open the Ve app, tap Your Orders, choose the item, and tap Return or Exchange. Pick your replacement size or upload a quick photo of the issue. A rider is dispatched to collect the item from your door.',
      },
    ],
  },
  {
    category: 'Try-On & Sizing',
    icon: Camera,
    items: [
      {
        question: 'How does Try-On work on my phone?',
        answer:
          'Try-On lets you see clothes on your own body before ordering. Snap a single full-length photo of yourself in the app, and Ve realistically displays how outfits look on your shape. Every new account receives free try-on looks right away to test their fits.',
      },
      {
        question: 'Are my Try-On photos kept private?',
        answer:
          'Yes, 100% private. Your photos are strictly for your eyes only. Boutiques, other shoppers, and riders never see them, and they are never posted anywhere publicly. You can also delete your fitting photo in the app anytime with one tap.',
      },
    ],
  },
  {
    category: 'Selling on Ve',
    icon: Store,
    items: [
      {
        question: 'How do I sign up to sell clothes on Ve?',
        answer:
          'You can apply at veapp.store/vendor by submitting your boutique name, shop location in Kampala, and National ID. Our merchant team will verify your boutique quickly so you can start listing clothes.',
      },
      {
        question: 'What are the merchant commission fees?',
        answer:
          'Listing outfits on Ve is completely free with no upfront joining fees or monthly charges to get started. We only earn a commission when you make a verified sale, starting as low as 6% up to 15% depending on your product category. Payments are sent straight to your Mobile Money as soon as orders are delivered.',
      },
    ],
  },
  {
    category: 'App Access & Device Compatibility',
    icon: Smartphone,
    items: [
      {
        id: 'device-compatibility',
        question: 'Questions about early access or device compatibility?',
        answer:
          'Ve is currently in private development. The app will launch across Kampala on Android 8+ and iOS 15+, optimized for low-data 3G connections.',
      },
    ],
  },
];

import { CONTACT_CONFIG } from '@/lib/contact';
import { getCmsData } from '@/lib/cms/cms-service';

export const revalidate = 60;

export default async function FAQPage() {
  const cmsData = await getCmsData();
  const publishedFaqs = (cmsData.faqs || []).filter((f) => f.isPublished);

  const displaySections = publishedFaqs.length > 0
    ? Array.from(new Set(publishedFaqs.map((f) => f.category || 'General'))).map((catName) => {
        let Icon = HelpCircle;
        const lower = catName.toLowerCase();
        if (lower.includes('payment') || lower.includes('escrow') || lower.includes('refund')) Icon = ShieldCheck;
        else if (lower.includes('deliver') || lower.includes('timing')) Icon = Bike;
        else if (lower.includes('try-on') || lower.includes('sizing')) Icon = Camera;
        else if (lower.includes('return') || lower.includes('swap')) Icon = RotateCcw;
        else if (lower.includes('boutique') || lower.includes('vendor')) Icon = Store;
        else if (lower.includes('device') || lower.includes('access') || lower.includes('compatibility')) Icon = Smartphone;

        return {
          category: catName,
          icon: Icon,
          items: publishedFaqs.filter((f) => (f.category || 'General') === catName).map((f) => ({
            id: f.id || (f.question.toLowerCase().includes('device') || f.question.toLowerCase().includes('compatibility') ? 'device-compatibility' : undefined),
            question: f.question,
            answer: f.answer,
          })),
        };
      })
    : FAQ_DATA;

  const whatsappUrl = CONTACT_CONFIG.getWhatsappUrl(
    "Hi Ve Support, I have a question that isn't in the FAQ"
  );

  // Build Schema.org FAQPage JSON-LD graph for SEO/AEO Rich Results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: displaySections.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      }))
    ),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-carbon-black tracking-tight">
          Clear answers. Zero guessing.
        </h1>
        <p className="text-base sm:text-lg text-carbon-black/75 leading-relaxed">
          Everything you need to know about how Ve protects payments, guarantees deliveries across Kampala, and handles sizing.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {displaySections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-soft-linen">
                <div className="w-8 h-8 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-carbon-black">
                  {section.category}
                </h2>
              </div>

              <CardSplitAccordion
                items={section.items.map((item, index) => {
                  const itemId =
                    (item as any).id ||
                    (item.question.toLowerCase().includes('device') ||
                    item.question.toLowerCase().includes('compatibility')
                      ? 'device-compatibility'
                      : `${section.category}-${index}`);
                  return {
                    id: itemId,
                    title: item.question,
                    content: (
                      <p className="text-sm text-carbon-black/80 leading-relaxed font-normal">
                        {item.answer}
                      </p>
                    ),
                  };
                })}
                defaultOpenId={section.category === 'Protected Payments & Refunds' ? 'Protected Payments & Refunds-0' : null}
              />
            </div>
          );
        })}
      </div>

      {/* WhatsApp Escalation Card */}
      <div className="bg-snow border border-dusty-olive/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-subtle">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-semibold text-carbon-black">
            Couldn’t find what you need?
          </h3>
          <p className="text-sm text-carbon-black/70 max-w-md">
            Our Kampala support team is available Monday through Saturday on WhatsApp for immediate order or boutique assistance.
          </p>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="md" className="whitespace-nowrap">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Support
          </Button>
        </a>
      </div>
    </div>
  );
}

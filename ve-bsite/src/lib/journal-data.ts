export interface JournalArticle {
  slug: string;
  title: string;
  category: 'Vendor Spotlight' | 'Kampala Style & Culture' | 'Consumer Guide';
  author: string;
  readTime: string;
  publishedAt: string;
  excerpt: string;
  tldr: string;
  coverImage: string;
  content: {
    sectionHeading: string;
    paragraphs: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    steps?: string[];
    callout?: {
      title: string;
      body: string;
    };
  }[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: 'how-boda-boda-delivery-works-kampala',
    title: 'How long do fashion deliveries take in Kampala?',
    category: 'Consumer Guide',
    author: 'Ahebwa & Ve Delivery Team',
    readTime: '4 min read',
    publishedAt: '2026-08-25',
    excerpt:
      'Deliveries across Kampala are fast on Ve, and riders wait while you check the package.',
    tldr:
      'Orders in Central Kampala arrive fast, and deliveries to outer suburbs arrive same-day. Every order lets you check the fabric and fit before you confirm.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'What are the delivery times across Kampala divisions?',
        paragraphs: [
          'Deliveries within Kampala’s central business district and inner neighborhoods typically arrive within hours of boutique confirmation. Riders pick up directly from verified boutiques to ensure delicate fabrics and tailored outfits arrive clean and undamaged.',
        ],
        table: {
          headers: ['Kampala Region / Suburb', 'Typical Delivery Time', 'Standard Delivery Rate', 'Weather Protection'],
          rows: [
            ['Central (Kololo, Nakasero, Kamwokya)', '2 – 3 Hours', 'UGX 5,000', 'Waterproof Cargo Bag'],
            ['Inner East (Bugolobi, Mbuya, Ntinda)', '3 – 4 Hours', 'UGX 5,000', 'Waterproof Cargo Bag'],
            ['Greater Suburbs (Kira, Namugongo, Kisasi)', 'Same Day (4 – 6 Hours)', 'UGX 7,000', 'Waterproof Cargo Bag'],
            ['Outer Urban (Entebbe, Mukono, Nansana)', 'Same Day (Order by 2 PM)', 'UGX 10,000 – 12,000', 'Waterproof Cargo Bag'],
          ],
        },
      },
      {
        sectionHeading: 'How does checking your package at delivery work?',
        paragraphs: [
          'Unlike ordinary delivery riders who drop parcels and speed off, Ve riders wait patiently so you can check your clothes before confirming.',
        ],
        steps: [
          'The rider arrives and hands you the sealed Ve package.',
          'You open the parcel and check the seams, zippers, color, and size.',
          'If you love what you ordered, you confirm delivery with the rider.',
          'If the piece doesn’t match or has an issue, you can reject it right away with zero return fees.',
        ],
      },
      {
        sectionHeading: 'What happens when afternoon rain hits Kampala?',
        paragraphs: [
          'Afternoon tropical downpours are a reality in Kampala. To ensure clothes never arrive damp, all Ve riders carry waterproof bags.',
        ],
        callout: {
          title: 'Weather Protection',
          body: 'All Ve riders carry heavy-duty waterproof bags, keeping your clothes completely dry even during heavy Kampala downpours.',
        },
      },
    ],
  },
  {
    slug: 'kampala-boutique-sizing-guide-african-body-types',
    title: 'Why do European clothing sizes fail African body proportions?',
    category: 'Kampala Style & Culture',
    author: 'Ve Design & Sizing Team',
    readTime: '5 min read',
    publishedAt: '2026-08-18',
    excerpt:
      'Standard EU and UK sizing charts assume a flatter hip-to-waist ratio than the natural silhouette of Ugandan women, causing 30% of online clothing purchases to fail at the hips or thighs.',
    tldr:
      'European fashion grading assumes a standard 10-inch difference between waist and hip circumference. Ugandan female silhouettes average a 13-to-15-inch differential. Ve’s Try-On feature previews clothing directly on your body to eliminate sizing surprises.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'How does the silhouette differential cause sizing mismatch?',
        paragraphs: [
          'When an online boutique imports UK Size 12 or EU Size 40 denim, the waistband may fit accurately while the thigh and hip measurements remain severely constricted. Conversely, sizing up to accommodate hips leaves an unsightly gap at the lower spine.',
        ],
        table: {
          headers: ['Metric Parameter', 'European Fast Fashion Standard', 'Kampala Measured Average', 'Ve Recommendation'],
          rows: [
            ['Waist-to-Hip Delta', '10.0 inches (25.4 cm)', '14.2 inches (36.1 cm)', 'Calibrated via Try-On'],
            ['Thigh Circumference (Sz M)', '21.5 inches', '24.8 inches', 'Select tailored curve cut'],
            ['Torso Length to Rise', 'Standard 11.5 inches', '13.0 inches high rise', 'High-rise silhouette match'],
          ],
        },
      },
      {
        sectionHeading: 'How to use Try-On to see your fit on your phone?',
        paragraphs: [
          'To bypass confusing brand tags, you can preview how an outfit fits your silhouette before tapping order.',
        ],
        steps: [
          'Wear everyday fitted clothes and snap a full-length photo in good light.',
          'Let Ve map your shoulder width, waist, and hip shape.',
          'Preview the outfit on your silhouette to verify the fit before ordering.',
        ],
      },
    ],
  },
  {
    slug: 'spotlight-bold-in-kampala-artisan-craft',
    title: 'How Bold in Kampala bridges handmade craft and digital commerce',
    category: 'Vendor Spotlight',
    author: 'Ve Editorial Desk',
    readTime: '6 min read',
    publishedAt: '2026-08-04',
    excerpt:
      'An intimate look inside one of Kampala’s celebrated boutique fashion houses, and how protected payments enabled them to scale online orders without fear of delivery loss.',
    tldr:
      'Artisanal Ugandan fashion thrives on tactile uniqueness. Bold in Kampala partnered with Ve to eliminate delivery dispute anxiety, expanding their customer reach from Kololo walk-ins to buyers across Entebbe and Mukono.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'What made social media selling unsustainable for boutique artisans?',
        paragraphs: [
          'For independent designers producing limited-run collections on Cooper Road in Kisementi, a lost or damaged garment represents an irreplaceable investment of artisan time. Traditional social media sales required trusting unvetted couriers with precious inventory.',
        ],
      },
      {
        sectionHeading: 'How do protected payments change the merchant experience?',
        paragraphs: [
          'With Ve holding customer payments safely in escrow, boutiques know the order is genuine before the outfit leaves the shop. Payouts arrive automatically via Mobile Money on reliable schedules.',
        ],
        callout: {
          title: 'Artisan Quote',
          body: '“With Ve, we never spend our mornings arguing over delivery rates or asking buyers for transaction IDs. The rider arrives, the order is verified, and the money arrives straight in our Mobile Money.”',
        },
      },
    ],
  },
  {
    slug: 'from-owino-bales-to-kisementi-streetwear',
    title: 'From Owino Bales to Kisementi Pop-Ups: How Kampala’s Vintage Curators Changed Streetwear',
    category: 'Kampala Style & Culture',
    author: 'Ve Streetwear Desk',
    readTime: '5 min read',
    publishedAt: '2026-09-02',
    excerpt:
      'Inside the 9 AM bale openings at St. Balikuddembe (Owino) Market, where young curators unearth 90s archive grails, restore them, and bring curated vintage to weekend pop-ups at MoTIV Bugolobi.',
    tldr:
      'Kampala’s secondhand economy (mitumba) has evolved from chaotic market stalls into a curated streetwear movement. Curators spend hours picking, dry-cleaning, and styling pieces, but traditional Instagram sales left them vulnerable to ghost buyers. Ve provides verified doorstep delivery and guaranteed Mobile Money escrow.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'What happens during the 9:00 AM bale openings in Owino?',
        paragraphs: [
          'Every week across St. Balikuddembe Market, 50-kilogram sealed bales of grade-A vintage clothing arrive from shipping containers. Between 9:00 AM and 11:00 AM, hundreds of independent fashion hunters crowd narrow aisles as vendors slash through plastic strapping with box cutters.',
          'The modern Kampala vintage curator is looking for specific pieces: vintage heavyweight Carhartt workwear, rare 90s European football jerseys, Japanese selvedge denim, and authentic leather biker jackets that can’t be found anywhere else in East Africa.',
        ],
      },
      {
        sectionHeading: 'How curated vintage made the leap to MoTIV Bugolobi and Kisementi',
        paragraphs: [
          'Rather than leaving these rare finds crumpled in market stalls, young entrepreneurs wash, mend, and style them for curated pop-up markets at creative spaces like MoTIV on Old Port Bell Road and design boutiques in Kisementi. What used to be considered budget shopping has become Kampala’s most influential youth fashion subculture.',
        ],
        callout: {
          title: 'The Curator’s Dilemma',
          body: '“Finding a 1994 vintage jacket in Owino takes 4 hours of digging. Losing it because a buyer on Instagram sent a fake mobile money screenshot or an unverified rider vanished with it is heartbreaking. Ve protects both the seller and the buyer.”',
        },
      },
    ],
  },
  {
    slug: 'navigating-kwanjula-ceremony-tailoring',
    title: 'The Kwanjula Countdown: Why Ceremony Fashion in Kampala is Moving to Verified Ready-to-Wear',
    category: 'Consumer Guide',
    author: 'Ve Cultural Desk',
    readTime: '6 min read',
    publishedAt: '2026-09-12',
    excerpt:
      'From Kiyembe Lane fabric rolls to modern Buganda barkcloth (olubugo) waistcoats, how Kampala wedding and introduction guests are escaping the dreaded Friday-night tailor delay.',
    tldr:
      'Kwanjula (introduction) and wedding season in Kampala traditionally meant high stress: commissioning custom tailors on Kiyembe Lane and praying the outfit would be ready before Saturday morning. Ve’s curated ready-to-wear designers and doorstep fitting allow guests to order verified garments that arrive days in advance.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'The chronic Friday-night tailor panic in Kampala',
        paragraphs: [
          'Anyone who has attended an introduction ceremony in Kampala knows the ritual: rushing through Friday traffic down to Kiyembe Lane or Buganda Road, only to find your tailor still cutting fabric at 7:00 PM for an event starting at 10:00 AM the next morning.',
          'As traditional ceremonies blend with modern celebratory aesthetics—incorporating contemporary linen cuts, sleek Kanzu tailoring, and organic barkcloth detailing—Ugandan designers are creating premium, ready-to-wear collections with standardized sizing.',
        ],
        table: {
          headers: ['Shopping Route', 'Turnaround Time', 'Fit Risk', 'Payment Security'],
          rows: [
            ['Traditional Kiyembe Bespoke', '2 to 4 Weeks', 'High (Last-minute alterations)', 'Upfront Cash / MoMo deposit'],
            ['Instagram DM Sellers', '3 to 5 Days', 'Very High (“What I ordered vs Got”)', 'Unprotected advance transfer'],
            ['Ve Verified Boutiques', '2 to 4 Hours', 'Zero (Doorstep fit verification)', 'Escrow-protected Mobile Money'],
          ],
        },
      },
      {
        sectionHeading: 'How doorstep verification saves ceremony weekends',
        paragraphs: [
          'With Ve’s Doorstep Verification, ceremony guests can order an outfit on Thursday, try it on while the rider waits, inspect the hem and lining, and confirm delivery. If the fit isn’t perfect, an exchange or return happens immediately without losing money or missing the ceremony.',
        ],
      },
    ],
  },
];

export async function getJournalArticles(): Promise<JournalArticle[]> {
  return JOURNAL_ARTICLES;
}

export async function getJournalArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const articles = await getJournalArticles();
  return articles.find((a) => a.slug === slug) || null;
}

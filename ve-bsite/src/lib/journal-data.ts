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
      'Deliveries across Kampala are fast on Ve, backed by protected payments and easy returns.',
    tldr:
      'Orders in Central Kampala arrive fast, and deliveries to outer suburbs arrive same-day. Every order is backed by protected payments and easy 48-hour returns.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'What are the delivery times across Kampala divisions?',
        paragraphs: [
          'Deliveries within Kampala’s central business district and inner neighborhoods typically arrive within hours of boutique confirmation. Riders pick up directly from verified boutiques to ensure delicate fabrics and tailored outfits arrive clean and undamaged.',
        ],
        table: {
          headers: ['Kampala Region / Suburb', 'Typical Delivery Time', 'Standard Delivery Rate', 'Courier Service'],
          rows: [
            ['Central (Kololo, Nakasero, Kamwokya)', '2 – 3 Hours', 'UGX 5,000', 'Dedicated Ve Rider'],
            ['Inner East (Bugolobi, Mbuya, Ntinda)', '3 – 4 Hours', 'UGX 5,000', 'Dedicated Ve Rider'],
            ['Greater Suburbs (Kira, Namugongo, Kisasi)', 'Same Day (4 – 6 Hours)', 'UGX 7,000', 'Dedicated Ve Rider'],
            ['Outer Urban (Entebbe, Mukono, Nansana)', 'Same Day (Order by 2 PM)', 'UGX 10,000 – 12,000', 'Dedicated Ve Rider'],
          ],
        },
      },
      {
        sectionHeading: 'How do deliveries and returns work?',
        paragraphs: [
          'Ve riders deliver orders directly to your door across Kampala, so you get your fashion quickly and safely.',
        ],
        steps: [
          'Your rider arrives and hands you the sealed Ve package.',
          'Try your clothes on comfortably at home.',
          'If you love what you ordered, keep your pieces and enjoy your new look.',
          'If you need a different size or wish to return, initiate an exchange in the app within 48 hours for a quick rider pickup.',
        ],
      },
      {
        sectionHeading: 'What makes Ve deliveries reliable across Kampala?',
        paragraphs: [
          'From peak-hour traffic on Jinja Road to sudden weather shifts, Ve coordinates direct deliveries from local boutiques straight to your gate.',
        ],
        callout: {
          title: 'Dedicated Couriers',
          body: 'Ve couriers are dedicated and trained, ensuring your clothes arrive carefully handled and on time.',
        },
      },
    ],
  },
  {
    slug: 'kampala-boutique-sizing-guide-african-body-types',
    title: 'Navigating boutique clothing sizes in Kampala',
    category: 'Kampala Style & Culture',
    author: 'Ve Design Team',
    readTime: '5 min read',
    publishedAt: '2026-08-18',
    excerpt:
      'Different boutiques and international brands use different sizing standards, making online clothing purchases tricky without seeing the style first.',
    tldr:
      'Brand sizing varies widely between fashion labels. With Ve’s Try-On, you can see how an outfit looks on you before ordering so you can choose styles with confidence.',
    coverImage: '/images/hero-kampala-street.webp',
    content: [
      {
        sectionHeading: 'Why size tags differ across boutiques',
        paragraphs: [
          'When boutiques stock pieces from different regions—UK, EU, US, and local designers—the same size number can fit differently. Checking garment details and seeing how the style looks on you helps you make the right pick.',
        ],
        table: {
          headers: ['Garment Type', 'Fit Consideration', 'What to Look For', 'Ve Experience'],
          rows: [
            ['Fitted Denim', 'Waist and hip proportion', 'Check waist & rise specifications', 'Preview look with Try-On'],
            ['Tailored Dresses', 'Torso and curve balance', 'Select cut that matches your preference', 'Preview look with Try-On'],
            ['Structured Blazers', 'Shoulder and chest width', 'Review boutique measurement notes', 'Preview look with Try-On'],
          ],
        },
      },
      {
        sectionHeading: 'How to use Try-On to see how clothes look on you',
        paragraphs: [
          'Try-On is built to show you how an outfit looks on you right from your phone before you place an order. It is designed purely to preview styles and aesthetics, not as a sizing calculator.',
        ],
        steps: [
          'Snap a photo on your phone in good lighting.',
          'Select any boutique outfit you want to preview.',
          'See how the outfit looks on you before you order.',
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
          'With Ve holding customer payments safely, boutiques know the order is genuine before the outfit leaves the shop. Payouts arrive automatically via Mobile Money on reliable schedules.',
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
      'Kampala’s secondhand economy (mitumba) has evolved from chaotic market stalls into a curated streetwear movement. Curators spend hours picking, dry-cleaning, and styling pieces, but traditional Instagram sales left them vulnerable to ghost buyers. Ve provides verified doorstep delivery and guaranteed Mobile Money payment protection.',
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
      'Kwanjula (introduction) and wedding season in Kampala traditionally meant high stress: commissioning custom tailors on Kiyembe Lane and praying the outfit would be ready before Saturday morning. Ve’s curated ready-to-wear designers and easy 48-hour returns allow guests to order verified garments that arrive days in advance.',
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
            ['Ve Verified Boutiques', '2 to 4 Hours', 'Easy 48-Hour Returns', 'Protected Mobile Money'],
          ],
        },
      },
      {
        sectionHeading: 'How fast delivery and easy returns save ceremony weekends',
        paragraphs: [
          'With Ve, ceremony guests can order ready-to-wear outfits days in advance and try them on at home. If you need a different size or style, quick 48-hour exchanges let you get the right piece without stress before your event.',
        ],
      },
    ],
  },
  {
    slug: 'saturday-arcade-hustle-vs-online-comfort',
    title: 'The Saturday Arcade Hustle vs. At-Home Comfort',
    category: 'Consumer Guide',
    author: 'Ve Style & City Desk',
    readTime: '4 min read',
    publishedAt: '2026-09-18',
    excerpt:
      'Over 55% of Kampala shoppers say finding clothes in downtown arcades takes too long. Here is why at-home browsing and Try-On are taking over.',
    tldr:
      'Fighting Kampala downtown traffic, sweltering arcades, and aggressive bargaining eats up entire Saturdays. Ve brings verified boutique inventory to your phone with Try-On and same-day delivery.',
    coverImage: '/images/boutique-atelier.jpg',
    content: [
      {
        sectionHeading: 'The 4-hour downtown endurance test',
        paragraphs: [
          'Anyone who has spent a Saturday afternoon winding through Gazaland, Pioneer Mall, or Park Enkadde knows the fatigue: stifling stairwells, boda-boda gridlock, and vendors pulling your sleeve. In a survey of 140+ Kampala shoppers, 55.8% cited "takes too long to find things" as their number one shopping headache.',
          'Another 36% report leaving empty-handed because finding the exact color, style, or size is like searching for a needle in a haystack.',
        ],
      },
      {
        sectionHeading: 'Comfort, trust, and seeing how it looks from home',
        paragraphs: [
          'Instead of sweating through downtown corridors, Ve lets you browse verified Kampala boutiques from your couch. With Try-On, you snap a photo in private and see how an outfit looks on you before buying.',
          'Orders arrive straight to your door across Kampala on the same day. If the fit isn’t what you wanted, you have 48 hours for a quick exchange or hassle-free return.',
        ],
        callout: {
          title: 'Comfort First',
          body: 'Shopping for fashion should feel exciting, not exhausting. When you can see the look on your phone and try it on comfortably in your bedroom, you save both your Saturday and your peace of mind.',
        },
      },
    ],
  },
  {
    slug: 'shein-overseas-brokers-vs-local-kampala-boutiques',
    title: 'The 3-Week Broker Trap: Why Kampala Is Returning to Local Boutiques',
    category: 'Consumer Guide',
    author: 'Ve Editorial Desk',
    readTime: '5 min read',
    publishedAt: '2026-09-20',
    excerpt:
      'Waiting 4 weeks for overseas packages only to receive wrong sizes with zero return options has pushed Kampala fashion lovers back to verified local boutiques.',
    tldr:
      'Overseas brokers charge hefty markups, take 2 to 4 weeks to deliver, and make returns nearly impossible. Ve connects you directly with Kampala’s best boutiques for same-day delivery and 48-hour returns.',
    coverImage: '/images/how-it-works-discover.jpeg',
    content: [
      {
        sectionHeading: 'The overseas shipping lottery',
        paragraphs: [
          'Ordering through overseas brokers on Shein or AliExpress looks tempting until reality sets in: you pay upfront, wait 2 to 4 weeks for air cargo clearing, and pay extra broker handling fees upon arrival in Kampala.',
          'When the package finally arrives, one in three shoppers discovers the size is completely wrong or the fabric looks nothing like the edited studio pictures. And the biggest catch? Returns are virtually impossible once the item arrives in Uganda.',
        ],
        table: {
          headers: ['Shopping Channel', 'Wait Time', 'Size & Look Assurance', 'Return Policy'],
          rows: [
            ['Overseas Broker / Shein', '2 – 4 Weeks', 'Blind purchase from model photos', 'No returns or expensive re-shipping'],
            ['Instagram DM Sellers', '1 – 3 Days', 'Risk of fake or filtered photos', 'Rarely accepted / dispute prone'],
            ['Ve Local Boutiques', '2 – 4 Hours (Same Day)', 'Try-On preview on your phone', 'Guaranteed 48-hour easy returns'],
          ],
        },
      },
      {
        sectionHeading: 'Real clothes, real boutiques, safe returns',
        paragraphs: [
          'Kampala already has exceptional fashion curators, designers, and boutique owners stocking high-quality pieces right here in town. Ve brings their inventory to your screen, lets you preview looks with Try-On, delivers to your gate same-day, and gives you 48 hours to exchange if needed.',
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

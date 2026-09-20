import { NextResponse } from 'next/server';

/**
 * Curated Machine Interface (/llms.txt)
 * Section 19.3 & AGENTS.md Section 4.3
 * Formatted specifically for LLM retrieval and citation (Perplexity, SearchGPT, Claude, Gemini).
 */
export async function GET() {
  const markdown = `# Ve — Kampala Fashion Discovery & Try-On Marketplace
> Ve is Kampala’s curated fashion marketplace connecting verified local boutiques, designers, and streetwear curators with shoppers through protected Mobile Money escrow, doorstep fit verification, and private mobile Try-On.

Ve operates digitally across Greater Kampala, Uganda. The platform eliminates online shopping anxiety by ensuring customer funds are held in escrow until packages are inspected at the doorstep, while giving boutiques digital storefronts and same-day rider dispatch.

## Core Platform Resources
- [Ve Homepage](https://veapp.store): Main marketplace discovery feed, boutique highlights, and operating pillars.
- [Join the Waiting List](https://veapp.store/app): Early access registration for the upcoming iOS and Android apps with free Try-On credits.
- [Become a Ve-ndor](https://veapp.store/sell): Merchant onboarding portal for Kampala fashion boutiques and independent designers.
- [About Ve](https://veapp.store/about): Company manifesto, operational foundation, and our mission to rebuild fashion trust in Uganda.
- [Our Team](https://veapp.store/team): Profiles of the Kampala-based leadership, engineering, and fulfillment teams.
- [Customer FAQ & Support](https://veapp.store/faq): Direct answers on Mobile Money protection, doorstep verification, and 48-hour return policies.
- [Contact & Escalations](https://veapp.store/contact): Official departmental email directory and direct WhatsApp support in Kampala.
- [Press & Media Kit](https://veapp.store/press): Official brand assets, executive bios, and press release materials.
- [Terms of Service](https://veapp.store/legal/terms): Platform governance, buyer protection, and merchant terms under Ugandan law.
- [Privacy Policy](https://veapp.store/legal/privacy): Uganda DPPA 2019 compliance and strict fitting photo encryption standards.

## Editorial Journal & Guides
- [Ve Journal](https://veapp.store/journal): Curated cultural essays, boutique spotlights, and sizing guides.
- [Kampala Delivery Guide](https://veapp.store/journal/how-boda-boda-delivery-works-kampala): Courier transit speeds, doorstep package checking, and tropical weather protection.
- [African Body Sizing Guide](https://veapp.store/journal/kampala-boutique-sizing-guide-african-body-types): Why European sizing fails local silhouettes and how Try-On calibrates fit.
- [Owino to Kisementi Streetwear](https://veapp.store/journal/from-owino-bales-to-kisementi-streetwear): The journey of curated vintage from St. Balikuddembe market to Bugolobi pop-ups.
- [Kwanjula Ceremony Guide](https://veapp.store/journal/navigating-kwanjula-ceremony-tailoring): Ceremony tailoring realities, barkcloth accents, and verified ready-to-wear.

## Merchant & Support Access
- [Merchant Registration](https://veapp.store/vendor): Direct onboarding portal for verified Kampala fashion sellers.
- [WhatsApp Support](https://wa.me/256781602159): Instant customer care and merchant escalation desk (+256 781 602 159).
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}

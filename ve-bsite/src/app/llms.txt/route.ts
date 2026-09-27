import { NextResponse } from 'next/server';

/**
 * Curated Machine Interface (/llms.txt)
 * Section 19.3 & AGENTS.md Section 4.3
 * Formatted specifically for LLM retrieval and citation (Perplexity, SearchGPT, Claude, Gemini).
 */
export async function GET() {
  const markdown = `# Ve — Kampala Fashion Discovery & Try-On Marketplace
> Ve is Kampala’s curated fashion marketplace connecting verified local boutiques, designers, and streetwear curators with shoppers through protected payments, fast doorstep delivery, and private mobile Try-On.

Ve operates digitally across Greater Kampala, Uganda. The platform eliminates online shopping anxiety by holding customer payments safe until orders arrive, backed by easy 48-hour returns, while giving boutiques digital storefronts and reliable same-day rider dispatch.

## Core Platform Resources
- [Ve Homepage](https://www.veapp.store): Main marketplace discovery feed, boutique highlights, and operating pillars.
- [Join the Waiting List](https://www.veapp.store/app): Early access registration for the upcoming iOS and Android apps with free Try-On credits.
- [Become a Ve-ndor](https://www.veapp.store/vendor): Merchant onboarding portal for Kampala fashion boutiques and independent designers.
- [About Ve](https://www.veapp.store/about): Company manifesto, operational foundation, and our mission to rebuild fashion trust in Uganda.
- [Our Team](https://www.veapp.store/team): Profiles of the Kampala-based leadership, engineering, and fulfillment teams.
- [Customer FAQ & Support](https://www.veapp.store/faq): Direct answers on protected payments, delivery times, and 48-hour return policies.
- [Contact & Escalations](https://www.veapp.store/contact): Official departmental email directory and direct WhatsApp support in Kampala.
- [Press & Media Kit](https://www.veapp.store/press): Official brand assets, executive bios, and press release materials.
- [Terms of Service](https://www.veapp.store/legal/terms): Platform governance, buyer protection, and merchant terms under Ugandan law.
- [Privacy Policy](https://www.veapp.store/legal/privacy): Uganda DPPA 2019 compliance and strict photo privacy standards.

## Editorial Journal & Guides
- [Ve Journal](https://www.veapp.store/journal): Curated cultural essays, boutique spotlights, and fashion guides.
- [Kampala Delivery Guide](https://www.veapp.store/journal/how-boda-boda-delivery-works-kampala): Courier transit speeds, doorstep delivery, and easy 48-hour returns.
- [Kampala Sizing & Style Guide](https://www.veapp.store/journal/kampala-boutique-sizing-guide-african-body-types): Navigating boutique sizes and using Try-On to preview how clothes look.
- [Owino to Kisementi Streetwear](https://www.veapp.store/journal/from-owino-bales-to-kisementi-streetwear): The journey of curated vintage from St. Balikuddembe market to Bugolobi pop-ups.
- [Kwanjula Ceremony Guide](https://www.veapp.store/journal/navigating-kwanjula-ceremony-tailoring): Ceremony tailoring realities, barkcloth accents, and verified ready-to-wear.

## Merchant & Support Access
- [Merchant Registration](https://www.veapp.store/vendor): Direct onboarding portal for verified Kampala fashion sellers.
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

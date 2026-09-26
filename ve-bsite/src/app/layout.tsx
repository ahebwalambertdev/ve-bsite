import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ConsentBanner } from '@/components/layout/consent-banner';
import { WebVitals } from '@/lib/web-vitals';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCmsData } from '@/lib/cms/cms-service';

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Ve Apparel: Fashion, Found | Own your look',
    template: '%s | Ve',
  },
  description:
    'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
  metadataBase: new URL('https://www.veapp.store'),
  openGraph: {
    type: 'website',
    siteName: 'Ve',
    title: 'Ve Apparel: Fashion, Found | Own your look',
    description:
      'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
    url: 'https://www.veapp.store',
    images: [
      {
        url: '/api/og?title=Fashion%2C%20Found%20in%20Kampala&category=Verified%20Fashion%20Marketplace',
        width: 1200,
        height: 630,
        alt: 'Ve — Kampala Fashion Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ve Apparel: Fashion, Found | Own your look',
    description:
      'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
    images: [
      '/api/og?title=Fashion%2C%20Found%20in%20Kampala&category=Verified%20Fashion%20Marketplace',
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
  alternates: {
    canonical: 'https://www.veapp.store',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const cmsData = await getCmsData();

  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable} overflow-x-hidden max-w-[100vw]`}>
      <head>
        {/* Curated Machine Interface Link for LLM Discovery (Perplexity, ChatGPT, Claude) */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context" />

        {/* Global Structured Knowledge Graph for Search & AI Answer Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.veapp.store/#organization',
                  name: 'Ve',
                  legalName: 'Ve Technologies Ltd',
                  alternateName: ['Ve Apparel', 'Ve Uganda', 'Ve Marketplace'],
                  url: 'https://www.veapp.store',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.veapp.store/icon.svg',
                    caption: 'Ve Logo',
                  },
                  description:
                    'Kampala’s curated fashion marketplace featuring verified local boutiques, doorstep fit verification, and private Try-On.',
                  sameAs: [
                    'https://www.instagram.com/veapp.store',
                    'https://www.tiktok.com/@veapp.store',
                    'https://x.com/veapp_store',
                  ],
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Kampala',
                    addressCountry: 'UG',
                  },
                  knowsAbout: [
                    'Kampala Fashion Boutiques',
                    'Uganda Online Shopping',
                    'Doorstep Try-On Fitting',
                    'Mobile Money Protected Escrow Payments',
                    'African Streetwear and Traditional Ceremony Tailoring',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+256781602159',
                    contactType: 'customer support',
                    areaServed: 'UG',
                    availableLanguage: ['en', 'lg'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.veapp.store/#website',
                  url: 'https://www.veapp.store',
                  name: 'Ve Apparel',
                  alternateName: ['Ve', 'Ve Kampala Fashion'],
                  description:
                    'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
                  publisher: {
                    '@id': 'https://www.veapp.store/#organization',
                  },
                  inLanguage: 'en',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-snow text-carbon-black font-sans antialiased selection:bg-soft-linen selection:text-carbon-black overflow-x-hidden max-w-[100vw] w-full">
        <Header initialNav={cmsData.navigation} />
        <div className="flex-1 w-full">{children}</div>
        <Footer initialNav={cmsData.navigation} />
        <ConsentBanner />
        <WebVitals />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}

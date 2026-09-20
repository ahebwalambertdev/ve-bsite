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
    default: 'Ve: Fashion, Found | Own your look',
    template: '%s | Ve',
  },
  description:
    'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
  metadataBase: new URL('https://www.veapp.store'),
  openGraph: {
    type: 'website',
    siteName: 'Ve',
    title: 'Ve: Fashion, Found | Own your look',
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
    title: 'Ve: Fashion, Found | Own your look',
    description:
      'Verified Kampala boutiques with Try-On, protected payments, and fast doorstep delivery.',
    images: [
      '/api/og?title=Fashion%2C%20Found%20in%20Kampala&category=Verified%20Fashion%20Marketplace',
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
        {/* Organization Schema for Google Knowledge Graph and AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Ve',
              legalName: 'Ve Technologies Ltd',
              url: 'https://www.veapp.store',
              logo: 'https://www.veapp.store/icon.svg',
              description:
                'Kampala’s curated fashion marketplace featuring verified local boutiques, doorstep fit verification, and private Try-On.',
              sameAs: [
                'https://www.instagram.com/veapp.store',
                'https://www.tiktok.com/@veapp.store',
                'https://x.com/veapp_store',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+256781602159',
                contactType: 'customer support',
                areaServed: 'UG',
                availableLanguage: ['en'],
              },
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

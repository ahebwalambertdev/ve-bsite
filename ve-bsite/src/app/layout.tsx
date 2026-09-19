import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
    'Discover verified Kampala fashion boutiques with Try-On. Fast doorstep delivery, protected Mobile Money payments, and easy 48-hour returns.',
  metadataBase: new URL('https://veapp.store'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
              url: 'https://veapp.store',
              logo: 'https://veapp.store/icon.svg',
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

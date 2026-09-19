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
  title: 'Ve — Fashion, Found | Kampala Boutiques & Try-On',
  description:
    'Discover verified Kampala fashion boutiques with Try-On. Fast doorstep delivery, protected Mobile Money payments, and easy 48-hour returns.',
  metadataBase: new URL('https://ve.ug'),
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
        {/* Google Consent Mode v2 Default-Denied Initializer (§15.2) */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
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

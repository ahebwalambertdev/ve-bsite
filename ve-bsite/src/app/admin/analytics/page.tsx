import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/admin-nav';
import { SurveyCharts } from '@/components/admin/survey-charts';

export const metadata: Metadata = {
  title: 'Market Insights & Survey Analytics — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            Survey Analytics &amp; Market Insights
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Privacy-safe behavioral distributions collected from the app waitlist and vendor onboarding surveys.
          </p>
        </div>

        <SurveyCharts />
      </main>
    </div>
  );
}

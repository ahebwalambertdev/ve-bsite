import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/admin-nav';
import { JournalList } from '@/components/admin/journal-list';

export const metadata: Metadata = {
  title: 'Journal Publications — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default function AdminJournalPage() {
  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            Ve Journal Management
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Author and publish editorial stories, Kampala shopping guides, and merchant spotlights to `/journal`.
          </p>
        </div>

        <JournalList />
      </main>
    </div>
  );
}

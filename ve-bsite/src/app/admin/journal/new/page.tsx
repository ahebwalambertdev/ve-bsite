import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/admin-nav';
import { JournalEditor } from '@/components/admin/journal-editor';

export const metadata: Metadata = {
  title: 'Write Journal Article — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default function NewJournalArticlePage() {
  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            New Journal Publication
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Compose and format an editorial story for the public Ve Journal.
          </p>
        </div>

        <JournalEditor />
      </main>
    </div>
  );
}

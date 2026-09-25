import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/admin-nav';
import { LeadsTable } from '@/components/admin/leads-table';

export const metadata: Metadata = {
  title: 'Waitlist Leads — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            App Waitlist &amp; Early Access Leads
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Registered shoppers and boutiques awaiting the Kampala mobile application rollout.
          </p>
        </div>

        <LeadsTable />
      </main>
    </div>
  );
}

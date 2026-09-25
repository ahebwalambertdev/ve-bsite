import { Metadata } from 'next';
import { AdminNav } from '@/components/admin/admin-nav';
import { VendorsTable } from '@/components/admin/vendors-table';

export const metadata: Metadata = {
  title: 'Vendor Applications — Ve Admin Portal',
  robots: { index: false, follow: false },
};

export default function AdminVendorsPage() {
  return (
    <div className="min-h-screen bg-snow text-carbon-black">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-normal text-carbon-black tracking-tight">
            Boutique Vendor Applications
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Review onboarding requests from Kampala fashion houses, verify stock size, and connect directly on WhatsApp.
          </p>
        </div>

        <VendorsTable />
      </main>
    </div>
  );
}

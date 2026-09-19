 import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass, Download, Store, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full text-center">
        <h1 className="font-serif text-5xl sm:text-6xl font-normal text-carbon-black tracking-tight mb-4">
          Lost in Kampala?
        </h1>
        
        <p className="text-base sm:text-lg text-carbon-black/70 mb-10 max-w-md mx-auto leading-relaxed">
          The page or product link you requested may have moved or expire. Let’s get you back on track.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
          <Link
            href="/app"
            className="p-4 rounded-xl border border-soft-linen bg-snow hover:border-dusty-olive transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black group-hover:bg-dusty-olive group-hover:text-snow transition-colors">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-carbon-black">Join Waiting List</div>
              <div className="text-xs text-carbon-black/60">Mobile app coming soon</div>
            </div>
          </Link>

          <Link
            href="/sell"
            className="p-4 rounded-xl border border-soft-linen bg-snow hover:border-dusty-olive transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black group-hover:bg-dusty-olive group-hover:text-snow transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-carbon-black">Become a Ve-ndor</div>
              <div className="text-xs text-carbon-black/60">Boutique merchant portal</div>
            </div>
          </Link>

          <Link
            href="/team"
            className="p-4 rounded-xl border border-soft-linen bg-snow hover:border-dusty-olive transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black group-hover:bg-dusty-olive group-hover:text-snow transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-carbon-black">Our Team</div>
              <div className="text-xs text-carbon-black/60">Meet the humans building Ve</div>
            </div>
          </Link>

          <Link
            href="/faq"
            className="p-4 rounded-xl border border-soft-linen bg-snow hover:border-dusty-olive transition-colors flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-soft-linen/50 flex items-center justify-center text-carbon-black group-hover:bg-dusty-olive group-hover:text-snow transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-carbon-black">FAQ & Support</div>
              <div className="text-xs text-carbon-black/60">Direct answers to common questions</div>
            </div>
          </Link>
        </div>

        <Link href="/">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

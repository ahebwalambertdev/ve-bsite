export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-12 w-3/4 max-w-xl bg-soft-linen/80 rounded-xl mb-4" />
      <div className="h-5 w-1/2 max-w-md bg-soft-linen/50 rounded-lg mb-8" />
      
      {/* Visual content skeleton */}
      <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-soft-linen/40 rounded-2xl mb-12" />
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-soft-linen/30 rounded-xl" />
        <div className="h-48 bg-soft-linen/30 rounded-xl" />
        <div className="h-48 bg-soft-linen/30 rounded-xl" />
      </div>
    </div>
  );
}

import Skeleton from '../Skeleton';

export default function CartSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-8 w-48" />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left - cart items */}
          <div className="space-y-4 lg:col-span-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <Skeleton className="h-24 w-24 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-5 w-1/3" />
                  <div className="mt-auto flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - summary */}
          <div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Skeleton className="h-5 w-32" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="mt-6 h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
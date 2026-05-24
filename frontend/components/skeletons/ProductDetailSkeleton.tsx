import Skeleton from '../Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <Skeleton className="aspect-square rounded-lg" />

          {/* Info */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-9 w-1/2" />

            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>

            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <Skeleton className="mt-6 h-12 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
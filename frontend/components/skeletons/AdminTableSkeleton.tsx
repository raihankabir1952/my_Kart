import Skeleton from '../Skeleton';

export default function AdminTableSkeleton() {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="mt-6 h-10 w-full max-w-md" />

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b bg-gray-50 p-4">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-12 w-12 flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
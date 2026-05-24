import Skeleton from '../Skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Image */}
      <Skeleton className="aspect-square rounded-none" />

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Category */}
        <Skeleton className="h-3 w-16" />

        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* Price */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Button */}
        <Skeleton className="mt-2 h-9 w-full" />
      </div>
    </div>
  );
}
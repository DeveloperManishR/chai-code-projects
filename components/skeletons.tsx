import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-border/60" />
      <div className="space-y-2">
        <div className="h-2.5 w-16 animate-pulse rounded-full bg-border/60" />
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-border/60" />
          <div className="h-3.5 w-12 animate-pulse rounded-full bg-border/60" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-full bg-border/50" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

import { ProductGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-2xl space-y-3">
        <div className="h-3 w-24 animate-pulse rounded-full bg-border/60" />
        <div className="h-12 w-64 animate-pulse rounded-2xl bg-border/60" />
        <div className="h-3 w-96 animate-pulse rounded-full bg-border/60" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}

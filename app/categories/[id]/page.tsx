import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/api";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { Suspense } from "react";
import type { CategoryWithProducts, Product } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getProductsByCategory(id, 1, 1);
    return {
      title: data.category?.name || "Collection",
      description: `Pieces from the ${data.category?.name || "collection"}.`,
    };
  } catch {
    return { title: "Collection" };
  }
}

type CollectionState =
  | { kind: "ready"; category: CategoryWithProducts["category"] | undefined; products: Product[]; totalProducts: number }
  | { kind: "empty" }
  | { kind: "error" };

async function loadCollection(id: string): Promise<CollectionState | "notFound"> {
  try {
    const data = await getProductsByCategory(id, 1, 60);
    if (!data.products?.length) {
      return { kind: "empty" };
    }
    return {
      kind: "ready",
      category: data.category,
      products: data.products,
      totalProducts: data.totalProducts,
    };
  } catch {
    return "notFound";
  }
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const state = await loadCollection(id);
  if (state === "notFound") notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            Collection
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {state.kind === "ready" && state.category?.name
              ? state.category.name
              : "Collection"}
            .
          </h1>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M11 19l-7-7 7-7" />
          </svg>
          All collections
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="mt-6">
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        {state.kind === "ready" ? (
          <>
            <p className="mb-6 text-sm text-muted">
              <span className="font-mono tabular-nums text-ink">
                {state.totalProducts}
              </span>{" "}
              {state.totalProducts === 1 ? "piece" : "pieces"} in this
              collection
            </p>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {state.products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  priority={i < 4}
                />
              ))}
            </div>
          </>
        ) : state.kind === "empty" ? (
          <EmptyState
            title="This collection is being prepared"
            description="There are no pieces in this collection right now. Please check back soon."
            actionHref="/products"
            actionLabel="See all products"
          />
        ) : (
          <EmptyState
            title="We couldn't load this collection"
            description="There was a problem reaching the service. Please refresh in a moment."
            actionHref="/categories"
            actionLabel="Back to collections"
          />
        )}
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api";
import { ProductsBrowser } from "@/components/products-browser";
import { ProductGridSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import type { Category, Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our complete catalogue of considered objects from independent makers.",
};

type DataState =
  | { kind: "ready"; products: Product[]; categories: Category[] }
  | { kind: "empty" }
  | { kind: "error" };

async function loadData(): Promise<DataState> {
  try {
    const [productsResult, categoriesResult] = await Promise.all([
      getProducts(1, 60),
      getCategories(1, 50),
    ]);
    if (!productsResult.products?.length) return { kind: "empty" };
    return {
      kind: "ready",
      products: productsResult.products,
      categories: categoriesResult.categories,
    };
  } catch {
    return { kind: "error" };
  }
}

export default async function ProductsPage() {
  const data = await loadData();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Catalogue
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          The shop.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted">
          Filter by collection, sort by mood. Everything in the catalogue is
          in stock and ready to ship from our studio.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-full bg-border/60"
                />
              ))}
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        {data.kind === "ready" ? (
          <ProductsBrowser products={data.products} categories={data.categories} />
        ) : data.kind === "empty" ? (
          <EmptyState
            title="The shop is being restocked"
            description="The freeapi.app catalogue refreshes every two hours. New pieces will return shortly."
            actionHref="/"
            actionLabel="Back to home"
          />
        ) : (
          <EmptyState
            title="We couldn't load the catalogue"
            description="There was a problem reaching the freeapi.app service. Please refresh in a moment."
            actionHref="/products"
            actionLabel="Try again"
          />
        )}
      </Suspense>
    </div>
  );
}

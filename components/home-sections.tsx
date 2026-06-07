import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { ProductCard } from "./product-card";
import { EmptyState } from "./empty-state";
import { ProductGridSkeleton } from "./skeletons";
import { Suspense } from "react";
import type { Category, Product } from "@/lib/types";

const PALETTE = [
  "linear-gradient(135deg, #b8472a 0%, #6f2a18 100%)",
  "linear-gradient(135deg, #d6c4a6 0%, #8a6f44 100%)",
  "linear-gradient(135deg, #1a1a1a 0%, #444 100%)",
  "linear-gradient(135deg, #6c7a89 0%, #2f3e46 100%)",
  "linear-gradient(135deg, #a5a58d 0%, #6b705c 100%)",
  "linear-gradient(135deg, #cb997e 0%, #6f4a2c 100%)",
  "linear-gradient(135deg, #344e41 0%, #1a2e22 100%)",
  "linear-gradient(135deg, #ddbea9 0%, #8d6e51 100%)",
];

export function FeaturedProducts() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            New & noteworthy
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            The latest arrivals.
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            A weekly selection of new pieces from our makers — small runs,
            honest materials.
          </p>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          View all
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="mt-12">
            <ProductGridSkeleton count={4} />
          </div>
        }
      >
        <FeaturedProductsList />
      </Suspense>
    </section>
  );
}

type FeaturedState =
  | { kind: "empty" }
  | { kind: "error" }
  | { kind: "ready"; products: Product[] };

async function loadFeatured(): Promise<FeaturedState> {
  try {
    const data = await getProducts(1, 8);
    if (!data.products?.length) return { kind: "empty" };
    return { kind: "ready", products: data.products };
  } catch {
    return { kind: "error" };
  }
}

async function FeaturedProductsList() {
  const state = await loadFeatured();
  if (state.kind === "error") {
    return (
      <div className="mt-12">
        <EmptyState
          title="We couldn't reach the catalogue"
          description="There was a problem loading products. Please refresh in a moment."
          actionHref="/"
          actionLabel="Try again"
        />
      </div>
    );
  }
  if (state.kind === "empty") {
    return (
      <div className="mt-12">
        <EmptyState
          title="No new arrivals — yet"
          description="The catalogue is being prepared. FreeAPI refreshes every 2 hours; new pieces will appear shortly."
          actionHref="/products"
          actionLabel="See all products"
        />
      </div>
    );
  }
  return (
    <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {state.products.slice(0, 8).map((product, i) => (
        <ProductCard key={product._id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}

export function Collections() {
  return (
    <section className="border-y border-ink/10 bg-cream">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Collections
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Curated by room,
              <br className="hidden sm:block" /> mood, and material.
            </h2>
          </div>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            All collections
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-3xl bg-border/60"
                />
              ))}
            </div>
          }
        >
          <CollectionsGrid />
        </Suspense>
      </div>
    </section>
  );
}

type CollectionsState =
  | { kind: "empty" }
  | { kind: "error" }
  | { kind: "ready"; categories: Category[] };

async function loadCollections(): Promise<CollectionsState> {
  try {
    const data = await getCategories(1, 8);
    if (!data.categories?.length) return { kind: "empty" };
    return { kind: "ready", categories: data.categories };
  } catch {
    return { kind: "error" };
  }
}

async function CollectionsGrid() {
  const state = await loadCollections();
  if (state.kind === "error" || state.kind === "empty") {
    return (
      <div className="mt-12">
        <EmptyState
          title={
            state.kind === "empty"
              ? "Collections being prepared"
              : "We couldn't reach the catalogue"
          }
          description={
            state.kind === "empty"
              ? "Our curators are finalising the new season. Check back soon."
              : "There was a problem loading the collections. Please refresh in a moment."
          }
          actionHref="/products"
          actionLabel="Browse all products"
        />
      </div>
    );
  }
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {state.categories.slice(0, 8).map((category, i) => (
        <Link
          key={category._id}
          href={`/categories/${category._id}`}
          className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
        >
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: PALETTE[i % PALETTE.length] }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-cream">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">
              Collection
            </p>
            <p className="mt-1 font-display text-xl font-medium leading-tight">
              {category.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Manifesto() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
        Our way of working
      </p>
      <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
        We choose fewer things,
        <br className="hidden sm:block" /> and we choose them slowly.
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted text-balance">
        Atelier is a small studio. We meet every maker, see every workshop,
        and ask the same question — would we keep this in our own home? If
        not, it doesn&apos;t make the catalogue.
      </p>
      <Link
        href="/about"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink"
      >
        Read our story
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
  );
}

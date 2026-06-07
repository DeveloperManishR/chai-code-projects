import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/api";
import { EmptyState } from "@/components/empty-state";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections.",
};

const PALETTES = [
  "linear-gradient(135deg, #b8472a 0%, #6f2a18 100%)",
  "linear-gradient(135deg, #d6c4a6 0%, #8a6f44 100%)",
  "linear-gradient(135deg, #1a1a1a 0%, #444 100%)",
  "linear-gradient(135deg, #6c7a89 0%, #2f3e46 100%)",
  "linear-gradient(135deg, #a5a58d 0%, #6b705c 100%)",
  "linear-gradient(135deg, #cb997e 0%, #6f4a2c 100%)",
  "linear-gradient(135deg, #344e41 0%, #1a2e22 100%)",
  "linear-gradient(135deg, #ddbea9 0%, #8d6e51 100%)",
  "linear-gradient(135deg, #5a4e7c 0%, #2c2542 100%)",
  "linear-gradient(135deg, #9aaeac 0%, #4b6160 100%)",
  "linear-gradient(135deg, #d4a373 0%, #7a5c3a 100%)",
  "linear-gradient(135deg, #264653 0%, #0d1d22 100%)",
];

type CollectionsState =
  | { kind: "ready"; categories: Category[] }
  | { kind: "empty" }
  | { kind: "error" };

async function loadCollections(): Promise<CollectionsState> {
  try {
    const data = await getCategories(1, 24);
    if (!data.categories?.length) return { kind: "empty" };
    return { kind: "ready", categories: data.categories };
  } catch {
    return { kind: "error" };
  }
}

export default async function CollectionsPage() {
  const state = await loadCollections();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Browse
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Collections.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted">
          Each collection gathers pieces that share a material, a room, or a
          mood. Wander — there&apos;s no rush.
        </p>
      </div>

      {state.kind === "ready" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {state.categories.map((category, i) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: PALETTES[i % PALETTES.length] }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-cream">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">
                  Collection
                </p>
                <p className="mt-1 font-display text-xl font-medium leading-tight sm:text-2xl">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : state.kind === "empty" ? (
        <EmptyState
          title="Collections being prepared"
          description="Our curators are finalising the new season. Check back soon."
          actionHref="/products"
          actionLabel="Browse all products"
        />
      ) : (
        <EmptyState
          title="We couldn't reach the catalogue"
          description="There was a problem loading the collections. Please try again."
          actionHref="/categories"
          actionLabel="Try again"
        />
      )}
    </div>
  );
}

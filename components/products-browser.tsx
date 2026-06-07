"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

type Sort = "latest" | "price-asc" | "price-desc" | "name";

export function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [sort, setSort] = useState<Sort>("latest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    let list = products.filter((product) => {
      if (inStockOnly && product.stock <= 0) return false;
      if (
        activeCategory !== "all" &&
        (typeof product.category === "string"
          ? product.category !== activeCategory
          : product.category?._id !== activeCategory)
      ) {
        return false;
      }
      if (q) {
        return (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return list;
  }, [products, deferredQuery, activeCategory, sort, inStockOnly]);

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
            Filter
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
            Refine
          </h2>
        </div>

        <div>
          <label
            htmlFor="search"
            className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted"
          >
            Search
          </label>
          <div className="relative mt-2">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pieces…"
              className="h-11 w-full rounded-full border border-ink/15 bg-card pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
            Collections
          </p>
          <ul className="mt-3 space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "flex w-full items-center justify-between rounded-full px-3 py-1.5 text-sm transition-colors",
                  activeCategory === "all"
                    ? "bg-ink text-cream"
                    : "text-ink/80 hover:bg-ink/5",
                )}
              >
                <span>All</span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    activeCategory === "all" ? "text-cream/70" : "text-muted",
                  )}
                >
                  {products.length}
                </span>
              </button>
            </li>
            {categories.map((category) => {
              const count = products.filter((p) =>
                typeof p.category === "string"
                  ? p.category === category._id
                  : p.category?._id === category._id,
              ).length;
              if (count === 0) return null;
              const active = activeCategory === category._id;
              return (
                <li key={category._id}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(category._id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-full px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-ink text-cream"
                        : "text-ink/80 hover:bg-ink/5",
                    )}
                  >
                    <span className="truncate">{category.name}</span>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        active ? "text-cream/70" : "text-muted",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
            Sort
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(
              [
                { id: "latest", label: "Latest" },
                { id: "price-asc", label: "Price ↑" },
                { id: "price-desc", label: "Price ↓" },
                { id: "name", label: "A → Z" },
              ] as Array<{ id: Sort; label: string }>
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSort(option.id)}
                className={cn(
                  "h-9 rounded-full border text-xs font-medium transition-colors",
                  sort === option.id
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/15 bg-card text-ink/80 hover:border-ink/40",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ink/10 bg-card px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="h-4 w-4 rounded border-ink/30 accent-ink"
          />
          <span className="text-ink">In stock only</span>
        </label>
      </aside>

      <section>
        <div className="mb-6 flex items-center justify-between text-sm">
          <p className="text-muted">
            <span className="font-mono tabular-nums text-ink">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "piece" : "pieces"}
          </p>
          {deferredQuery ? (
            <p className="text-muted">
              Showing results for{" "}
              <span className="text-ink">&ldquo;{deferredQuery}&rdquo;</span>
            </p>
          ) : null}
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try a different search, collection, or sort order."
            actionHref="/products"
            actionLabel="Reset filters"
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

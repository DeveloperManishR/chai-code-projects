export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

import type { Product } from "./types";

export function categoryNameOf(category: Product["category"]): string {
  if (typeof category === "string") return "Collection";
  return category?.name ?? "Collection";
}

export function categoryIdOf(category: Product["category"]): string | null {
  if (typeof category === "string") return category;
  return category?._id ?? null;
}

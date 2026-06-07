"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { pushCartToast } from "./toast";
import { categoryNameOf, formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const secondary = product.subImages?.[0]?.url;
  const hasStock = product.stock > 0;
  const inStock = hasStock;

  return (
    <article
      className={cn(
        "group flex flex-col gap-4",
        className,
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href={`/products/${product._id}`}
        className="relative block overflow-hidden rounded-3xl bg-background"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {product.mainImage?.url ? (
            <Image
              src={product.mainImage.url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              onLoad={() => setLoaded(true)}
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                loaded ? "opacity-100" : "opacity-0",
                hover ? "scale-105" : "scale-100",
              )}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-border/40 text-sm text-muted">
              Image coming soon
            </div>
          )}
          {secondary ? (
            <Image
              src={secondary}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-cover transition-opacity duration-500",
                hover ? "opacity-100" : "opacity-0",
              )}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {!inStock ? (
            <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-ink/90 px-3 text-[11px] font-medium uppercase tracking-wider text-cream">
              Sold out
            </span>
          ) : product.stock < 5 ? (
            <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-accent/95 px-3 text-[11px] font-medium uppercase tracking-wider text-cream">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
          {categoryNameOf(product.category)}
        </p>
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product._id}`}
            className="line-clamp-2 font-display text-base font-medium leading-snug text-ink transition-colors hover:text-accent"
          >
            {product.name}
          </Link>
          <p className="flex-shrink-0 font-mono text-sm tabular-nums text-ink">
            {formatPrice(product.price)}
          </p>
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => {
            add(product, 1);
            pushCartToast(`${product.name} added to cart`);
          }}
          className={cn(
            "mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all duration-200",
            inStock
              ? "border-ink/15 bg-background text-ink hover:border-ink hover:bg-ink hover:text-cream"
              : "cursor-not-allowed border-ink/10 bg-background/60 text-muted",
          )}
        >
          {inStock ? (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add to cart
            </>
          ) : (
            "Notify me"
          )}
        </button>
      </div>
    </article>
  );
}

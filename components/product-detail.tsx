"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./cart-provider";
import { pushCartToast } from "./toast";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = [product.mainImage, ...(product.subImages ?? [])].filter(
    (image) => image?.url,
  );
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-3xl bg-border/40" />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-background">
        <Image
          src={images[active].url}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {product.stock <= 0 ? (
          <span className="absolute left-4 top-4 inline-flex h-7 items-center rounded-full bg-ink/90 px-3 text-[11px] font-medium uppercase tracking-wider text-cream">
            Sold out
          </span>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 transition-all",
                i === active
                  ? "border-ink"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AddToCartPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;
  const max = product.stock || 1;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
          {inStock ? "In stock" : "Currently unavailable"}
        </p>
        <p className="mt-1 font-mono text-sm tabular-nums text-ink">
          {inStock
            ? `${max} ${max === 1 ? "piece available" : "pieces available"}`
            : "Restock expected soon"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-ink/15 bg-card">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center text-ink transition-colors hover:bg-ink/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <span className="w-10 text-center font-mono text-base tabular-nums text-ink">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            className="grid h-12 w-12 place-items-center text-ink transition-colors hover:bg-ink/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => {
            add(product, quantity);
            pushCartToast(`${product.name} added to cart`);
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
          className={cn(
            "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium transition-transform",
            inStock
              ? added
                ? "bg-accent text-cream"
                : "bg-ink text-cream hover:scale-[1.01]"
              : "cursor-not-allowed bg-ink/30 text-cream/80",
          )}
        >
          {added ? (
            "Added"
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7h12l-1.2 11.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7Z" />
                <path d="M9 7V5a3 3 0 1 1 6 0v2" />
              </svg>
              {inStock ? "Add to cart" : "Unavailable"}
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-muted">
        Free carbon-neutral shipping over {formatPrice(120)}.
      </p>
    </div>
  );
}

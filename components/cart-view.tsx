"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export function CartView() {
  const { items, subtotal, setQuantity, remove, clear, count } = useCart();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl bg-border/50"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-ink/15 bg-card/50 px-6 py-20 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-ink/5 text-ink/40">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 7h12l-1.2 11.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7Z" />
            <path d="M9 7V5a3 3 0 1 1 6 0v2" />
          </svg>
        </div>
        <p className="mt-5 font-display text-2xl font-semibold text-ink">
          Your cart is quiet
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Begin a collection. Add a few pieces and they will appear here.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-mono tabular-nums text-ink">{count}</span>{" "}
            {count === 1 ? "item" : "items"}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Clear cart
          </button>
        </div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-4 rounded-3xl border border-ink/10 bg-card p-4 sm:p-5"
            >
              <Link
                href={`/products/${item.productId}`}
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-background sm:h-28 sm:w-28"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted">
                    No image
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {item.category}
                    </p>
                    <Link
                      href={`/products/${item.productId}`}
                      className="line-clamp-2 font-display text-lg font-medium leading-snug text-ink hover:text-accent"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <p className="font-mono text-base tabular-nums text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <p className="mt-1 font-mono text-xs tabular-nums text-muted">
                  {formatPrice(item.price)} each
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-ink/15">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      className="grid h-9 w-9 place-items-center text-ink transition-colors hover:bg-ink/5"
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
                    <span className="w-9 text-center font-mono text-sm tabular-nums text-ink">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      className="grid h-9 w-9 place-items-center text-ink transition-colors hover:bg-ink/5"
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
                    onClick={() => remove(item.productId)}
                    className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-ink/10 bg-card p-6">
          <p className="font-display text-lg font-semibold tracking-tight text-ink">
            Order summary
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-mono tabular-nums text-ink">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-mono tabular-nums text-ink">
                {subtotal >= 120 ? "Free" : formatPrice(8)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Estimated tax</dt>
              <dd className="font-mono tabular-nums text-ink">
                {formatPrice(Math.round(subtotal * 0.08))}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-base">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="font-mono text-lg tabular-nums text-ink">
                {formatPrice(
                  subtotal +
                    (subtotal >= 120 ? 0 : 8) +
                    Math.round(subtotal * 0.08),
                )}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            disabled
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-cream opacity-90 transition-transform hover:scale-[1.01]"
          >
            Checkout
            <svg
              viewBox="0 0 24 24"
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Demo storefront — checkout is disabled.
          </p>
        </div>
        <div className="mt-4 rounded-3xl border border-ink/10 bg-cream p-6">
          <p className="font-display text-base font-medium text-ink">
            Add a personal note
          </p>
          <p className="mt-1 text-xs text-muted">
            We hand-wrap every order in our studio.
          </p>
          <textarea
            placeholder="A small note for the recipient…"
            rows={3}
            className="mt-3 w-full resize-none rounded-2xl border border-ink/15 bg-card p-3 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
          />
        </div>
      </aside>
    </div>
  );
}

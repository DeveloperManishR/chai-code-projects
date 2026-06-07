"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, items, setQuantity, remove, subtotal, count } =
    useCart();

  return (
    <div
      aria-hidden={!isOpen}
      className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              Your cart
            </p>
            <p className="text-xs text-muted">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18 18 6" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-background text-ink/40">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
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
            <p className="font-display text-lg text-ink">Your cart is quiet</p>
            <p className="max-w-xs text-sm text-muted">
              Begin a collection — start with our newest arrivals.
            </p>
            <Link
              href="/products"
              onClick={close}
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 border-b border-ink/10 py-4 last:border-b-0"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-background">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs text-muted">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                          {item.category}
                        </p>
                        <p className="line-clamp-1 font-medium text-ink">
                          {item.name}
                        </p>
                      </div>
                      <p className="font-mono text-sm tabular-nums text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-ink/15 bg-background">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                          className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-ink/5"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-7 text-center font-mono text-xs tabular-nums text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                          className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-ink/5"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
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
                        className="text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/10 bg-background px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted">Subtotal</p>
                <p className="font-mono text-base font-semibold tabular-nums text-ink">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/cart"
                onClick={close}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-cream transition-transform hover:scale-[1.01]"
              >
                View cart
              </Link>
              <button
                type="button"
                onClick={close}
                className="mt-2 h-10 w-full text-sm text-muted transition-colors hover:text-ink"
              >
                Continue browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

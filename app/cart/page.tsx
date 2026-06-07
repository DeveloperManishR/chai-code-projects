import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the pieces in your cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Your selection
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          Cart.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted">
          A quiet space to review your pieces before we wrap and ship them
          from the studio.
        </p>
      </div>
      <CartView />
    </div>
  );
}

"use client";

import type { Product } from "./types";
import { categoryNameOf } from "./utils";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  maxStock: number;
};

const STORAGE_KEY = "atelier-cart-v1";
const EMPTY: CartItem[] = Object.freeze([]) as unknown as CartItem[];

class CartStore {
  private items: CartItem[] = [];
  private listeners = new Set<() => void>();
  private hydrated = false;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): CartItem[] => {
    if (!this.hydrated && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed)) this.items = parsed;
        }
      } catch {
        // ignore
      }
      this.hydrated = true;
      this.persist();
    }
    return this.items;
  };

  getServerSnapshot = (): CartItem[] => EMPTY;

  private persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // ignore
    }
  }

  private emit() {
    for (const listener of this.listeners) listener();
  }

  add(product: Product, quantity = 1) {
    const next = [...this.items];
    const idx = next.findIndex((item) => item.productId === product._id);
    if (idx >= 0) {
      const max = next[idx].maxStock;
      next[idx] = {
        ...next[idx],
        quantity: Math.min(max, next[idx].quantity + quantity),
      };
    } else {
      next.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage?.url ?? "",
        category: categoryNameOf(product.category),
        quantity: Math.min(product.stock || 1, quantity),
        maxStock: product.stock || 1,
      });
    }
    this.items = next;
    this.persist();
    this.emit();
  }

  remove(productId: string) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.persist();
    this.emit();
  }

  setQuantity(productId: string, quantity: number) {
    const q = Math.max(0, Math.floor(quantity));
    this.items = this.items
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.maxStock, q) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    this.persist();
    this.emit();
  }

  clear() {
    if (this.items.length === 0) return;
    this.items = [];
    this.persist();
    this.emit();
  }
}

export const cartStore = new CartStore();

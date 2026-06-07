"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { cartStore, type CartItem } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback((product: Product, quantity = 1) => {
    cartStore.add(product, quantity);
    setIsOpen(true);
  }, []);

  const remove = useCallback((productId: string) => {
    cartStore.remove(productId);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    cartStore.setQuantity(productId, quantity);
  }, []);

  const clear = useCallback(() => {
    cartStore.clear();
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const count = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    open,
    close,
    toggle,
    add,
    remove,
    setQuantity,
    clear,
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

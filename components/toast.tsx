"use client";

import { useEffect, useState } from "react";

type ToastMessage = { id: number; text: string };

let pushToast: ((text: string) => void) | null = null;

export function pushCartToast(text: string) {
  pushToast?.(text);
}

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    pushToast = (text: string) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, text }]);
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 2400);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-full border border-ink/10 bg-ink px-4 py-2 text-sm font-medium text-cream shadow-lg"
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}

export function useCartToasts() {
  return pushCartToast;
}

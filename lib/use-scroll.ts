"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return typeof window === "undefined" ? 0 : window.scrollY;
}

function getServerSnapshot() {
  return 0;
}

export function useScrollY() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { useScrollY } from "@/lib/use-scroll";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "Story" },
];

export function Header() {
  const pathname = usePathname();
  const { count, toggle, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollY = useScrollY();
  const scrolled = scrollY > 12;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-ink"
            aria-label="Atelier home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-cream transition-transform group-hover:rotate-12">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2 4 7v10l8 5 8-5V7l-8-5Z" />
                <path d="M12 22V12" />
                <path d="m4 7 8 5 8-5" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight">
                Atelier
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted">
                Curated Goods
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ${
                      active ? "scale-x-100" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Open cart (${count} items)`}
            className="group relative inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-cream transition-transform hover:scale-[1.02] active:scale-95"
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
              <path d="M6 7h12l-1.2 11.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7Z" />
              <path d="M9 7V5a3 3 0 1 1 6 0v2" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-cream transition-transform ${
                count > 0 ? "scale-100" : "scale-0"
              }`}
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18 18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-ink/10 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-base text-ink transition-colors hover:bg-ink/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <button
        type="button"
        onClick={open}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </header>
  );
}

import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Collections" },
      { href: "/products?sort=latest", label: "New Arrivals" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/about#craft", label: "Craft" },
      { href: "/about#sustainability", label: "Sustainability" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/about#contact", label: "Contact" },
      { href: "/about#shipping", label: "Shipping" },
      { href: "/about#returns", label: "Returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-ink/10 bg-cream">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              Considered objects,
              <br /> made with care.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Atelier curates independent makers and timeless design. A small
              studio, an open workshop, a quiet living room. Take a piece home.
            </p>
            <form className="mt-6 flex max-w-sm gap-2" action="#">
              <input
                type="email"
                required
                placeholder="you@studio.com"
                className="h-11 flex-1 rounded-full border border-ink/15 bg-background px-4 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
              >
                Join
              </button>
            </form>
          </div>
          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Atelier. A demonstration storefront.</p>
          <p>Powered by freeapi.app — refreshes every 2 hours.</p>
        </div>
      </div>
    </footer>
  );
}

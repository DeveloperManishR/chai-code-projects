import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
        <div className="relative flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-accent" />
            Autumn collection 2026
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-ink text-balance sm:text-6xl lg:text-7xl">
            Quiet things,
            <br />
            <span className="text-accent">made</span> to last.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted text-balance sm:text-lg">
            A small, slow catalogue of objects from independent makers. Linen,
            leather, glass, and wood — each piece chosen for how it feels in
            the hand.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
            >
              Shop the collection
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
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5"
            >
              Browse collections
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/10 pt-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                Makers
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
                42
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                Countries
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
                11
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                Pieces
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink">
                300+
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/10 sm:translate-y-6">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #c97a5b 0%, #8a3b22 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
              <div className="absolute inset-x-5 bottom-5 text-cream">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">
                  New in
                </p>
                <p className="mt-1 font-display text-xl font-medium leading-tight">
                  Hand-thrown stoneware, in four quiet glazes.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #d6c4a6 0%, #ad8a5e 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4),transparent_55%)]" />
                <div className="absolute inset-x-4 bottom-4 text-ink">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">
                    Studio
                  </p>
                  <p className="mt-1 font-display text-lg font-medium leading-tight">
                    Linen aprons, woven in small batches.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink p-5 text-cream">
                <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-accent" />
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
                  Now reading
                </p>
                <p className="mt-3 font-display text-lg leading-snug">
                  On the slow return of craft, and the patience of objects.
                </p>
                <p className="mt-4 text-xs opacity-60">— The Atelier Journal, No. 04</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-y border-ink/10 bg-ink py-3 text-cream">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-10 overflow-hidden px-5 text-xs uppercase tracking-[0.3em] sm:px-8">
          <div className="flex flex-shrink-0 items-center gap-10 marquee">
            {Array.from({ length: 2 }).map((_, group) => (
              <div key={group} className="flex items-center gap-10">
                {[
                  "Free shipping over $120",
                  "Carbon-neutral delivery",
                  "Lifetime repairs",
                  "Independent makers",
                  "30-day returns",
                ].map((text) => (
                  <span key={`${group}-${text}`} className="flex items-center gap-10">
                    {text}
                    <span className="h-1 w-1 rounded-full bg-cream/50" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

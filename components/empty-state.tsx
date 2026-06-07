import Link from "next/link";

export function EmptyState({
  title = "Nothing to show yet",
  description = "The shelves are restocking. Check back shortly, or browse our curated collections.",
  actionHref = "/products",
  actionLabel = "Refresh",
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
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
          <path d="M3 7h18l-1.5 11.3a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L3 7Z" />
          <path d="M8 7V5a4 4 0 1 1 8 0v2" />
        </svg>
      </div>
      <p className="mt-5 font-display text-2xl font-semibold text-ink">
        {title}
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

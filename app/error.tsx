"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        We couldn&apos;t complete that request.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted">
        The freeapi.app service may be refreshing its database, or there was
        an unexpected error. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-cream transition-transform hover:scale-[1.02]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

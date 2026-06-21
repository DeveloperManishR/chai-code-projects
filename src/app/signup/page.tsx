"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../../theme";
import { signIn, useSession } from "@/utils/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && session) {
      router.push("/onboarding");
    }
  }, [session, isPending, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn.social({ provider: "google", callbackURL: "/onboarding" });
    } catch {
      setError("Failed to initiate Google sign in");
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse delay-1000"></div>

        <div className="w-full max-w-md rounded-2xl border border-line bg-surface/60 p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              SwiftMail
            </h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to manage your AI workflows and integrations
            </p>
          </div>

          {error && (
            <div className="mb-4 w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || isPending}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-text shadow-sm transition-all hover:bg-surface2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>{loading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <p className="mt-6 text-xs text-muted text-center">
            By continuing, you agree to SwiftMail&apos;s{" "}
            <a href="/terms" className="text-accent hover:underline">Terms</a> and{" "}
            <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

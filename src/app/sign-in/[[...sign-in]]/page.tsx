"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { ThemeProvider } from "../../../theme";
import { signIn } from "@/utils/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await signIn.email({ email, password });
      if (signInError) {
        setError(signInError.message || "Invalid credentials");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
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
            <h1 className="font-display text-3xl font-extrabold tracking-tight bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              MailyFlow
            </h1>
            <p className="mt-2 text-sm text-muted">
              Control your AI workflows and integrations in one place
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface2 border border-line text-text rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-surface2 border border-line text-text rounded-xl px-4 py-2.5 pr-10 text-sm focus:border-accent focus:ring-accent outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:brightness-105 text-white font-semibold rounded-xl py-2.5 text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-accent hover:text-accent-glow font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

import { Outlet, Link } from "react-router"
import { BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"

/**
 * Centered layout for authentication pages (login / signup).
 */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      {/* Subtle decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Theme toggle in corner */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Branding */}
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
      >
        <BarChart3 className="h-7 w-7 text-primary" />
        PollWave
      </Link>

      {/* Auth form slot */}
      <div className="relative w-full max-w-md">
        <Outlet />
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PollWave
      </p>
    </div>
  )
}

import { Outlet, useLocation } from "react-router"
import { Navbar } from "./navbar"

/**
 * Primary application layout: Navbar + scrollable content area.
 * The landing page (/) renders full-bleed — no container wrapper.
 * All other pages get the standard max-w-6xl centered container.
 */
export function AppLayout() {
  const { pathname } = useLocation()
  const isLanding = pathname === "/"

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {isLanding ? (
          <Outlet />
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Outlet />
          </div>
        )}
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-primary text-sm">●</span>
            PollWave
          </div>
          <p>© {new Date().getFullYear()} PollWave. Built with ♥</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

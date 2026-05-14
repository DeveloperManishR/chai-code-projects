import { Outlet } from "react-router"
import { Navbar } from "./navbar"

/**
 * Primary application layout: Navbar + scrollable content area.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PollWave. Built with ♥
      </footer>
    </div>
  )
}

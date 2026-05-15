import { Link, useNavigate, useLocation } from "react-router"
import {
  BarChart3,
  LogOut,
  Menu,
  PlusCircle,
  User as UserIcon,
  X,
} from "lucide-react"
import * as React from "react"
import { useAuth } from "@/providers/auth-provider"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const homeLink = isAuthenticated ? "/home" : "/"
  const homeLinkLabel = isAuthenticated ? "Dashboard" : "Home"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to={homeLink}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>PollWave</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to={homeLink}
              className={cn(pathname === homeLink && "bg-accent text-accent-foreground")}
            >
              {homeLinkLabel}
            </Link>
          </Button>

          {isAuthenticated && (
            <Button variant="ghost" size="sm" asChild>
              <Link
                to="/polls/create"
                className={cn(pathname === "/polls/create" && "bg-accent text-accent-foreground")}
              >
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Create Poll
              </Link>
            </Button>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative ml-1 h-9 w-9 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="shadow-sm">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-72" : "max-h-0 border-t-0",
        )}
      >
        <div className="space-y-1 px-4 py-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link to={homeLink}>{homeLinkLabel}</Link>
          </Button>

          {isAuthenticated && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMobileOpen(false)}
            >
              <Link to="/polls/create">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Create Poll
              </Link>
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-md px-3 py-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={() => {
                  handleLogout()
                  setMobileOpen(false)
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                className="flex-1"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

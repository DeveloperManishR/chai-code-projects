import { Navigate, useLocation } from "react-router"
import { useAuth } from "@/providers/auth-provider"

/**
 * Wraps protected routes. Redirects to /login when unauthenticated,
 * preserving the intended destination in location state.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

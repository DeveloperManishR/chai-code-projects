import * as React from "react"
import type { User } from "@/types"

interface AuthContextValue {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })

  const [accessToken, setAccessToken] = React.useState<string | null>(
    () => localStorage.getItem("accessToken"),
  )

  const isAuthenticated = !!user && !!accessToken

  const login = React.useCallback(
    (user: User, accessToken: string, refreshToken: string) => {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      setUser(user)
      setAccessToken(accessToken)
    },
    [],
  )

  const logout = React.useCallback(() => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    setAccessToken(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, accessToken, isAuthenticated, login, logout }),
    [user, accessToken, isAuthenticated, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

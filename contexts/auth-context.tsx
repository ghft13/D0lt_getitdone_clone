"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { type AuthUser, type AuthSession, saveSession, clearSession } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const login = (session: AuthSession) => {
    saveSession(session)
    setUser(session.user)

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const DASHBOARD_URL = isLocalhost ? "http://localhost:3001" : (process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001");

    let path = "/";
    if (session.user.role === "admin") path = "/admin";
    else if (session.user.role === "provider") path = "/provider";
    else path = "/user";

    const finalUrl = `${DASHBOARD_URL}${path}`;

    // Force hard redirect
    window.location.href = finalUrl;
  }

  const logout = () => {
    clearSession()
    setUser(null)

    const DASHBOARD_URL = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000");
    window.location.href = `${DASHBOARD_URL}/login`;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { type AuthUser, type AuthSession, getSession, saveSession, clearSession, getDashboardRoute } from "@/lib/auth"
import axios from "axios"
interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
 const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {

    const session = getSession()
    if (session) {
      setUser(session.user)
    }
    setIsLoading(false)
  }, [])

  const login = (session: AuthSession) => {
    console.log("Logging in user:", session.user)
    saveSession(session)
    setUser(session.user)

    const dashboardRoute = getDashboardRoute(session.user.role)
    router.push(dashboardRoute)
  }


   const logout = async () => {
  try {
    await axios.post(
      `${Backend_URL}/api/auth/logout`,
      {},
      { withCredentials: true } // required for cookie removal
    );
  } catch (err) {
    console.error("Logout request failed:", err);
  }
  localStorage.removeItem("auth_session");

  setUser(null);
 
 router.push("/")
};

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

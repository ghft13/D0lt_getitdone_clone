// Authentication utilities
// This will integrate with Supabase when the integration is added

import type { UserRole } from "./db-types"

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  profileImage?: string
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: number
}

// Mock authentication for development
// Replace with actual Supabase auth when integration is added
export const mockUsers = [
  {
    id: "admin-001",
    email: "admin@dolt.com",
    password: "D0LTadmin",
    full_name: "ADMIN",
    role: "admin" as UserRole,
    profileImage: "https://example.com/admin-image.jpg",
  },
  {
    id: "provider-001",
    email: "provider@dolt.com",
    password: "provider123",
    full_name: "Juan Martinez",
    role: "provider" as UserRole,
    profileImage: "https://example.com/provider-image.jpg",
  },
  {
    id: "user-001",
    email: "user@dolt.com",
    password: "user123",
    full_name: "Maria Rodriguez",
    role: "user" as UserRole,
    profileImage: "https://example.com/user-image.jpg",
  },
]

export async function signIn(email: string, password: string): Promise<AuthSession | null> {
  // TODO: Replace with actual Supabase authentication
  // For now, use mock authentication
  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    return null
  }

  const session: AuthSession = {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      profileImage: user.profileImage,
    },
    token: `mock-token-${user.id}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }

  return session
}

export async function signUp(email: string, password: string, full_name: string): Promise<AuthSession | null> {
  // TODO: Replace with actual Supabase authentication
  // For now, create a mock user
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    full_name,
    role: "user" as UserRole,
    profileImage: "",
  }

  mockUsers.push(newUser)

  const session: AuthSession = {
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      profileImage: newUser.profileImage,
    },
    token: `mock-token-${newUser.id}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }

  return session
}

export async function signOut(): Promise<void> {
  // TODO: Replace with actual Supabase sign out
  // For now, just clear local storage
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session")
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_session", JSON.stringify(session))
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null
  }

  const sessionStr = localStorage.getItem("auth_session")
  if (!sessionStr) {
    return null
  }

  try {
    const session: AuthSession = JSON.parse(sessionStr)

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem("auth_session")
      return null
    }

    return session
  } catch {
    return null
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session")
  }
}

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin"
    case "provider":
      return "/dashboard/provider"
    case "owner":
    case "manager":
      return "/dashboard/manager"
    case "user":
      return "/dashboard/user"
    default:
      return "/dashboard"
  }
}

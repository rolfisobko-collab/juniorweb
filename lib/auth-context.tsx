"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DISABLE_AUTH_ENV = process.env.NEXT_PUBLIC_DISABLE_AUTH === "1"
const DEMO_USER_STORAGE_KEY = "tz_demo_user"
const DISABLE_AUTH_STORAGE_KEY = "tz_disable_auth"

function isAuthDisabled() {
  if (DISABLE_AUTH_ENV) return true
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(DISABLE_AUTH_STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        if (isAuthDisabled()) {
          const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY)
          if (!stored) {
            if (!cancelled) setUser(null)
            return
          }
          const parsed = JSON.parse(stored) as User
          if (!cancelled) setUser(parsed)
          return
        }

        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        if (!res.ok) {
          if (!cancelled) setUser(null)
          return
        }

        const data = (await res.json()) as { user?: User }
        if (!cancelled) setUser(data.user ?? null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (isAuthDisabled()) {
        const demoUser: User = {
          id: "demo",
          email: (email ?? "").trim() || "demo@techzone.com",
          name: "Usuario Demo",
        }
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser))
        setUser(demoUser)
        return
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        throw new Error("Credenciales inválidas")
      }

      const data = (await res.json()) as { user?: User }
      setUser(data.user ?? null)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    throw new Error("OAuth no implementado")
  }

  const loginWithFacebook = async () => {
    throw new Error("OAuth no implementado")
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      if (isAuthDisabled()) {
        const demoUser: User = {
          id: "demo",
          email: (email ?? "").trim() || "demo@techzone.com",
          name: (name ?? "").trim() || "Usuario Demo",
        }
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser))
        setUser(demoUser)
        return
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        throw new Error("No se pudo registrar")
      }

      const data = (await res.json()) as { user?: User }
      setUser(data.user ?? null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)

    if (isAuthDisabled()) {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY)
    } else {
    void fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
    }

    localStorage.removeItem("cart")
    localStorage.removeItem("favorites")
  }

  const resetPassword = async (email: string) => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        loginWithFacebook,
        register,
        logout,
        resetPassword,
        isLoading,
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

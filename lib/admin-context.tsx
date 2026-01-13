"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { adminUsers, type Permission } from "./admin-users-data"

interface Admin {
  id: string
  email: string
  username: string
  name: string
  role: "superadmin" | "admin" | "editor" | "viewer"
  permissions: Permission[]
}

interface AdminContextType {
  admin: Admin | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  console.log("[v0] AdminProvider - admin:", admin)
  console.log("[v0] AdminProvider - isLoading:", isLoading)

  useEffect(() => {
    console.log("[v0] AdminProvider - Loading from localStorage")
    const storedAdmin = localStorage.getItem("admin")
    console.log("[v0] AdminProvider - storedAdmin:", storedAdmin)
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin)
        console.log("[v0] AdminProvider - Setting admin:", parsed)
        setAdmin(parsed)
      } catch (e) {
        console.error("[v0] AdminProvider - Error parsing admin:", e)
      }
    }
    setIsLoading(false)
    console.log("[v0] AdminProvider - Loading complete")
  }, [])

  const login = async (username: string, password: string) => {
    const user = adminUsers.find((u) => u.username === username && u.password === password && u.active)

    if (user) {
      const adminData: Admin = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      }
      setAdmin(adminData)
      localStorage.setItem("admin", JSON.stringify(adminData))

      const userIndex = adminUsers.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        adminUsers[userIndex].lastLogin = new Date().toISOString()
      }

      router.push("/panel")
    } else {
      throw new Error("Credenciales inválidas o usuario inactivo")
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!admin) return false
    if (admin.role === "superadmin") return true
    return admin.permissions.includes(permission)
  }

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, hasPermission }}>{children}</AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

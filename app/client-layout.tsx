"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { AdminProvider } from "@/lib/admin-context"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { Header } from "@/components/header"
import { ScrollToTop } from "@/components/scroll-to-top"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isPanelRoute = pathname?.startsWith("/panel")
  const isAuthRoute =
    pathname?.startsWith("/(auth)") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/reset-password"

  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <ScrollToTop />
            {!isPanelRoute && !isAuthRoute && <Header />}
            {children}
            {!isPanelRoute && !isAuthRoute && <Footer />}
            <Toaster />
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
      <Analytics />
    </AuthProvider>
  )
}

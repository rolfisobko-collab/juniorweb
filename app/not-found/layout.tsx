"use client"

import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { AdminProvider } from "@/lib/admin-context"
import { CartProvider } from "@/lib/cart-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { CurrencyProvider } from "@/lib/currency-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"

export default function NotFoundLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <CurrencyProvider>
              <ScrollToTop />
              {children}
              <Toaster />
            </CurrencyProvider>
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
      <Analytics />
    </AuthProvider>
  )
}

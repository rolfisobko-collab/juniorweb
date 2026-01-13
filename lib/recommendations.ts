"use client"

import type { Product } from "./products-data"
import { products } from "./products-data"

export function getRecommendedProducts(limit = 8): Product[] {
  if (typeof window === "undefined") return products.slice(0, limit)

  // Obtener categorías visitadas de las cookies
  const visitedCategories = getVisitedCategories()

  if (visitedCategories.length === 0) {
    return products.filter((p) => p.featured).slice(0, limit)
  }

  // Filtrar productos de categorías visitadas
  const recommended = products.filter((p) => visitedCategories.includes(p.category))

  // Si no hay suficientes, completar con productos destacados
  if (recommended.length < limit) {
    const featured = products.filter((p) => p.featured && !recommended.includes(p))
    return [...recommended, ...featured].slice(0, limit)
  }

  return recommended.slice(0, limit)
}

export function getLatestProducts(limit = 8): Product[] {
  // Los últimos productos son los que tienen ID más alto
  return [...products].reverse().slice(0, limit)
}

export function trackCategoryView(category: string) {
  if (typeof window === "undefined") return

  const visited = getVisitedCategories()

  if (!visited.includes(category)) {
    visited.push(category)
    // Mantener solo las últimas 5 categorías
    const recent = visited.slice(-5)
    document.cookie = `visited_categories=${JSON.stringify(recent)}; path=/; max-age=2592000` // 30 días
  }
}

function getVisitedCategories(): string[] {
  if (typeof window === "undefined") return []

  const cookies = document.cookie.split(";")
  const visitedCookie = cookies.find((c) => c.trim().startsWith("visited_categories="))

  if (!visitedCookie) return []

  try {
    const value = visitedCookie.split("=")[1]
    return JSON.parse(decodeURIComponent(value))
  } catch {
    return []
  }
}

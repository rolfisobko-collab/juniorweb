"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "./products-data"

interface FavoritesContextType {
  favorites: Product[]
  addFavorite: (product: Product) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: Product) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (product: Product) => {
    setFavorites((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current
      }
      return [...current, product]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites((current) => current.filter((item) => item.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId)
  }

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

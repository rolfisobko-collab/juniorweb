"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, ArrowRight, Grid3x3, X, Home, Package, Tag, HelpCircle, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { LanguageCurrencySelector } from "./language-currency-selector"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getCategories, getCategoriesSync } from "@/lib/categories-data"
import { BrandingLogo } from "./branding-logo"
import { colors } from "@/lib/colors"

export function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { favorites } = useFavorites()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState(getCategoriesSync())

  // Cargar categorías desde la API al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSidebarOpen(false)
    }
  }

  const visibleCategories = categories.slice(0, 3)
  const hasMoreCategories = categories.length > 3

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="hover:bg-blue-50 hover:scale-110 transition-all"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
              <BrandingLogo href="/" variant="header" className="shrink-0" />
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-4">
              <div className="relative w-full">
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 px-5 pr-12 text-base bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/60 backdrop-blur-sm rounded-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 focus:shadow-lg focus:shadow-blue-200/30 transition-all duration-300 shadow-sm hover:shadow-md hover:border-gray-300/80 placeholder:text-gray-400"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-blue-400/30"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex items-center gap-3 shrink-0">
              <LanguageCurrencySelector />
              
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-blue-50 hover:scale-110 transition-all"
                >
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {favorites.length}
                    </span>
                  )}
                  <span className="sr-only">Favoritos</span>
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-blue-50 hover:scale-110 transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {itemCount}
                    </span>
                  )}
                  <span className="sr-only">Carrito</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:scale-110 transition-all relative">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="sr-only">Menú de usuario</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites">Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="hidden sm:flex bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-blue-500/20 font-semibold"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button variant="ghost" size="icon" className="sm:hidden hover:bg-blue-50">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-6">
                    <form onSubmit={handleSearch} className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Buscar productos..."
                        className="pl-10 h-11 bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/60 backdrop-blur-sm rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50 transition-all duration-300 shadow-sm hover:shadow-md hover:border-gray-300/80 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>
                    {categories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="text-base font-semibold hover:text-blue-500 transition-colors flex items-center gap-2"
                        >
                          {category.name}
                          <span className="text-xs text-gray-500">({category.subcategories.length})</span>
                        </Link>
                        <div className="pl-4 space-y-2">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                              className="block text-sm text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Desplegable */}
      <div 
        className={`fixed inset-0 z-50 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all duration-300 ease-in-out`}
      >
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div 
          className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 shadow-2xl transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex flex-col h-full">
            {/* Header del Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BrandingLogo href="/" variant="header" className="shrink-0" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-blue-50 transition-colors"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>

            {/* Contenido del Sidebar */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Categorías */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-4 px-2">CATEGORÍAS</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.slug} className="space-y-2">
                      <Link
                        href={`/products?category=${category.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <span className="font-medium group-hover:text-blue-500 transition-colors">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.subcategories.length}
                        </span>
                      </Link>
                      <div className="pl-6 space-y-1">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                            onClick={() => setSidebarOpen(false)}
                            className="block text-sm text-gray-500 hover:text-blue-500 transition-all duration-200 py-2 px-3 rounded-md hover:bg-blue-50"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

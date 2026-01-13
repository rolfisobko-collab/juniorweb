"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, ArrowRight, Grid3x3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { categories } from "@/lib/categories-data"
import { BrandingLogo } from "./branding-logo"

export function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { favorites } = useFavorites()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const visibleCategories = categories.slice(0, 3)
  const hasMoreCategories = categories.length > 3

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <BrandingLogo href="/" variant="header" className="shrink-0" />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos, marcas o categorías..."
                className="pl-12 pr-32 h-12 w-full border-2 border-border focus:border-primary/50 rounded-full shadow-md hover:shadow-lg transition-shadow bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 px-5 shadow-md"
              >
                Buscar
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 hover:scale-110 transition-all"
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
                className="relative hover:bg-primary/10 hover:scale-110 transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-primary to-blue-600 text-primary-foreground text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:scale-110 transition-all">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Menú de usuario</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
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
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="hidden sm:flex shadow-lg hover:shadow-xl transition-all">
                  Iniciar Sesión
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden hover:bg-primary/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <form onSubmit={handleSearch} className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  {categories.map((category) => (
                    <div key={category.slug} className="space-y-2">
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="text-base font-semibold hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {category.name}
                        <span className="text-xs text-muted-foreground">({category.subcategories.length})</span>
                      </Link>
                      <div className="pl-4 space-y-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
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

        <div className="hidden md:block border-t border-border/40 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
          <nav className="flex items-center justify-center h-12 gap-1">
            {visibleCategories.map((category) => (
              <DropdownMenu key={category.slug}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-full rounded-none text-sm font-semibold hover:text-primary hover:bg-primary/5 transition-all px-4"
                  >
                    {category.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[420px] max-h-[500px] overflow-y-auto p-4"
                  sideOffset={4}
                >
                  <div className="mb-3">
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-base font-bold hover:text-primary transition-colors flex items-center gap-2 mb-4 pb-3 border-b"
                    >
                      Ver todo en {category.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                        className="text-sm hover:text-primary transition-all py-2 px-3 rounded-lg hover:bg-primary/5 hover:translate-x-1 duration-200"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {hasMoreCategories && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-full rounded-none text-sm font-semibold hover:text-primary hover:bg-primary/5 transition-all px-4"
                  >
                    <Grid3x3 className="mr-1 h-4 w-4" />
                    Todas las Categorías
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-[600px] max-h-[600px] overflow-y-auto p-6"
                  sideOffset={4}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Todas las Categorías</h3>
                    <p className="text-sm text-muted-foreground">Explora nuestra selección completa</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {categories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="text-base font-bold hover:text-primary transition-colors flex items-center gap-2 mb-2"
                        >
                          {category.name}
                          <span className="text-xs font-normal text-muted-foreground">
                            ({category.subcategories.length})
                          </span>
                        </Link>
                        <div className="space-y-1 pl-3 border-l-2 border-border">
                          {category.subcategories.slice(0, 5).map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                              className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {category.subcategories.length > 5 && (
                            <Link
                              href={`/products?category=${category.slug}`}
                              className="block text-sm text-primary hover:underline py-1 font-medium"
                            >
                              Ver todas ({category.subcategories.length})
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

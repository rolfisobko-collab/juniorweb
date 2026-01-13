"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products-data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

export default function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all")
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true
    return product.category === selectedCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
        <p className="text-lg text-muted-foreground">Explora nuestra selección exclusiva</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={selectedCategory === "electronics" ? "default" : "outline"}
            onClick={() => setSelectedCategory("electronics")}
            size="sm"
          >
            Electrónica
          </Button>
          <Button
            variant={selectedCategory === "appliances" ? "default" : "outline"}
            onClick={() => setSelectedCategory("appliances")}
            size="sm"
          >
            Electrodomésticos
          </Button>
          <Button
            variant={selectedCategory === "perfumes" ? "default" : "outline"}
            onClick={() => setSelectedCategory("perfumes")}
            size="sm"
          >
            Perfumes
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="rating">Mejor Valorados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No se encontraron productos en esta categoría</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products-data"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState("relevance")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    let results = products

    // Filter by search query
    if (query) {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      results = results.filter((product) => product.category === categoryFilter)
    }

    // Sort results
    switch (sortBy) {
      case "price-asc":
        results = [...results].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        results = [...results].sort((a, b) => b.price - a.price)
        break
      case "name":
        results = [...results].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    setFilteredProducts(results)
  }, [query, sortBy, categoryFilter])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
        {query && (
          <p className="text-muted-foreground">
            Mostrando {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} para{" "}
            <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="electronics">Electrónica</SelectItem>
            <SelectItem value="appliances">Electrodomésticos</SelectItem>
            <SelectItem value="perfumes">Perfumes</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="name">Nombre A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No se encontraron resultados</h2>
          <p className="text-muted-foreground mb-6">
            Intenta con otros términos de búsqueda o explora nuestras categorías
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild variant="outline">
              <a href="/products?category=electronics">Electrónica</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/products?category=appliances">Electrodomésticos</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/products?category=perfumes">Perfumes</a>
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando resultados...</div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}

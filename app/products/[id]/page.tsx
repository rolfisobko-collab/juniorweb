"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products-data"
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import { use, useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  const demoProduct: Product = {
    id,
    name: "Producto Demo",
    category: "electronics",
    price: 999,
    image: "/placeholder.svg",
    description: "Producto hardcodeado para pruebas en /products/[id].",
    brand: "TechZone",
    rating: 4.7,
    reviews: 123,
    inStock: true,
    featured: true,
  }

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${id}`, { method: "GET" })
        if (!res.ok) {
          if (!cancelled) setProduct(demoProduct)
          return
        }

        const apiProduct = (await res.json()) as {
          id: string
          name: string
          categoryKey: string
          price: number
          image: string
          description: string
          brand: string
          rating: number
          reviews: number
          inStock: boolean
          featured?: boolean
        }

        const mapped: Product = {
          id: apiProduct.id,
          name: apiProduct.name,
          category: (apiProduct.categoryKey as Product["category"]) ?? "electronics",
          price: apiProduct.price,
          image: apiProduct.image,
          description: apiProduct.description,
          brand: apiProduct.brand,
          rating: apiProduct.rating,
          reviews: apiProduct.reviews,
          inStock: apiProduct.inStock,
          featured: apiProduct.featured,
        }

        if (!cancelled) setProduct(mapped)
      } catch {
        if (!cancelled) setProduct(demoProduct)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Skeleton Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted animate-pulse" />
          {/* Skeleton Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 bg-muted rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="border-t border-b border-border py-6 space-y-2">
              <div className="h-12 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-20 bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-10 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
                <div className="h-12 w-12 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                <div className="h-4 w-44 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button onClick={() => router.push("/products")}>Volver al catálogo</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast({
        title: "Agregado al carrito",
        description: `${quantity}x ${product.name} agregado a tu carrito`,
      })
    }
  }

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product)
      toast({
        title: isFavorite(product.id) ? "Eliminado de favoritos" : "Agregado a favoritos",
        description: isFavorite(product.id)
          ? `${product.name} ha sido eliminado de tus favoritos`
          : `${product.name} ha sido agregado a tus favoritos`,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.brand}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                  />
                ))}
                <span className="ml-2 font-semibold">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reseñas)</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-border py-6">
            <p className="text-5xl font-bold font-serif mb-2">${product.price}</p>
            <p className="text-sm text-muted-foreground">Impuestos incluidos</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Cantidad:</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? "Agregar al Carrito" : "Agotado"}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-4 bg-transparent" onClick={handleToggleFavorite}>
                <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Envío gratuito en compras superiores a $100</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm">Garantía premium de 2 años</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

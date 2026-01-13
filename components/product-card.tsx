"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast({
      title: "Agregado al carrito",
      description: `${product.name} ha sido agregado a tu carrito`,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFavorite(product)
    toast({
      title: isFavorite(product.id) ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: isFavorite(product.id)
        ? `${product.name} ha sido eliminado de tus favoritos`
        : `${product.name} ha sido agregado a tus favoritos`,
    })
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-border/40 hover:border-primary/60 transition-all duration-300 hover:shadow-lg h-full">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-3 w-3 ${isFavorite(product.id) ? "fill-current text-red-500" : ""}`} />
            </Button>
            {!product.inStock && (
              <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                <span className="text-xs font-semibold">Agotado</span>
              </div>
            )}
          </div>

          <div className="p-3 space-y-1.5">
            <div className="space-y-0.5">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium truncate">
                {product.brand}
              </p>
              <h3 className="font-semibold text-xs line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                <span className="ml-0.5 text-[10px] font-medium">{product.rating}</span>
              </div>
              <span className="text-[9px] text-muted-foreground">({product.reviews})</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-base md:text-lg font-bold">${product.price}</p>
              <Button
                size="sm"
                className="w-full h-7 text-[10px] md:text-xs"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Añadir al Carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

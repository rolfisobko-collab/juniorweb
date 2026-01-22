"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { UnifiedProduct } from "@/lib/product-types"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useCurrency } from "@/lib/currency-context"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: UnifiedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { formatPrice } = useCurrency()
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
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 h-full bg-white rounded-2xl">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
              loading="lazy"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/95 hover:bg-white hover:scale-110 z-10"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current text-red-500" : "text-gray-600"}`} />
            </Button>
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10">
                <span className="text-sm font-semibold text-gray-800 px-4 py-2 bg-gray-100 rounded-full">Agotado</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium truncate">
                {product.brand}
              </p>
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors duration-200 min-h-[2.5rem] text-gray-800">
                {product.name}
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
              <Button
                size="sm"
                className="w-full h-9 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Añadir al Carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { UnifiedProduct } from "@/lib/product-types"
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import { use, useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { useToast } from "@/hooks/use-toast"
import { ProductCard } from "@/components/product-card"
import { useTranslation } from "@/lib/i18n/translation-provider"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<UnifiedProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [recommendedProducts, setRecommendedProducts] = useState<UnifiedProduct[]>([])
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${id}`, { method: "GET" })
        if (!res.ok) {
          throw new Error("Product not found")
        }

        const data = await res.json()
        const apiProduct = data.product

        // Convert API product to UnifiedProduct format
        const unifiedProduct: UnifiedProduct = {
          id: apiProduct.id,
          name: apiProduct.name,
          price: apiProduct.price,
          image: apiProduct.image,
          description: apiProduct.description,
          brand: apiProduct.brand,
          rating: apiProduct.rating,
          reviews: apiProduct.reviews,
          inStock: apiProduct.inStock,
          featured: apiProduct.featured,
          categoryKey: apiProduct.categoryKey,
          category: apiProduct.category,
          ...(apiProduct.stockQuantity !== undefined && { stockQuantity: apiProduct.stockQuantity }),
          ...(apiProduct.createdAt && { createdAt: apiProduct.createdAt }),
          ...(apiProduct.updatedAt && { updatedAt: apiProduct.updatedAt }),
        }

        if (!cancelled) {
          setProduct(unifiedProduct)

          // Load recommended products
          const recommendedRes = await fetch(`/api/products?limit=4&exclude=${id}`, { method: "GET" })
          if (recommendedRes.ok) {
            const recommendedData = await recommendedRes.json()
            const recommendedUnified = recommendedData.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
              description: p.description,
              brand: p.brand,
              rating: p.rating,
              reviews: p.reviews,
              inStock: p.inStock,
              featured: p.featured,
              categoryKey: p.categoryKey,
              category: p.category,
            }))
            setRecommendedProducts(recommendedUnified)
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load product:", err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
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
        <h1 className="text-2xl font-bold mb-4">{t('Product not found')}</h1>
        <Button onClick={() => router.push("/products")}>{t('Back to catalog')}</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast({
      title: t('Product Added to cart'),
      description: `${quantity}x ${product.name} ${t('Product added to favorites')}`,
    })
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product)
    toast({
      title: isFavorite(product.id) ? t('Product removed from favorites') : t('Product added to favorites'),
      description: isFavorite(product.id)
        ? `${product.name} ${t('Product removed from favorites')}`
        : `${product.name} ${t('Product added to favorites')}`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('Product Back')}
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
              <span className="text-muted-foreground">({product.reviews} {t('Product reviews')})</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b border-border py-6">
            <p className="text-5xl font-bold font-serif mb-2">${product.price}</p>
            <p className="text-sm text-muted-foreground">{t('Product Taxes included')}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold">{t('Product Quantity:')}</label>
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
                {product.inStock ? t('Product Add to Cart') : t('Product Out of stock')}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-4 bg-transparent" onClick={handleToggleFavorite}>
                <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">{t('Product Free shipping')}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm">{t('Product Premium warranty')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-16 pt-8 border-t">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Product You may also be interested')}</h2>
          <p className="text-gray-600">{t('Product Similar products')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((recommendedProduct) => (
            <ProductCard key={recommendedProduct.id} product={recommendedProduct} />
          ))}
          {recommendedProducts.length === 0 && (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 h-full bg-white rounded-2xl">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium truncate">
                        {t('Product Brand')}
                      </p>
                      <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors duration-200 min-h-[2.5rem] text-gray-800">
                        {t('Product Loading recommendations')}
                      </h3>
                    </div>
                    <div className="space-y-3 pt-2">
                      <p className="text-lg font-bold text-gray-900">$XXX</p>
                      <Button
                        size="sm"
                        className="w-full h-9 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                      >
                        {t('Product View product')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

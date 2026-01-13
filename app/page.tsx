"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products-data"
import { carouselSlides } from "@/lib/carousel-data"
import { defaultCTAs } from "@/lib/ctas-data"
import { HeroCarousel } from "@/components/hero-carousel"
import { getLatestProducts, getRecommendedProducts } from "@/lib/recommendations"
import { getActiveHomeCategories } from "@/lib/home-categories-data"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Package, Award, Clock, TrendingUp } from "lucide-react"

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 5)
  const latestProducts = getLatestProducts(5)
  const bestSellers = products.slice(0, 5)
  const activeCTAs = defaultCTAs.filter((cta) => cta.isActive).sort((a, b) => a.position - b.position)

  const [recommendedProducts, setRecommendedProducts] = useState(() => products.slice(0, 5))
  const [homeCategories, setHomeCategories] = useState<any[]>([])

  useEffect(() => {
    setRecommendedProducts(getRecommendedProducts(5))
    setHomeCategories(getActiveHomeCategories())
  }, [])

  return (
    <div className="min-h-screen">
      <HeroCarousel slides={carouselSlides} />

      <section className="py-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Truck className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Envío Gratis</p>
                <p className="text-xs text-muted-foreground">En compras +$100</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Garantía</p>
                <p className="text-xs text-muted-foreground">2 años extendida</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Premium</p>
                <p className="text-xs text-muted-foreground">Solo exclusivos</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Rápido</p>
                <p className="text-xs text-muted-foreground">Entrega 24-48h</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Package className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Seguro</p>
                <p className="text-xs text-muted-foreground">100% protegido</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Award className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Calidad</p>
                <p className="text-xs text-muted-foreground">Certificada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Recomendado Para Ti</h2>
              <p className="text-sm text-muted-foreground">Basado en tus intereses</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Recién Llegados</h2>
              <p className="text-sm text-muted-foreground">Las últimas novedades en tecnología</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {activeCTAs.length > 0 && activeCTAs[0] && (
        <section className="py-0 relative overflow-hidden">
          <Link
            href={activeCTAs[0].buttonLink || "/products"}
            className="group relative overflow-hidden block w-full"
            style={{ backgroundColor: activeCTAs[0].backgroundColor || "#1e40af" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 z-0" />
            <div className="grid md:grid-cols-2 items-center min-h-[400px] md:min-h-[500px] relative z-10">
              <div className="p-8 md:p-16 lg:pl-[10%] space-y-6 z-10 relative">
                <h2
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-balance leading-tight drop-shadow-lg"
                  style={{ color: activeCTAs[0].textColor || "#ffffff" }}
                >
                  {activeCTAs[0].title}
                </h2>
                <p
                  className="text-lg md:text-xl lg:text-2xl opacity-95 text-pretty max-w-lg drop-shadow-md"
                  style={{ color: activeCTAs[0].textColor || "#ffffff" }}
                >
                  {activeCTAs[0].description}
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-6 h-14 px-10 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  {activeCTAs[0].buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 md:hidden" />
                <Image
                  src={activeCTAs[0].imageDesktop || "/placeholder.svg"}
                  alt={activeCTAs[0].title}
                  fill
                  className="object-cover hidden md:block group-hover:scale-110 transition-transform duration-700"
                />
                <Image
                  src={activeCTAs[0].imageMobile || "/placeholder.svg"}
                  alt={activeCTAs[0].title}
                  fill
                  className="object-cover md:hidden group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Más Vendidos</h2>
              <p className="text-sm text-muted-foreground">Los favoritos de nuestros clientes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {activeCTAs.length > 1 && activeCTAs[1] && (
        <section className="py-0 relative overflow-hidden">
          <Link
            href={activeCTAs[1].buttonLink || "/products"}
            className="group relative overflow-hidden block w-full"
            style={{ backgroundColor: activeCTAs[1].backgroundColor || "#7c3aed" }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/20 z-0" />
            <div className="grid md:grid-cols-2 items-center min-h-[400px] md:min-h-[500px] relative z-10">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 md:hidden" />
                <Image
                  src={activeCTAs[1].imageDesktop || "/placeholder.svg"}
                  alt={activeCTAs[1].title}
                  fill
                  className="object-cover hidden md:block group-hover:scale-110 transition-transform duration-700"
                />
                <Image
                  src={activeCTAs[1].imageMobile || "/placeholder.svg"}
                  alt={activeCTAs[1].title}
                  fill
                  className="object-cover md:hidden group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-16 lg:pr-[10%] space-y-6 z-10 relative order-1 md:order-2">
                <h2
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-balance leading-tight drop-shadow-lg"
                  style={{ color: activeCTAs[1].textColor || "#ffffff" }}
                >
                  {activeCTAs[1].title}
                </h2>
                <p
                  className="text-lg md:text-xl lg:text-2xl opacity-95 text-pretty max-w-lg drop-shadow-md"
                  style={{ color: activeCTAs[1].textColor || "#ffffff" }}
                >
                  {activeCTAs[1].description}
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-6 h-14 px-10 text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  {activeCTAs[1].buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Ofertas Especiales</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Aprovecha estas promociones exclusivas</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button size="lg" className="h-12 px-8">
                  Ver Todos los Productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explora por Categoría</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Encuentra exactamente lo que buscas en nuestras categorías principales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {homeCategories.map((category) => (
              <Link
                key={category.id}
                href={category.link}
                className={`group relative overflow-hidden rounded-xl h-48 md:h-56 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
                  homeCategories.length % 3 === 1 && category.id === homeCategories[homeCategories.length - 1]?.id
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-20">
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{category.name}</h3>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                        <span className="text-sm md:text-base">Ver productos</span>
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

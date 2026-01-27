"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselSlide {
  id: number
  imageDesktop: string
  imageMobile: string
  position: number
  isActive: boolean
}

export function HeroCarouselNew() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const res = await fetch("/api/carousel")
        if (res.ok) {
          const data = await res.json()
          const activeSlides = data.slides?.filter((slide: CarouselSlide) => slide.isActive) || []
          setSlides(activeSlides.sort((a: CarouselSlide, b: CarouselSlide) => a.position - b.position))
        }
      } catch (error) {
        console.error("Error loading carousel:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSlides()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">Cargando carrusel...</div>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[700px] bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Bienvenido a TechZone
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubre la mejor tecnología
            </p>
            <Button size="lg" className="text-lg px-8">
              Ver Productos
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Imágenes del carrusel */}
      <div className="relative w-full h-full">
        {/* Imagen Desktop - siempre visible */}
        <img
          src={currentSlide.imageDesktop}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        />
        
        {/* Imagen Mobile - solo visible en móviles */}
        <img
          src={currentSlide.imageMobile || currentSlide.imageDesktop}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />
        
        {/* Overlay para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Controles de navegación */}
      {slides.length > 1 && (
        <>
          {/* Botones anterior/siguiente */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

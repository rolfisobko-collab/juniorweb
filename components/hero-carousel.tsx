"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/translation-provider"

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { language } = useTranslation()

  // Imágenes según el idioma
  const slides = language === "pt" ? [
    {
      desktop: "https://i.ibb.co/20fSKDrq/1-post-br.jpg",
      mobile: "https://i.ibb.co/8n95Kj6S/1-hist-br.jpg"
    },
    {
      desktop: "https://i.ibb.co/YFkkyqpR/2-post-br.jpg", 
      mobile: "https://i.ibb.co/Q74pBPfc/2-hist-br.jpg"
    },
    {
      desktop: "https://i.ibb.co/YBVsJZTW/3-post-br.jpg",
      mobile: "https://i.ibb.co/qMwb4863/3-hist-br.jpg"
    },
    {
      desktop: "https://i.ibb.co/F210KS1/4-post-br.jpg",
      mobile: "https://i.ibb.co/BV1RNtTw/4-hist-br.jpg"
    }
  ] : [
    {
      desktop: "https://i.ibb.co/wFHxQRGZ/1-post-es.jpg",
      mobile: "https://i.ibb.co/S7d44bDC/1-hist-es.jpg"
    },
    {
      desktop: "https://i.ibb.co/Bvp74MM/2-post-es.jpg", 
      mobile: "https://i.ibb.co/0j8Q3kQz/2-hist-es.jpg"
    },
    {
      desktop: "https://i.ibb.co/bMdBcZD4/3-post-es.jpg",
      mobile: "https://i.ibb.co/ksQ7zMDT/3-hist-es.jpg"
    },
    {
      desktop: "https://i.ibb.co/xqG2xjD5/4-post-es.jpg",
      mobile: "https://i.ibb.co/N2gzVfsq/4-hist-es.jpg"
    }
  ]

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  // Reset index when language changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [language])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Imágenes del carrusel - Responsive */}
      <div className="relative w-full h-full">
        {/* Imagen Desktop */}
        <img
          src={currentSlide.desktop}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center hidden md:block"
        />
        
        {/* Imagen Mobile */}
        <img
          src={currentSlide.mobile}
          alt={`Slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center md:hidden"
        />
      </div>

      {/* Controles de navegación */}
      {slides.length > 1 && (
        <>
          {/* Botones anterior/siguiente */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg hidden md:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg hidden md:flex"
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

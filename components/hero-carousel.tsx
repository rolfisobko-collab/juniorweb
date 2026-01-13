"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { CarouselSlide } from "@/lib/carousel-data"

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const activeSlides = slides.filter((s) => s.isActive).sort((a, b) => a.position - b.position)

  useEffect(() => {
    if (activeSlides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  if (activeSlides.length === 0) return null

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {activeSlides.map((slide, index) => {
        const bgColor = slide.backgroundColor || "#1a1a1a"
        const txtColor = slide.textColor || "#ffffff"

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: bgColor }}
          >
            <div className="container mx-auto px-4 h-full">
              <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                <div className="space-y-6 z-10" style={{ color: txtColor }}>
                  <p className="text-sm font-semibold tracking-wider uppercase opacity-80">{slide.subtitle}</p>
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">{slide.title}</h1>
                  <p className="text-lg md:text-xl opacity-90 max-w-lg text-pretty">{slide.description}</p>
                  <Link href={slide.buttonLink || "/products"}>
                    <Button
                      size="lg"
                      className="h-14 px-10 text-lg"
                      style={{
                        backgroundColor: txtColor,
                        color: bgColor,
                      }}
                    >
                      {slide.buttonText}
                    </Button>
                  </Link>
                </div>
                <div className="relative h-full hidden md:flex items-center justify-center">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="max-h-[500px] w-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {activeSlides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

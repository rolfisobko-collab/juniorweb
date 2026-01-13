export interface CTA {
  id: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageDesktop: string
  imageMobile: string
  desktopWidth: number
  desktopHeight: number
  mobileWidth: number
  mobileHeight: number
  position: number
  isActive: boolean
  backgroundColor: string
  textColor: string
}

export const defaultCTAs: CTA[] = [
  {
    id: "1",
    title: "Nueva Colección iPhone 15",
    description: "Descubre el futuro de la tecnología móvil con el nuevo iPhone 15 Pro Max",
    buttonText: "Ver Ahora",
    buttonLink: "/products?category=electronics",
    imageDesktop: "/iphone-15-pro-max-luxury-showcase.jpg",
    imageMobile: "/iphone-15-pro-max-mobile-banner.jpg",
    desktopWidth: 1200,
    desktopHeight: 600,
    mobileWidth: 600,
    mobileHeight: 800,
    position: 1,
    isActive: true,
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
  },
  {
    id: "2",
    title: "Fragancias de Lujo",
    description: "Perfumes exclusivos de las mejores casas del mundo",
    buttonText: "Explorar",
    buttonLink: "/products?category=perfumes",
    imageDesktop: "/luxury-perfume-bottles-elegant-display.jpg",
    imageMobile: "/luxury-perfume-mobile-banner.jpg",
    desktopWidth: 1200,
    desktopHeight: 600,
    mobileWidth: 600,
    mobileHeight: 800,
    position: 2,
    isActive: true,
    backgroundColor: "#7c3aed",
    textColor: "#ffffff",
  },
]

import { NextResponse } from "next/server"

// Sample products to seed the database
const SAMPLE_PRODUCTS = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro Max",
    categoryKey: "electronics",
    price: 1299,
    image: "/iphone-15-pro-max-premium-smartphone.jpg",
    description: "El smartphone más avanzado con chip A17 Pro y cámara profesional",
    brand: "Apple",
    rating: 4.9,
    reviews: 1234,
    inStock: true,
    stockQuantity: 25,
    featured: true
  },
  {
    id: "prod-2",
    name: "MacBook Pro 16\"",
    categoryKey: "electronics",
    price: 2599,
    image: "/macbook-pro-16-inch-laptop-premium.jpg",
    description: "Potencia extrema con chip M3 Max para profesionales creativos",
    brand: "Apple",
    rating: 4.8,
    reviews: 987,
    inStock: true,
    stockQuantity: 15,
    featured: true
  },
  {
    id: "prod-3",
    name: "Sony WH-1000XM5",
    categoryKey: "electronics",
    price: 429,
    image: "/sony-premium-noise-cancelling-headphones.jpg",
    description: "Auriculares premium con cancelación de ruido líder en la industria",
    brand: "Sony",
    rating: 4.7,
    reviews: 2341,
    inStock: true,
    stockQuantity: 30,
    featured: false
  },
  {
    id: "prod-4",
    name: "Samsung OLED 4K 65\"",
    categoryKey: "appliances",
    price: 1999,
    image: "/samsung-oled-tv-65-inch-premium.jpg",
    description: "Televisor OLED 4K con calidad de imagen cinematográfica",
    brand: "Samsung",
    rating: 4.9,
    reviews: 543,
    inStock: true,
    stockQuantity: 8,
    featured: true
  },
  {
    id: "prod-5",
    name: "Chanel N°5",
    categoryKey: "perfumes",
    price: 179,
    image: "/chanel-no-5-perfume-bottle-luxury.jpg",
    description: "El perfume icónico que define la elegancia atemporal",
    brand: "Chanel",
    rating: 4.9,
    reviews: 3421,
    inStock: true,
    stockQuantity: 20,
    featured: true
  },
  {
    id: "prod-6",
    name: "Dyson V15 Detect",
    categoryKey: "appliances",
    price: 749,
    image: "/dyson-v15-vacuum-cleaner-premium.jpg",
    description: "Aspiradora sin cable con tecnología de detección láser",
    brand: "Dyson",
    rating: 4.6,
    reviews: 876,
    inStock: true,
    stockQuantity: 12,
    featured: false
  },
  {
    id: "prod-7",
    name: "Nespresso Vertuo",
    categoryKey: "appliances",
    price: 299,
    image: "/nespresso-vertuo-coffee-machine-premium.jpg",
    description: "Cafetera de cápsulas con sistema Centrifusion",
    brand: "Nespresso",
    rating: 4.5,
    reviews: 1432,
    inStock: true,
    stockQuantity: 18,
    featured: false
  },
  {
    id: "prod-8",
    name: "Dior Sauvage",
    categoryKey: "perfumes",
    price: 135,
    image: "/dior-sauvage-perfume-bottle-luxury.jpg",
    description: "Fragancia masculina fresca e intensa inspirada en espacios abiertos",
    brand: "Dior",
    rating: 4.8,
    reviews: 2876,
    inStock: true,
    stockQuantity: 25,
    featured: false
  }
]

const SAMPLE_CATEGORIES = [
  {
    key: "electronics",
    name: "Electrónica",
    slug: "electronics",
    description: "Productos electrónicos modernos"
  },
  {
    key: "appliances",
    name: "Electrodomésticos",
    slug: "appliances",
    description: "Electrodomésticos modernos"
  },
  {
    key: "perfumes",
    name: "Perfumes",
    slug: "perfumes",
    description: "Fragancias de lujo"
  }
]

export async function POST() {
  try {
    // Try to seed database
    try {
      const { prisma } = await import("@/lib/db")
      
      // First, create categories
      for (const category of SAMPLE_CATEGORIES) {
        await prisma.category.upsert({
          where: { key: category.key },
          update: {
            name: category.name,
            slug: category.slug,
            description: category.description,
          },
          create: {
            key: category.key,
            name: category.name,
            slug: category.slug,
            description: category.description,
          }
        })
      }

      // Then, create products
      for (const product of SAMPLE_PRODUCTS) {
        await prisma.product.upsert({
          where: { id: product.id },
          update: {
            name: product.name,
            categoryKey: product.categoryKey,
            price: product.price,
            image: product.image,
            description: product.description,
            brand: product.brand,
            rating: product.rating,
            reviews: product.reviews,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            featured: product.featured,
          },
          create: {
            id: product.id,
            name: product.name,
            categoryKey: product.categoryKey,
            price: product.price,
            image: product.image,
            description: product.description,
            brand: product.brand,
            rating: product.rating,
            reviews: product.reviews,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            featured: product.featured,
          }
        })
      }

      return NextResponse.json({ 
        success: true,
        message: "Database seeded successfully!",
        productsSeeded: SAMPLE_PRODUCTS.length,
        categoriesSeeded: SAMPLE_CATEGORIES.length
      })
    } catch (dbError) {
      console.warn("Database not available, cannot seed:", dbError)
      return NextResponse.json(
        { 
          error: "Database not available - cannot seed products",
          message: "Products are available as mock data"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    )
  }
}

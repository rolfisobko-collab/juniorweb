import { NextResponse } from "next/server"

// Mock products for when database is not available
const MOCK_PRODUCTS = [
  {
    id: "db-1",
    name: "iPhone 15 Pro Max - Base de Datos",
    categoryKey: "electronics",
    price: 1299,
    image: "/iphone-15-pro-max-premium-smartphone.jpg",
    description: "El smartphone más avanzado con chip A17 Pro y cámara profesional (Desde BD)",
    brand: "Apple",
    rating: 4.9,
    reviews: 1234,
    inStock: true,
    stockQuantity: 25,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      key: "electronics",
      name: "Electrónica",
      slug: "electronics",
      description: "Productos electrónicos modernos"
    }
  },
  {
    id: "db-2",
    name: "MacBook Pro 16\" - Base de Datos",
    categoryKey: "electronics",
    price: 2599,
    image: "/macbook-pro-16-inch-laptop-premium.jpg",
    description: "Potencia extrema con chip M3 Max para profesionales creativos (Desde BD)",
    brand: "Apple",
    rating: 4.8,
    reviews: 987,
    inStock: true,
    stockQuantity: 15,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      key: "electronics",
      name: "Electrónica",
      slug: "electronics",
      description: "Productos electrónicos modernos"
    }
  },
  {
    id: "db-3",
    name: "Sony WH-1000XM5 - Base de Datos",
    categoryKey: "electronics",
    price: 429,
    image: "/sony-premium-noise-cancelling-headphones.jpg",
    description: "Auriculares premium con cancelación de ruido líder en la industria (Desde BD)",
    brand: "Sony",
    rating: 4.7,
    reviews: 2341,
    inStock: true,
    stockQuantity: 30,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      key: "electronics",
      name: "Electrónica",
      slug: "electronics",
      description: "Productos electrónicos modernos"
    }
  },
  {
    id: "db-4",
    name: "Samsung OLED 4K 65\" - Base de Datos",
    categoryKey: "appliances",
    price: 1999,
    image: "/samsung-oled-tv-65-inch-premium.jpg",
    description: "Televisor OLED 4K con calidad de imagen cinematográfica (Desde BD)",
    brand: "Samsung",
    rating: 4.9,
    reviews: 543,
    inStock: true,
    stockQuantity: 8,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      key: "appliances",
      name: "Electrodomésticos",
      slug: "appliances",
      description: "Electrodomésticos modernos"
    }
  },
  {
    id: "db-5",
    name: "Chanel N°5 - Base de Datos",
    categoryKey: "perfumes",
    price: 179,
    image: "/chanel-no-5-perfume-bottle-luxury.jpg",
    description: "El perfume icónico que define la elegancia atemporal (Desde BD)",
    brand: "Chanel",
    rating: 4.9,
    reviews: 3421,
    inStock: true,
    stockQuantity: 20,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      key: "perfumes",
      name: "Perfumes",
      slug: "perfumes",
      description: "Fragancias de lujo"
    }
  }
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sort = searchParams.get("sort")
    const search = (searchParams.get("search") ?? "").trim()

    // Always use mock products for now since database is not configured
    let products = MOCK_PRODUCTS
    
    // Filter products based on params
    if (category && category !== "all") {
      products = products.filter(p => p.categoryKey === category)
    }

    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice))
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice))
    }

    // Apply sorting
    products.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "rating_desc":
          return b.rating - a.rating
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return (b.featured ? -1 : 1) || a.name.localeCompare(b.name)
      }
    })

    const paginatedProducts = products.slice((page - 1) * limit, page * limit)
    const total = products.length
    
    return NextResponse.json({ 
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      fromMock: true
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    )
  }
}

function parseSort(sort: string | null): { [key: string]: "asc" | "desc" }[] {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }]
    case "price_desc":
      return [{ price: "desc" }]
    case "rating_desc":
      return [{ rating: "desc" }]
    case "latest":
      return [{ createdAt: "desc" }]
    default:
      return [{ featured: "desc" }, { name: "asc" }]
  }
}

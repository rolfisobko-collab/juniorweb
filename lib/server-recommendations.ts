import type { Product } from "./products-data"
import { products } from "./products-data"

// Server-side version of getLatestProducts
export function getLatestProductsServer(limit = 8): Product[] {
  // Los últimos productos son los que tienen ID más alto
  return [...products].reverse().slice(0, limit)
}

// Server-side version of getRecommendedProducts (simplified for server)
export function getRecommendedProductsServer(limit = 8): Product[] {
  // For server-side, we'll just return featured products as recommendations
  // In a real app, this would use more sophisticated recommendation logic
  return products.filter((p) => p.featured).slice(0, limit)
}

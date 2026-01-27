import { getCategoriesFromDB } from "@/lib/products-server"
import ProductsClient from "./products-client"

export default async function ProductsServer({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; subcategory?: string; sort?: string }>
}) {
  // Await searchParams en Next.js 16
  const resolvedSearchParams = await searchParams
  
  // Obtener categorías desde la base de datos
  const categories = await getCategoriesFromDB()

  return (
    <ProductsClient 
      initialProducts={[]} // Comenzar con array vacío y cargar desde API
      categories={categories}
      initialCategory={resolvedSearchParams?.category}
      initialSubcategory={resolvedSearchParams?.subcategory}
    />
  )
}

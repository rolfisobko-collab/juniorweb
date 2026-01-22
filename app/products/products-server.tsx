import { getCategoriesFromDB } from "@/lib/products-server"
import ProductsClient from "./products-client"

export default async function ProductsServer({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string }
}) {
  // Obtener categorías desde la base de datos
  const categories = await getCategoriesFromDB()

  return (
    <ProductsClient 
      initialProducts={[]} // Comenzar con array vacío y cargar desde API
      categories={categories}
      initialCategory={searchParams?.category}
    />
  )
}

import { Suspense } from "react"
import ProductsContent from "./products-content"

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string }
}) {
  return (
    <Suspense fallback={null}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}

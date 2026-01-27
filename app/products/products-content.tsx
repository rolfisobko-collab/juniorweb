import ProductsServer from "./products-server"

export default function ProductsContent({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; subcategory?: string; sort?: string }>
}) {
  return <ProductsServer searchParams={searchParams} />
}

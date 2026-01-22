import ProductsServer from "./products-server"

export default function ProductsContent({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string }
}) {
  return <ProductsServer searchParams={searchParams} />
}

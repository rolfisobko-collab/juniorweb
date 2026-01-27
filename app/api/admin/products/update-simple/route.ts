import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    if (!id) return NextResponse.json({ error: "Missing product ID" }, { status: 400 })

    const body = await req.json()
    console.log('🔄 UPDATE SIMPLE - Updating product:', id, body)

    // Usar SQL directo para evitar problemas con weight
    await prisma.$executeRaw`
      UPDATE "Product" 
      SET 
        name = ${body.name},
        brand = ${body.brand},
        description = ${body.description},
        price = ${body.price},
        "categoryKey" = ${body.categoryKey},
        image = ${body.image},
        "inStock" = ${body.inStock ?? true},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `

    // Obtener el producto actualizado
    const updatedProduct = await prisma.$queryRaw`
      SELECT id, name, brand, price, "categoryKey", image, description, rating, reviews, "inStock"
      FROM "Product" 
      WHERE id = ${id}
    `

    console.log('✅ Product updated successfully')
    return NextResponse.json({ product: updatedProduct[0] })
  } catch (error) {
    console.error('❌ UPDATE SIMPLE - Error:', error)
    return NextResponse.json({ 
      error: "Failed to update product",
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

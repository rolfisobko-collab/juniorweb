import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    
    if (!id) return NextResponse.json({ error: "Missing product ID" }, { status: 400 })

    console.log('🗑️ DELETE SIMPLE - Deleting product:', id)

    // Verificar que el producto existe
    const product = await prisma.$queryRaw`
      SELECT id FROM "Product" WHERE id = ${id}
    `

    if (!product || (product as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Eliminar el producto usando SQL directo
    await prisma.$executeRaw`
      DELETE FROM "Product" WHERE id = ${id}
    `

    console.log('✅ Product deleted successfully:', id)
    return NextResponse.json({ success: true, message: "Product deleted successfully" })

  } catch (error) {
    console.error('❌ DELETE SIMPLE - Error:', error)
    return NextResponse.json({ 
      error: "Failed to delete product",
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

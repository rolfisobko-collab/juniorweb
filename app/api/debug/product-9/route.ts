import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const product = await prisma.product.findUnique({
      where: { id: "9" },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Producto no encontrado"
      })
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        length: product.length,
        width: product.width,
        height: product.height,
        valorDeclarado: (product as any).valorDeclarado,
        descripcionAduana: (product as any).descripcionAduana,
        categoriaArancelaria: (product as any).categoriaArancelaria,
        paisOrigen: (product as any).paisOrigen,
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

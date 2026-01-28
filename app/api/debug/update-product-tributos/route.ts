import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const { productId, valorDeclarado, descripcionAduana, categoriaArancelaria, paisOrigen } = await request.json()

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: "productId es requerido"
      }, { status: 400 })
    }

    // Actualizar el producto con los datos de tributos
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        valorDeclarado: valorDeclarado ? parseFloat(valorDeclarado) : null,
        descripcionAduana: descripcionAduana || null,
        categoriaArancelaria: categoriaArancelaria || null,
        paisOrigen: paisOrigen || null,
      } as any
    })

    console.log('✅ Tributos actualizados:', productId)

    return NextResponse.json({
      success: true,
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error actualizando tributos:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Obtener un producto de la base de datos para verificar su estructura
    const product = await prisma.product.findFirst({
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "No se encontraron productos en la base de datos"
      })
    }

    // Obtener todos los campos del producto
    const productFields = Object.keys(product).reduce((acc, key) => {
      const productKey = key as keyof typeof product
      acc[key] = {
        value: product[productKey],
        type: typeof product[productKey],
        isNull: product[productKey] === null,
        isUndefined: product[productKey] === undefined
      }
      return acc
    }, {} as any)

    return NextResponse.json({
      success: true,
      product_id: product.id,
      product_name: product.name,
      fields: productFields,
      has_dimensions: {
        weight: !!product.weight,
        length: !!product.length,
        width: !!product.width,
        height: !!product.height
      },
      missing_for_aex: {
        valor_declarado: !('valorDeclarado' in product),
        descripcion_aduana: !('descripcionAduana' in product),
        categoria_arancelaria: !('categoriaArancelaria' in product),
        pais_origen: !('paisOrigen' in product)
      },
      has_tributos: {
        valorDeclarado: !!(product as any).valorDeclarado,
        descripcionAduana: !!(product as any).descripcionAduana,
        categoriaArancelaria: !!(product as any).categoriaArancelaria,
        paisOrigen: !!(product as any).paisOrigen
      }
    })

  } catch (error) {
    console.error('Error verificando estructura de productos:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

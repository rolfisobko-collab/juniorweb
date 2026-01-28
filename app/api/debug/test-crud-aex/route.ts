import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST() {
  try {
    // 1. Crear un producto de prueba con todos los campos AEX
    const testProduct = {
      id: `test-${Date.now()}`, // ID requerido
      name: "Producto Test AEX",
      brand: "TestBrand",
      description: "Producto de prueba para verificar campos AEX",
      price: 99.99,
      categoryKey: "electronics",
      image: "/test-product.jpg",
      inStock: true,
      rating: 4.5, // Campo requerido
      reviews: 10, // Campo requerido
      // Campos de AEX - Dimensiones
      weight: 1.5,
      length: 30,
      width: 20,
      height: 15,
      // Campos de AEX - Tributos
      valorDeclarado: 99.99,
      descripcionAduana: "Producto electrónico de prueba para importación",
      categoriaArancelaria: "8517.12.00",
      paisOrigen: "China",
    }

    console.log('🆕 Creando producto de prueba con campos AEX...')
    
    const createdProduct = await prisma.product.create({
      data: testProduct
    } as any)

    console.log('✅ Producto creado:', createdProduct.id)

    // 2. Leer el producto para verificar que todos los campos se guardaron
    const readProduct = await prisma.product.findUnique({
      where: { id: createdProduct.id }
    })

    console.log('📖 Producto leído de la BD')

    // 3. Actualizar el producto con diferentes valores AEX
    const updatedProduct = await prisma.product.update({
      where: { id: createdProduct.id },
      data: {
        valorDeclarado: 150.00,
        descripcionAduana: "Producto electrónico actualizado - versión mejorada",
        categoriaArancelaria: "8517.13.00",
        paisOrigen: "Corea del Sur",
      } as any
    })

    console.log('🔄 Producto actualizado')

    // 4. Verificar campos finales
    const finalProduct = await prisma.product.findUnique({
      where: { id: createdProduct.id }
    })

    // 5. Limpiar - eliminar el producto de prueba
    await prisma.product.delete({
      where: { id: createdProduct.id }
    })

    console.log('🗑️ Producto de prueba eliminado')

    return NextResponse.json({
      success: true,
      test_results: {
        created: {
          id: createdProduct.id,
          name: createdProduct.name,
          hasAexFields: {
            weight: !!createdProduct.weight,
            length: !!createdProduct.length,
            width: !!createdProduct.width,
            height: !!createdProduct.height,
            valorDeclarado: !!(createdProduct as any).valorDeclarado,
            descripcionAduana: !!(createdProduct as any).descripcionAduana,
            categoriaArancelaria: !!(createdProduct as any).categoriaArancelaria,
            paisOrigen: !!(createdProduct as any).paisOrigen,
          }
        },
        updated: {
          valorDeclarado: (updatedProduct as any).valorDeclarado,
          descripcionAduana: (updatedProduct as any).descripcionAduana,
          categoriaArancelaria: (updatedProduct as any).categoriaArancelaria,
          paisOrigen: (updatedProduct as any).paisOrigen,
        },
        final: {
          allFieldsPresent: !!(
            finalProduct?.weight &&
            finalProduct?.length &&
            finalProduct?.width &&
            finalProduct?.height &&
            (finalProduct as any).valorDeclarado &&
            (finalProduct as any).descripcionAduana &&
            (finalProduct as any).categoriaArancelaria &&
            (finalProduct as any).paisOrigen
          )
        }
      },
      message: "✅ CRUD de productos con campos AEX funciona correctamente"
    })

  } catch (error) {
    console.error('❌ Error en prueba CRUD AEX:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

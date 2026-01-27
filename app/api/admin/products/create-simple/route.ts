import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log('🚀 SIMPLE CREATE - Product data:', body)

    // Validación básica
    if (!body.name || !body.brand || !body.description || !body.price || !body.categoryKey || !body.image) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Insert directo con SQL para evitar problemas de Prisma
    const productId = crypto.randomUUID()
    
    const result = await prisma.$executeRaw`
      INSERT INTO "Product" (
        id, name, brand, description, price, "categoryKey", image, 
        rating, reviews, "inStock", "stockQuantity", featured, 
        "createdAt", "updatedAt"
      ) VALUES (
        ${productId}, ${body.name}, ${body.brand}, ${body.description}, 
        ${body.price}, ${body.categoryKey}, ${body.image}, 
        0, 0, ${body.inStock ?? true}, 50, ${body.featured ?? false},
        NOW(), NOW()
      )
      RETURNING id, name, brand, price, "categoryKey", image
    `
    
    console.log('✅ SIMPLE CREATE - Product created:', productId)

    // Obtener el producto creado
    const createdProduct = await prisma.$queryRaw`
      SELECT id, name, brand, price, "categoryKey", image, description, rating, reviews, "inStock"
      FROM "Product" 
      WHERE id = ${productId}
    `

    return NextResponse.json({ 
      success: true,
      product: createdProduct[0]
    })

  } catch (error) {
    console.error('❌ SIMPLE CREATE - Error:', error)
    return NextResponse.json({ 
      error: "Error al crear producto",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log('🔍 Testing products without auth...')
    
    const products = await prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        price: true,
        brand: true,
        categoryKey: true,
        description: true,
        inStock: true,
        rating: true,
        reviews: true,
        image: true,
      }
    })
    
    console.log('✅ Found products:', products.length)

    return NextResponse.json({ 
      success: true,
      count: products.length,
      products 
    })
    
  } catch (error) {
    console.error('❌ Products test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

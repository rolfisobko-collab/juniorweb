import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Simple connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection OK')
    
    // Test 2: Check if Product table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Product'
      ) as exists
    `
    console.log('📊 Product table exists:', tableExists)
    
    // Test 3: Count products (if table exists)
    if ((tableExists as any)[0]?.exists) {
      const count = await prisma.product.count()
      console.log('📦 Product count:', count)
      
      // Test 4: Get first 3 products
      const products = await prisma.product.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          price: true,
          brand: true,
          categoryKey: true,
        }
      })
      console.log('📦 Sample products:', products)
      
      return NextResponse.json({
        success: true,
        connection: 'OK',
        tableExists: true,
        productCount: count,
        sampleProducts: products
      })
    } else {
      return NextResponse.json({
        success: true,
        connection: 'OK',
        tableExists: false,
        message: 'Product table does not exist'
      })
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

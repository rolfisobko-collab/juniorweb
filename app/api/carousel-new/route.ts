import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Usar SQL directo para evitar problemas con Prisma
    const slides = await prisma.$queryRaw`
      SELECT 
        id::text as id,
        "imageDesktop" as "imageDesktop",
        "imageMobile" as "imageMobile",
        position,
        "isActive" as "isActive"
      FROM "CarouselSlide" 
      WHERE "isActive" = true
      ORDER BY position ASC
    `

    console.log('🎠 Public carousel slides loaded:', slides)
    return NextResponse.json({ slides })
  } catch (error) {
    console.error("Error fetching carousel slides:", error)
    
    // Si la tabla no existe, devolver array vacío
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.log('📋 CarouselSlide table does not exist, returning empty array')
      return NextResponse.json({ slides: [] })
    }
    
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 })
  }
}

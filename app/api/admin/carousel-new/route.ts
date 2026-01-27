import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdminId } from "@/lib/admin-session"

export async function GET() {
  try {
    const adminId = await requireAdminId()
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Usar SQL directo para evitar problemas con Prisma
    const slides = await prisma.$queryRaw`
      SELECT 
        id::text as id,
        "imageDesktop" as "imageDesktop",
        "imageMobile" as "imageMobile",
        position,
        "isActive" as "isActive"
      FROM "CarouselSlide" 
      ORDER BY position ASC
    `

    console.log('🎠 Carousel slides loaded:', slides)
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

export async function POST(req: Request) {
  try {
    const adminId = await requireAdminId()
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { imageDesktop, imageMobile, position, isActive } = body

    if (!imageDesktop) {
      return NextResponse.json({ error: "Desktop image is required" }, { status: 400 })
    }

    // Crear tabla si no existe
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "CarouselSlide" (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
        "imageDesktop" TEXT NOT NULL,
        "imageMobile" TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insertar nuevo slide con SQL directo
    const result = await prisma.$queryRaw`
      INSERT INTO "CarouselSlide" ("imageDesktop", "imageMobile", position, "isActive")
      VALUES (${imageDesktop}, ${imageMobile || null}, ${position ?? 0}, ${isActive ?? true})
      RETURNING id, "imageDesktop", "imageMobile", position, "isActive"
    `

    console.log('✅ Carousel slide created:', result)
    return NextResponse.json({ slide: (result as any[])[0] })
  } catch (error) {
    console.error("Error creating carousel slide:", error)
    return NextResponse.json({ 
      error: "Failed to create slide",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

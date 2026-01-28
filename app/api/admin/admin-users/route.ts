import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    console.log('📋 Getting admin users...')
    
    const adminUsers = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
        lastLogin: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`✅ Found ${adminUsers.length} admin users`)

    return NextResponse.json({
      success: true,
      users: adminUsers
    })

  } catch (error) {
    console.error('❌ Error getting admin users:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('👤 Creating admin user:', body)

    const { name, email, username, password, role, permissions, active } = body

    // Validaciones básicas
    if (!name || !email || !username || !password || !role) {
      return NextResponse.json({
        success: false,
        error: "Faltan campos requeridos: name, email, username, password, role"
      }, { status: 400 })
    }

    // Verificar si ya existe el email o username
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: existingUser.email === email ? "El email ya está registrado" : "El username ya está registrado"
      }, { status: 400 })
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Crear usuario
    const newAdminUser = await prisma.adminUser.create({
      data: {
        id: `admin-${Date.now()}`, // Generar ID único
        name,
        email,
        username,
        passwordHash,
        role,
        permissions: permissions || [],
        active: active ?? true
      } as any, // Usar any para evitar problemas de tipo con Prisma
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
        lastLogin: true
      }
    })

    console.log('✅ Admin user created:', newAdminUser.id)

    return NextResponse.json({
      success: true,
      user: newAdminUser
    })

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await req.json()
    console.log('🔄 Updating admin user:', id, body)

    const { name, email, username, password, role, permissions, active } = body

    // Validaciones básicas
    if (!name || !email || !username || !role) {
      return NextResponse.json({
        success: false,
        error: "Faltan campos requeridos: name, email, username, role"
      }, { status: 400 })
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: "Usuario no encontrado"
      }, { status: 404 })
    }

    // Verificar si ya existe el email o username (excluyendo el usuario actual)
    const duplicateUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ],
        NOT: { id }
      }
    })

    if (duplicateUser) {
      return NextResponse.json({
        success: false,
        error: duplicateUser.email === email ? "El email ya está registrado" : "El username ya está registrado"
      }, { status: 400 })
    }

    // Preparar datos de actualización
    const updateData: any = {
      name,
      email,
      username,
      role,
      permissions: permissions || [],
      active: active ?? true
    }

    // Si se proporciona nueva contraseña, hashearla
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10)
      updateData.passwordHash = await bcrypt.hash(password, salt)
    }

    // Actualizar usuario
    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
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

    console.log('✅ Admin user updated:', updatedUser.id)

    return NextResponse.json({
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('❌ Error updating admin user:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    console.log('🗑️ Deleting admin user:', id)

    // Verificar si el usuario existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: "Usuario no encontrado"
      }, { status: 404 })
    }

    // Eliminar usuario
    await prisma.adminUser.delete({
      where: { id }
    })

    console.log('✅ Admin user deleted:', id)

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado correctamente"
    })

  } catch (error) {
    console.error('❌ Error deleting admin user:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

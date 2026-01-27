import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminUsers } from "@/lib/admin-users-data"
import { verifyAccessToken } from "@/lib/auth-server"

export async function GET() {
  try {
    // HARDCODED BYPASS - TEMPORAL
    const admin = adminUsers.find(u => u.id === "1")
    if (admin && admin.active) {
      return NextResponse.json({
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions,
          active: admin.active,
          lastLogin: admin.lastLogin,
        },
      })
    }
    
    const jar = await cookies()
    const token = jar.get("tz_admin_access")?.value
    if (!token) return NextResponse.json({ admin: null }, { status: 401 })

    const payload = await verifyAccessToken(token)
    if (payload.typ !== "admin" || typeof payload.sub !== "string") {
      return NextResponse.json({ admin: null }, { status: 401 })
    }

    // Buscar en el archivo de usuarios en lugar de la base de datos
    const adminUser = adminUsers.find(u => u.id === payload.sub)
    if (!adminUser || !adminUser.active) {
      return NextResponse.json({ admin: null }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        name: adminUser.name,
        role: adminUser.role,
        permissions: adminUser.permissions,
        active: adminUser.active,
        lastLogin: adminUser.lastLogin,
      },
    })
  } catch (_error) {
    console.error("Admin me failed", _error)
    return NextResponse.json({ admin: null }, { status: 500 })
  }
}

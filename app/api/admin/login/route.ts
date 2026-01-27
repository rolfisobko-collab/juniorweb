import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminUsers, initializePasswordHashes } from "@/lib/admin-users-data"
import { cookieOptions, generateRefreshToken, hashToken, signAccessToken, verifyPassword } from "@/lib/auth-server"

export const runtime = "nodejs"

// Inicializar hashes de contraseñas
let initialized = false
const ensureHashesInitialized = async () => {
  if (!initialized) {
    await initializePasswordHashes()
    initialized = true
  }
}

export async function POST(req: Request) {
  try {
    // HARDCODED BYPASS - TEMPORAL
    const admin = adminUsers.find(u => u.id === "1")
    if (admin && admin.active) {
      const accessToken = await signAccessToken({ sub: admin.id, typ: "admin" }, "15m")
      const refreshToken = generateRefreshToken()

      const jar = await cookies()
      jar.set("tz_admin_access", accessToken, { ...cookieOptions(), maxAge: 60 * 15 })
      jar.set("tz_admin_refresh", refreshToken, { ...cookieOptions(), maxAge: 60 * 60 * 24 * 30 })

      return NextResponse.json({
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          name: admin.name,
          role: admin.role,
          permissions: admin.permissions,
        },
      })
    }
    
    await ensureHashesInitialized()
    
    const body = (await req.json()) as { username?: string; password?: string }
    const username = (body.username ?? "").trim()
    const password = body.password ?? ""

    if (!username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Buscar en el archivo de usuarios en lugar de la base de datos
    const adminUser = adminUsers.find(u => u.username === username)
    if (!adminUser || !adminUser.active) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const ok = await verifyPassword(password, adminUser.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simular actualización de último login (no se puede guardar en archivo)
    console.log(`Admin ${adminUser.username} logged in at ${new Date()}`)

    const accessTokenUser = await signAccessToken({ sub: adminUser.id, typ: "admin" }, "15m")
    const refreshTokenUser = generateRefreshToken()

    const jar = await cookies()
    jar.set("tz_admin_access", accessTokenUser, { ...cookieOptions(), maxAge: 60 * 15 })
    jar.set("tz_admin_refresh", refreshTokenUser, { ...cookieOptions(), maxAge: 60 * 60 * 24 * 30 })

    return NextResponse.json({
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        name: adminUser.name,
        role: adminUser.role,
        permissions: adminUser.permissions,
      },
    })
  } catch (_error) {
    console.error("Admin login failed", _error)
    return NextResponse.json({ error: "Admin login failed", detail: String(_error) }, { status: 500 })
  }
}

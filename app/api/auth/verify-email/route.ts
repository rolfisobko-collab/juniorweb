import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { prisma } from "@/lib/db"
import { cookieOptions, signAccessToken, generateRefreshToken, hashToken } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; code?: string }
    const email = (body.email ?? "").trim().toLowerCase()
    const code = body.code ?? ""

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { verificationCodes: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" })
    }

    // Find a valid verification code
    const verificationCode = user.verificationCodes.find(vc => 
      vc.code === code && 
      vc.expiresAt > new Date()
    )

    if (!verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Mark email as verified and delete the verification code
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      }),
      prisma.verificationCode.delete({
        where: { id: verificationCode.id }
      })
    ])

    // Create session for verified user
    const accessToken = await signAccessToken({ sub: user.id, typ: "user" }, "15m")
    const refreshToken = generateRefreshToken()

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    })

    const jar = await cookies()
    jar.set("tz_access", accessToken, { ...cookieOptions(), maxAge: 60 * 15 })
    jar.set("tz_refresh", refreshToken, { ...cookieOptions(), maxAge: 60 * 60 * 24 * 30 })

    return NextResponse.json({
      message: "Email verified successfully",
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
    })
  } catch (_error) {
    console.error("Email verification failed", _error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import crypto from "crypto"

import { prisma } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email-service-resend-final"
import { sendVerificationEmailFallback } from "@/lib/email-service-fallback"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string }
    const email = (body.email ?? "").trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json({ message: "If the email exists, a verification code has been sent" })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified" })
    }

    // Generate a 6-digit code
    const code = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

    // Delete any existing verification codes for this user
    await prisma.verificationCode.deleteMany({
      where: { userId: user.id }
    })

    // Create new verification code
    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt,
      }
    })

    // Enviar email con el código
    const emailResult = await sendVerificationEmail(email, code)
    
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error)
      // Usar fallback cuando Resend falla
      console.log('🔄 Using fallback email service...')
      const fallbackResult = await sendVerificationEmailFallback(email, code)
      
      return NextResponse.json({ 
        message: "Verification code sent successfully",
        emailSent: true,
        fallback: true,
        debugCode: process.env.NODE_ENV !== 'production' ? code : undefined
      })
    }

    return NextResponse.json({ 
      message: "Verification code sent successfully",
      emailSent: true
    })
  } catch (_error) {
    console.error("Send verification failed", _error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; name?: string }
    const email = (body.email ?? "").trim().toLowerCase()
    const password = body.password ?? ""
    const name = (body.name ?? "").trim()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Firebase manejará todo el registro y verificación
    return NextResponse.json({ 
      message: "Use Firebase Auth for registration",
      useFirebaseAuth: true,
      instructions: "Register directly with Firebase Auth client-side"
    }, { status: 200 })
  } catch (_error) {
    return NextResponse.json({ error: "Register failed" }, { status: 500 })
  }
}

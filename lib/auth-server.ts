import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("Missing JWT_SECRET")
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function generateRefreshToken() {
  const array = new Uint8Array(48)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

export function hashToken(token: string) {
  return bcrypt.hashSync(token, 10)
}

export async function verifyTokenHash(token: string, hash: string) {
  return bcrypt.compare(token, hash)
}

export async function signAccessToken(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret())
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret())
  return payload
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}

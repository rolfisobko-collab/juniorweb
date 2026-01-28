"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Mail, ArrowLeft, CheckCircle } from "lucide-react"

function VerifyEmailContent() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [resendMessage, setResendMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!code || code.length !== 6) {
      setError("El código debe tener 6 dígitos")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Código inválido")
      }

      setIsVerified(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar el código")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    setResendMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el código")
      }

      setResendMessage(`Código enviado a ${email}`)
      if (data.devCode) {
        setResendMessage(prev => `${prev} (Código de desarrollo: ${data.devCode})`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reenviar el código")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Left Side - Visual */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-900 via-green-800 to-green-950 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10 max-w-md flex flex-col items-center">
            <CheckCircle className="w-24 h-24 mb-8 text-green-300" />
            <h1 className="text-4xl font-bold mb-4">¡Verificado!</h1>
            <p className="text-xl text-green-100">Tu cuenta ha sido verificada exitosamente</p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md text-center">
            <div className="md:hidden mb-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Email Verificado!</h1>
            <p className="text-gray-600 mb-8">
              Tu cuenta ha sido verificada exitosamente. Serás redirigido automáticamente...
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="w-full"
            >
              Ir al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-blue-900/30"></div>
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <Link href="/" className="mb-8">
            <img 
              src="/logo-optimized.png" 
              alt="TechZone" 
              className="h-32 w-auto object-contain drop-shadow-2xl"
              width="400"
              height="136"
            />
          </Link>
          <Mail className="w-24 h-24 mb-8 text-blue-300" />
          <h1 className="text-4xl font-bold mb-4">Verifica tu Email</h1>
          <p className="text-xl text-blue-100">Te enviamos un código de 6 dígitos</p>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center justify-center mb-8">
            <img 
              src="/logo-optimized.png" 
              alt="TechZone" 
              className="h-12 w-auto object-contain"
              width="150"
              height="51"
            />
          </Link>

          {/* Back Button */}
          <Link 
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al login
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="md:hidden text-center mb-6">
              <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu Email</h1>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Enviamos un código de verificación a:<br />
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </Label>
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-2xl font-mono"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {resendMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {resendMessage}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Verificando..." : "Verificar Email"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                ¿No recibiste el código?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm"
              >
                {isLoading ? "Enviando..." : "Reenviar código"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

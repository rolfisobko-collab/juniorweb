"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"

function ResetPasswordConfirmContent() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidCode, setIsValidCode] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const oobCode = searchParams.get("oobCode")

  useEffect(() => {
    const validateResetCode = async () => {
      if (!mode || !oobCode) {
        setError("Link de recuperación inválido")
        return
      }

      try {
        await verifyPasswordResetCode(auth, oobCode)
        setIsValidCode(true)
      } catch (err: any) {
        console.error("Invalid reset code:", err)
        setError("Link de recuperación inválido o expirado")
      }
    }

    validateResetCode()
  }, [mode, oobCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      await confirmPasswordReset(auth, oobCode!, newPassword)
      setIsReset(true)
      
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password reset error:", err)
      setError(err.message || "Error al restablecer contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidCode && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Inválido</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/reset-password">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                Solicitar nuevo link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Contraseña Restablecida!</h1>
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión...
            </p>
            <Link href="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                Ir al inicio de sesión
              </Button>
            </Link>
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
        </div>
      </div>

      {/* Right Side - Form */}
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Contraseña</h1>
            <p className="text-gray-600">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-blue-400/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Actualizar Contraseña"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmContent />
    </Suspense>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, AlertCircle, Loader2 } from "lucide-react"
import { getAuth, applyActionCode, checkActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const oobCode = searchParams.get("oobCode")
  const continueUrl = searchParams.get("continueUrl")

  useEffect(() => {
    const handleEmailVerification = async () => {
      if (!mode || !oobCode) {
        setError("Link de verificación inválido")
        setIsLoading(false)
        return
      }

      try {
        if (mode === "verifyEmail") {
          // Aplicar verificación de email
          await applyActionCode(auth, oobCode)
          setIsVerified(true)
          
          // Recargar el usuario para obtener el estado actualizado
          await auth.currentUser?.reload()
          
          setTimeout(() => {
            router.push(continueUrl || "/")
          }, 3000)
        } else if (mode === "resetPassword") {
          // Redirigir a página de reset con el código
          router.push(`/reset-password?mode=resetPassword&oobCode=${oobCode}`)
        } else {
          setError("Modo no soportado")
        }
      } catch (err: any) {
        console.error("Email verification error:", err)
        setError(err.message || "Error al verificar email")
      } finally {
        setIsLoading(false)
      }
    }

    handleEmailVerification()
  }, [mode, oobCode, continueUrl, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Verificando email...</h2>
          <p className="text-gray-600 mt-2">Por favor espera un momento</p>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Email Verificado!</h1>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido verificada exitosamente. Serás redirigido automáticamente...
            </p>
            <Link href="/">
              <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                Ir al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Error de Verificación</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                Ir al inicio de sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full h-12 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300">
                Crear una cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

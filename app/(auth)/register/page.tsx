"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Chrome, Facebook, Sparkles, Lock, Mail, User } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register, loginWithGoogle, loginWithFacebook, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    try {
      await register(email, password, name)
      router.push("/")
    } catch (err) {
      setError("Error al crear la cuenta")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      router.push("/")
    } catch (err) {
      setError("Error al registrarse con Google")
    }
  }

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook()
      router.push("/")
    } catch (err) {
      setError("Error al registrarse con Facebook")
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Visual (sin textos) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-blue-900/30"></div>
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <Link href="/" className="mb-8">
            <img 
              src="https://i.ibb.co/3ysKSJRT/Tech-Zone-store-10.png" 
              alt="TechZone" 
              className="h-32 w-auto object-contain drop-shadow-2xl"
            />
          </Link>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center justify-center mb-8">
            <img 
              src="https://i.ibb.co/3ysKSJRT/Tech-Zone-store-10.png" 
              alt="TechZone" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Únete a TechZone</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-500 border-2 rounded focus:ring-2 focus:ring-blue-500/20"
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer text-gray-700">
                  Acepto{" "}
                  <Link 
                    href="/terminos-y-condiciones" 
                    className="text-blue-500 font-semibold hover:underline"
                    target="_blank"
                  >
                    Términos
                  </Link>
                  {" "}y{" "}
                  <Link 
                    href="/politica-de-privacidad" 
                    className="text-blue-500 font-semibold hover:underline"
                    target="_blank"
                  >
                    Privacidad
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-blue-400/20"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="h-12 border-2 border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-700 hover:text-gray-800 font-medium rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
                <span className="sm:hidden">G</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="h-12 border-2 border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-700 hover:text-gray-800 font-medium rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.01] transition-all duration-200"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden sm:inline">Facebook</span>
                <span className="sm:hidden">F</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

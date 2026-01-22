"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Por favor ingresa tu email")
      setIsLoading(false)
      return
    }

    // Simulate password reset
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Left Side - Visual */}
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

        {/* Right Side - Success Message */}
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

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Revisa tu email</h1>
              <p className="text-gray-600 mb-6">
                Te hemos enviado instrucciones para restablecer tu contraseña a <strong className="text-blue-600">{email}</strong>
              </p>
              <Link href="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-blue-400/20">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
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
              src="https://i.ibb.co/3ysKSJRT/Tech-Zone-store-10.png" 
              alt="TechZone" 
              className="h-32 w-auto object-contain drop-shadow-2xl"
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
              src="https://i.ibb.co/3ysKSJRT/Tech-Zone-store-10.png" 
              alt="TechZone" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">
              Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

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

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-blue-400/20"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

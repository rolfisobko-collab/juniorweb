"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Chrome, Facebook, ShoppingBag, Sparkles, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, loginWithGoogle, loginWithFacebook, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor completa todos los campos")
      return
    }

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError("Credenciales incorrectas")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      router.push("/")
    } catch (err) {
      setError("Error al iniciar sesión con Google")
    }
  }

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook()
      router.push("/")
    } catch (err) {
      setError("Error al iniciar sesión con Facebook")
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary via-primary/90 to-blue-700 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <ShoppingBag className="h-10 w-10" />
            <span className="text-4xl font-bold">TechZone</span>
          </Link>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Bienvenido de vuelta a tu tienda de tecnología premium
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Accede a ofertas exclusivas, realiza seguimiento de tus pedidos y disfruta de una experiencia de compra
            personalizada.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Ofertas Exclusivas</p>
                <p className="text-sm opacity-80">Descuentos solo para miembros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Compras Seguras</p>
                <p className="text-sm opacity-80">Protección en cada transacción</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center gap-2 mb-8 text-primary">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">TechZone</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Iniciar Sesión</h1>
            <p className="text-muted-foreground text-lg">Accede a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">
                  Contraseña
                </Label>
                <Link href="/reset-password" className="text-sm text-primary hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground font-medium">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="h-12 border-2 hover:bg-accent hover:border-primary transition-all bg-transparent"
            >
              <Chrome className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="h-12 border-2 hover:bg-accent hover:border-primary transition-all bg-transparent"
            >
              <Facebook className="mr-2 h-5 w-5" />
              Facebook
            </Button>
          </div>

          <p className="text-center text-base text-muted-foreground mt-8">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

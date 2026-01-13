"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Mail, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Por favor ingresa tu email")
      return
    }

    // Simulate password reset
    setTimeout(() => {
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 text-primary justify-center">
            <ShoppingBag className="h-8 w-8" />
            <span className="text-2xl font-bold">TechZone</span>
          </Link>

          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Revisa tu email</h1>
            <p className="text-muted-foreground mb-6">
              Te hemos enviado instrucciones para restablecer tu contraseña a <strong>{email}</strong>
            </p>
            <Link href="/login">
              <Button className="w-full h-12">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 text-primary justify-center">
          <ShoppingBag className="h-8 w-8" />
          <span className="text-2xl font-bold">TechZone</span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Recuperar Contraseña</h1>
          <p className="text-muted-foreground text-lg">
            Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
          </p>
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

          <Button type="submit" className="w-full h-12 text-base font-semibold">
            Enviar Instrucciones
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

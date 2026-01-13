"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl md:text-4xl font-bold">¡Pedido Confirmado!</h1>
              <p className="text-lg text-muted-foreground">
                Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Número de Pedido</p>
              <p className="font-mono text-2xl font-bold">{orderId}</p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                Hemos enviado un correo de confirmación a <strong>{user?.email}</strong> con los detalles de tu pedido.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link href="/orders">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Package className="mr-2 h-5 w-5" />
                    Ver Mis Pedidos
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Home className="mr-2 h-5 w-5" />
                    Volver al Inicio
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <p className="text-sm text-muted-foreground">
                Recibirás un correo con el número de seguimiento cuando tu pedido sea enviado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  )
}

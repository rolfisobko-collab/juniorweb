"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold">Tu carrito está vacío</h1>
          <p className="text-muted-foreground">Descubre nuestra colección exclusiva de productos premium</p>
          <Link href="/products">
            <Button size="lg" className="h-12 px-8">
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continuar comprando
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="mb-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Carrito de Compras</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </div>

          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Link href={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4 mb-2">
                      <div>
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="flex-shrink-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">${item.price} c/u</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-6">
              <h2 className="font-serif text-2xl font-bold">Resumen del Pedido</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">{total >= 100 ? "Gratis" : "$15.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos estimados</span>
                  <span className="font-medium">${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-3xl font-serif">
                    ${(total + (total >= 100 ? 0 : 15) + total * 0.1).toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full h-12 text-base font-semibold">
                    Proceder al Checkout
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Envío gratuito en compras superiores a $100
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

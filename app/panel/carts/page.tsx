"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Clock, ShoppingCart, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PanelLayout from "@/components/panel-layout"

interface AbandonedCart {
  id: string
  userEmail: string
  userName: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
  total: number
  abandonedAt: string
  daysSinceAbandoned: number
}

export default function AdminCartsPage() {
  const { toast } = useToast()
  const [carts, setCarts] = useState<AbandonedCart[]>([
    {
      id: "1",
      userEmail: "maria@example.com",
      userName: "María Sánchez",
      items: [
        { productName: "iPhone 15 Pro Max", quantity: 1, price: 1299 },
        { productName: "AirPods Pro", quantity: 1, price: 279 },
      ],
      total: 1578,
      abandonedAt: "2024-01-03T14:30:00",
      daysSinceAbandoned: 1,
    },
    {
      id: "2",
      userEmail: "jose@example.com",
      userName: "José Ramírez",
      items: [{ productName: "MacBook Pro 16", quantity: 1, price: 2499 }],
      total: 2499,
      abandonedAt: "2024-01-02T10:15:00",
      daysSinceAbandoned: 2,
    },
    {
      id: "3",
      userEmail: "carmen@example.com",
      userName: "Carmen Torres",
      items: [
        { productName: "Chanel No. 5", quantity: 2, price: 150 },
        { productName: "Dior Sauvage", quantity: 1, price: 120 },
      ],
      total: 420,
      abandonedAt: "2023-12-30T16:45:00",
      daysSinceAbandoned: 5,
    },
  ])

  const handleSendReminder = (cart: AbandonedCart) => {
    toast({
      title: "Recordatorio enviado",
      description: `Se ha enviado un email a ${cart.userEmail}`,
    })
  }

  const handleDeleteCart = (id: string) => {
    setCarts(carts.filter((cart) => cart.id !== id))
    toast({
      title: "Carrito eliminado",
      description: "El carrito abandonado se ha eliminado",
    })
  }

  const getPriorityBadge = (days: number) => {
    if (days <= 1) return <Badge className="bg-red-100 text-red-800">Alta prioridad</Badge>
    if (days <= 3) return <Badge className="bg-orange-100 text-orange-800">Media prioridad</Badge>
    return <Badge className="bg-gray-100 text-gray-800">Baja prioridad</Badge>
  }

  return (
    <PanelLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Carritos Abandonados</h1>
            <p className="text-muted-foreground">Recupera ventas potenciales</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total en carritos</p>
              <p className="text-2xl font-bold">${carts.reduce((sum, cart) => sum + cart.total, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carritos Totales</p>
            </div>
            <p className="text-2xl font-bold">{carts.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Últimas 24h</p>
            </div>
            <p className="text-2xl font-bold">{carts.filter((c) => c.daysSinceAbandoned <= 1).length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Valor Promedio</p>
            </div>
            <p className="text-2xl font-bold">
              ${Math.round(carts.reduce((sum, cart) => sum + cart.total, 0) / carts.length).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Abandonado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cart.userName}</p>
                      <p className="text-sm text-muted-foreground">{cart.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cart.items.length} producto(s)</p>
                      <p className="text-sm text-muted-foreground">{cart.items[0].productName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${cart.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      Hace {cart.daysSinceAbandoned} día{cart.daysSinceAbandoned !== 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(cart.daysSinceAbandoned)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSendReminder(cart)}>
                        <Mail className="h-4 w-4 mr-1" />
                        Enviar email
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCart(cart.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PanelLayout>
  )
}

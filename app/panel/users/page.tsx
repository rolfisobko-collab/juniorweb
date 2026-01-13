"use client"

import { Suspense, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Mail, Phone, MapPin } from "lucide-react"
import PanelLayout from "@/components/panel-layout"

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  joinedDate: string
}

function UsersContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "+34 612 345 678",
      address: "Madrid, España",
      totalOrders: 5,
      totalSpent: 3250,
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Ana García",
      email: "ana.garcia@example.com",
      phone: "+34 623 456 789",
      address: "Barcelona, España",
      totalOrders: 8,
      totalSpent: 5420,
      status: "active",
      joinedDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Miguel Fernández",
      email: "miguel.f@example.com",
      phone: "+34 634 567 890",
      address: "Valencia, España",
      totalOrders: 3,
      totalSpent: 1890,
      status: "active",
      joinedDate: "2024-03-10",
    },
    {
      id: "4",
      name: "Laura Martínez",
      email: "laura.m@example.com",
      phone: "+34 645 678 901",
      address: "Sevilla, España",
      totalOrders: 12,
      totalSpent: 8750,
      status: "active",
      joinedDate: "2023-11-05",
    },
    {
      id: "5",
      name: "David López",
      email: "david.lopez@example.com",
      phone: "+34 656 789 012",
      address: "Bilbao, España",
      totalOrders: 0,
      totalSpent: 0,
      status: "inactive",
      joinedDate: "2024-04-01",
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestiona los usuarios registrados</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gastado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {user.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {user.address}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user.totalOrders}</TableCell>
                <TableCell className="font-semibold">${user.totalSpent.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {user.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.joinedDate).toLocaleDateString("es-ES")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <PanelLayout>
      <Suspense fallback={<div className="p-8">Cargando usuarios...</div>}>
        <UsersContent />
      </Suspense>
    </PanelLayout>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye, EyeOff, UserCog } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { adminUsers, AVAILABLE_PERMISSIONS, type AdminUser, type Permission } from "@/lib/admin-users-data"
import { useAdmin } from "@/lib/admin-context"

export default function AdminUsersContent() {
  const { admin } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<AdminUser[]>(adminUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as AdminUser["role"],
    permissions: [] as Permission[],
    active: true,
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openDialog = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        permissions: user.permissions,
        active: user.active,
      })
    } else {
      setEditingUser(null)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "viewer",
        permissions: [],
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...formData,
                password: formData.password || u.password,
              }
            : u,
        ),
      )
    } else {
      const newUser: AdminUser = {
        id: String(users.length + 1),
        username: formData.email.split("@")[0] || String(users.length + 1),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      setUsers(users.filter((u) => u.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))
  }

  const handlePermissionToggle = (permission: Permission) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permission)
        ? formData.permissions.filter((p) => p !== permission)
        : [...formData.permissions, permission],
    })
  }

  const getRoleBadge = (role: AdminUser["role"]) => {
    const colors = {
      superadmin: "bg-red-500",
      admin: "bg-blue-500",
      editor: "bg-green-500",
      viewer: "bg-gray-500",
    }
    return <Badge className={colors[role]}>{role}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios Admin</h1>
          <p className="text-muted-foreground">Gestiona los usuarios internos del panel de administración</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Total: {users.length} usuarios</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      {!user.active && <Badge variant="outline">Inactivo</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {AVAILABLE_PERMISSIONS.find((p) => p.value === perm)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Creado: {new Date(user.createdAt).toLocaleDateString()}</p>
                    {user.lastLogin && <p>Último acceso: {new Date(user.lastLogin).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(user.id)}
                    title={user.active ? "Desactivar" : "Activar"}
                  >
                    {user.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDialog(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.id !== admin?.id && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Modifica los datos del usuario" : "Crea un nuevo usuario para el panel admin"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@techzone.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña {editingUser && "(dejar vacío para mantener actual)"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? "••••••••" : "Contraseña segura"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">Viewer</p>
                        <p className="text-xs text-muted-foreground">Solo lectura</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">Editor</p>
                        <p className="text-xs text-muted-foreground">Puede editar contenido</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">Gestión completa</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="superadmin">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">Super Admin</p>
                        <p className="text-xs text-muted-foreground">Acceso total</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permisos</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {AVAILABLE_PERMISSIONS.map((permission) => (
                      <div key={permission.value} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.value}
                          checked={formData.permissions.includes(permission.value)}
                          onCheckedChange={() => handlePermissionToggle(permission.value)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={permission.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.label}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
              />
              <label
                htmlFor="active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Usuario activo
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingUser ? "Guardar Cambios" : "Crear Usuario"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

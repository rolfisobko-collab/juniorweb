"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Building, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"

interface Brand {
  id: string
  name: string
  logo: string
  description: string
  website?: string
  createdAt: string
}

interface BrandsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandsModal({ open, onOpenChange }: BrandsModalProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    logo: "",
  })

  // Mock data para marcas (después podemos conectar a BD)
  useEffect(() => {
    const mockBrands: Brand[] = [
      {
        id: "1",
        name: "Apple",
        logo: "https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/brands/apple.png",
        description: "Tecnología innovadora",
        website: "https://apple.com",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2", 
        name: "Samsung",
        logo: "https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/brands/samsung.png",
        description: "Electrónica de consumo",
        website: "https://samsung.com",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "3",
        name: "Nike",
        logo: "https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/brands/nike.png",
        description: "Ropa y calzado deportivo",
        website: "https://nike.com",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ]
    setBrands(mockBrands)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      toast({ 
        title: "Error de validación", 
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive" 
      })
      return
    }

    if (editingBrand) {
      setBrands(
        brands.map((b) =>
          b.id === editingBrand.id
            ? { ...b, ...formData }
            : b,
        ),
      )
      toast({ title: "Marca actualizada", description: "Los cambios se han guardado correctamente" })
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setBrands([newBrand, ...brands])
      toast({ title: "Marca creada", description: "La nueva marca se ha agregado correctamente" })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description,
      website: brand.website || "",
      logo: brand.logo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta marca?")) {
      setBrands(brands.filter((b) => b.id !== id))
      toast({ title: "Marca eliminada", description: "La marca se ha eliminado correctamente" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      website: "",
      logo: "",
    })
    setEditingBrand(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Building className="h-6 w-6" />
            Gestionar Marcas
          </DialogTitle>
          <DialogDescription className="text-base">
            Administra las marcas de productos del catálogo. Agrega logos, descripciones y enlaces.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botón para agregar nueva marca */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Marcas ({brands.length})</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Marca
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    {editingBrand ? "Editar Marca" : <><Plus className="h-5 w-5" /> Nueva Marca</>}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBrand ? "Actualiza la información de la marca existente" : "Agrega una nueva marca al catálogo con logo y descripción"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="brand-name" className="text-base font-medium">Nombre</Label>
                        <Input
                          id="brand-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Apple, Samsung, Nike"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="brand-website" className="text-base font-medium">Website</Label>
                        <Input
                          id="brand-website"
                          type="url"
                          placeholder="https://ejemplo.com"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brand-description" className="text-base font-medium">Descripción</Label>
                      <Input
                        id="brand-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Ej: Tecnología innovadora, Ropa deportiva, Electrónica de consumo"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-base font-medium">Logo de la Marca</Label>
                      <ImageUpload
                        value={formData.logo}
                        onChange={(url) => setFormData({ ...formData, logo: url })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11 px-6">
                      Cancelar
                    </Button>
                    <Button type="submit" className="h-11 px-6">
                      {editingBrand ? "Actualizar Marca" : "Crear Marca"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabla de marcas */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      {brand.logo && (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell>
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visitar
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(brand.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

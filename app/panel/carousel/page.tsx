"use client"

import { Suspense, useEffect, useState } from "react"
import PanelLayout from "@/components/panel-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye, EyeOff, MoveUp, MoveDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"

interface CarouselSlide {
  id: number
  imageDesktop: string
  imageMobile: string
  position: number
  isActive: boolean
}

function CarouselManagementContent() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    imageDesktop: "",
    imageMobile: "",
  })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const res = await fetch("/api/admin/carousel", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!res.ok) return

      const data = (await res.json()) as { slides?: CarouselSlide[] }
      if (!cancelled) setSlides(data.slides || [])
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const resetForm = () => {
    setFormData({
      imageDesktop: "",
      imageMobile: "",
    })
    setEditingSlide(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imageDesktop) {
      toast({ 
        title: "Error de validación", 
        description: "La imagen para desktop es obligatoria",
        variant: "destructive" 
      })
      return
    }

    try {
      const slideData = {
        imageDesktop: formData.imageDesktop,
        imageMobile: formData.imageMobile || formData.imageDesktop, // Usar desktop como fallback
        position: editingSlide ? editingSlide.position : slides.length,
        isActive: true,
      }

      if (editingSlide) {
        const res = await fetch(`/api/admin/carousel/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(slideData),
        })

        if (!res.ok) throw new Error("Error al actualizar slide")

        setSlides(slides.map((s) => (s.id === editingSlide.id ? { ...s, ...slideData } : s)))
        toast({ title: "Slide actualizado", description: "Los cambios se han guardado correctamente" })
      } else {
        const res = await fetch("/api/admin/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(slideData),
        })

        if (!res.ok) throw new Error("Error al crear slide")

        const createdSlide = await res.json()
        setSlides([...slides, createdSlide.slide])
        toast({ title: "Slide creado", description: "El nuevo slide se ha agregado al carrusel" })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving slide:', error)
      toast({ 
        title: "Error", 
        description: "No se pudo guardar el slide",
        variant: "destructive" 
      })
    }
  }

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide)
    setFormData({
      imageDesktop: slide.imageDesktop,
      imageMobile: slide.imageMobile,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/carousel/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!res.ok) throw new Error("Error al eliminar slide")

      setSlides(slides.filter((s) => s.id !== id))
      toast({ title: "Slide eliminado", description: "El slide se ha eliminado del carrusel" })
    } catch (error) {
      console.error('Error deleting slide:', error)
      toast({ 
        title: "Error", 
        description: "No se pudo eliminar el slide",
        variant: "destructive" 
      })
    }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/carousel/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      })

      if (!res.ok) throw new Error("Error al actualizar estado")

      setSlides(slides.map((s) => (s.id === id ? { ...s, isActive } : s)))
      toast({ 
        title: "Estado actualizado", 
        description: `Slide ${isActive ? "activado" : "desactivado"} correctamente` 
      })
    } catch (error) {
      console.error('Error toggling slide:', error)
      toast({ 
        title: "Error", 
        description: "No se pudo actualizar el estado",
        variant: "destructive" 
      })
    }
  }

  const moveSlide = async (id: number, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((s) => s.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return

    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(currentIndex, 1)
    newSlides.splice(newIndex, 0, movedSlide)

    // Update positions
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      position: index,
    }))

    try {
      // Update all slides in bulk
      await Promise.all(
        updatedSlides.map((slide) =>
          fetch(`/api/admin/carousel/${slide.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ position: slide.position }),
          })
        )
      )

      setSlides(updatedSlides)
      toast({ title: "Posición actualizada", description: "El slide ha sido movido correctamente" })
    } catch (error) {
      console.error('Error moving slide:', error)
      toast({ 
        title: "Error", 
        description: "No se pudo mover el slide",
        variant: "destructive" 
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Carrusel</h1>
          <p className="text-muted-foreground">Administra las imágenes del carrusel principal</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Imagen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imágenes del Carrusel</CardTitle>
          <CardDescription>
            Dimensiones recomendadas: Desktop: 1920x600px | Mobile: 800x600px
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posición</TableHead>
                <TableHead>Imagen Desktop</TableHead>
                <TableHead>Imagen Mobile</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides
                .sort((a, b) => a.position - b.position)
                .map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img
                          src={slide.imageDesktop || "/placeholder.svg"}
                          alt={`Desktop ${index + 1}`}
                          className="h-12 w-20 object-cover rounded border"
                        />
                        <span className="text-sm text-muted-foreground truncate max-w-xs">
                          {slide.imageDesktop ? slide.imageDesktop.split('/').pop() : 'Sin imagen'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {slide.imageMobile ? (
                        <div className="flex items-center space-x-2">
                          <img
                            src={slide.imageMobile || "/placeholder.svg"}
                            alt={`Mobile ${index + 1}`}
                            className="h-12 w-20 object-cover rounded border"
                          />
                          <span className="text-sm text-muted-foreground truncate max-w-xs">
                            {slide.imageMobile ? slide.imageMobile.split('/').pop() : 'Sin imagen'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Usa desktop</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={slide.isActive ? "default" : "secondary"}>
                        {slide.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSlide(slide.id, "up")}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSlide(slide.id, "down")}
                          disabled={index === slides.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(slide.id, !slide.isActive)}
                        >
                          {slide.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(slide)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(slide.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Editar Imagen" : "Nueva Imagen"}</DialogTitle>
            <DialogDescription>
              {editingSlide 
                ? "Actualiza las imágenes del slide del carrusel" 
                : "Agrega una nueva imagen al carrusel principal"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="imageDesktop">Imagen Desktop (Obligatorio)</Label>
                <ImageUpload
                  value={formData.imageDesktop}
                  onChange={(url) => setFormData({ ...formData, imageDesktop: url })}
                />
                <p className="text-sm text-muted-foreground">
                  Recomendado: 1920x600px
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageMobile">Imagen Mobile (Opcional)</Label>
                <ImageUpload
                  value={formData.imageMobile}
                  onChange={(url) => setFormData({ ...formData, imageMobile: url })}
                />
                <p className="text-sm text-muted-foreground">
                  Recomendado: 800x600px. Si no se carga, usará la imagen desktop.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingSlide ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CarouselPage() {
  return (
    <PanelLayout>
      <Suspense fallback={<div>Cargando...</div>}>
        <CarouselManagementContent />
      </Suspense>
    </PanelLayout>
  )
}

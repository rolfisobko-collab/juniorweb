"use client"

import type React from "react"
import PanelLayout from "@/components/panel-layout"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Building, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"
import { MediaGallery } from "@/components/media-gallery"
import { BrandsModal } from "@/components/brands-modal"

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isBrandsModalOpen, setIsBrandsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    images: [] as string[],
    videos: [] as string[],
  })

  // Cargar categorías y marcas desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías
        const categoriesRes = await fetch('/api/categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        // Cargar marcas (mock por ahora)
        const mockBrands = [
          { id: "1", name: "Apple" },
          { id: "2", name: "Samsung" },
          { id: "3", name: "Nike" },
          { id: "4", name: "Sony" },
          { id: "5", name: "LG" },
          { id: "6", name: "Dior" },
          { id: "7", name: "Chanel" },
        ]
        setBrands(mockBrands)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(`/api/admin/products?search=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        if (!res.ok) {
          const errorData = await res.json()
          console.error('❌ API Error:', errorData)
          toast({
            title: "Error al cargar productos",
            description: errorData.error || "Error desconocido",
            variant: "destructive"
          })
          return
        }

        const data = (await res.json()) as { products?: any[] }
        console.log('✅ Products loaded:', data.products?.length || 0)
        console.log('📂 Available categories:', categories.map(c => ({ key: c.key, name: c.name })))
        console.log('🔍 Sample product categoryKey:', data.products?.[0]?.categoryKey)
        
        const mapped = (data.products ?? []).map((p) => {
          const category = categories.find((c) => c.key === p.categoryKey)
          console.log(`🏷️ Product ${p.name}: categoryKey=${p.categoryKey}, found=${!!category}, categoryName=${category?.name}`)
          
          return {
            id: p.id,
            name: p.name,
            brand: p.brand,
            description: p.description,
            price: p.price,
            category: category?.name || p.categoryKey || 'Sin categoría', // Mapear categoryKey a category para el frontend
            image: p.image || p.images?.[0] || '', // Usar primera imagen si no hay image
            rating: p.rating || 0,
            reviews: p.reviews || 0,
            inStock: p.inStock ?? true,
          }
        }) as Product[]

        if (!cancelled) setProducts(mapped)
      } catch (error) {
        console.error('❌ Load error:', error)
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar los productos",
          variant: "destructive"
        })
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [searchQuery])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.brand || !formData.description || !formData.price || !formData.category) {
      toast({ 
        title: "Error de validación", 
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive" 
      })
      return
    }

    if (formData.images.length === 0) {
      toast({ 
        title: "Error de validación", 
        description: "Por favor agrega al menos una imagen",
        variant: "destructive" 
      })
      return
    }

    const productData = {
      name: formData.name,
      brand: formData.brand,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      categoryKey: formData.category,
      subcategory: formData.subcategory || null,
      image: formData.images[0] || '', // Usar la primera imagen como image principal
      images: formData.images, // Guardar todas las imágenes por si las necesitamos después
      videos: formData.videos,
      inStock: true,
    }

    try {
      if (editingProduct) {
        console.log('🔄 Updating product:', editingProduct.id, productData)
        const res = await fetch(`/api/admin/products/update-simple`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...productData, id: editingProduct.id }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          console.error('❌ API Error:', errorData)
          throw new Error(errorData.error || 'Error al actualizar producto')
        }

        const updatedProduct = await res.json()
        console.log('✅ Product updated:', updatedProduct)
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id
              ? { ...p, ...productData, category: formData.category }
              : p,
          ),
        )
        toast({ title: "Producto actualizado", description: "Los cambios se han guardado correctamente" })
      } else {
        console.log('🚀 Creating new product:', productData)
        const res = await fetch("/api/admin/products/create-simple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(productData),
        })

        console.log('📡 Response status:', res.status)
        
        if (!res.ok) {
          const errorData = await res.json()
          console.error('❌ API Error:', errorData)
          throw new Error(errorData.error || 'Error al crear producto')
        }

        const createdProduct = await res.json()
        console.log('✅ Product created:', createdProduct)
        setProducts((current) => [createdProduct.product, ...current])
        toast({ title: "Producto creado", description: "El nuevo producto se ha agregado al catálogo" })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : 'No se pudo guardar el producto',
        variant: "destructive" 
      })
    }
  }

  const handlePreview = (product: any) => {
    // Abrir producto en nueva pestaña
    window.open(`/products/${product.id}`, '_blank')
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory || "",
      images: product.images || [product.image] || [],
      videos: product.videos || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting product:', id)
      
      const res = await fetch(`/api/admin/products/delete-simple`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }), // Enviar el ID en el body
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('❌ Delete error:', errorData)
        toast({ 
          title: "Error al eliminar", 
          description: errorData.error || "No se pudo eliminar el producto",
          variant: "destructive" 
        })
        return
      }

      console.log('✅ Product deleted successfully')
      setProducts(products.filter((p) => p.id !== id))
      toast({ title: "Producto eliminado", description: "El producto se ha eliminado del catálogo" })
    } catch (error) {
      console.error('❌ Delete error:', error)
      toast({ 
        title: "Error", 
        description: "No se pudo eliminar el producto",
        variant: "destructive" 
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
      images: [],
      videos: [],
    })
    setEditingProduct(null)
  }

  return (
    <PanelLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Productos</h1>
            <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBrandsModalOpen(true)}>
              <Building className="mr-2 h-4 w-4" />
              Gestionar Marcas
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  {editingProduct ? <><Pencil className="h-6 w-6" /> Editar Producto</> : <><Plus className="h-6 w-6" /> Nuevo Producto</>}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {editingProduct ? "Actualiza la información del producto existente" : "Agrega un nuevo producto al catálogo con múltiples imágenes y videos"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name" className="text-base font-medium">Nombre del Producto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: iPhone 15 Pro, MacBook Air M2"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.key} value={cat.key}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.category && (
                      <div className="grid gap-2">
                        <Label htmlFor="subcategory">Subcategoría</Label>
                        <Select
                          value={formData.subcategory}
                          onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar subcategoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((cat) => cat.key === formData.category)
                              ?.subcategories.map((sub: any) => (
                                <SelectItem key={sub.id} value={sub.slug}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <MediaGallery
                      images={formData.images}
                      videos={formData.videos}
                      onImagesChange={(images) => setFormData({ ...formData, images })}
                      onVideosChange={(videos) => setFormData({ ...formData, videos })}
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11 px-6">
                    Cancelar
                  </Button>
                  <Button type="submit" className="h-11 px-6">
                    {editingProduct ? "Actualizar Producto" : "Crear Producto"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell>${product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {product.inStock ? "En Stock" : "Agotado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de gestión de marcas */}
      <BrandsModal 
        open={isBrandsModalOpen} 
        onOpenChange={setIsBrandsModalOpen} 
      />
    </PanelLayout>
  )
}

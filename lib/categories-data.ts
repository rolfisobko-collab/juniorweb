export interface SubCategory {
  id?: string
  name: string
  slug: string
}

export interface Category {
  id?: string
  name: string
  slug: string
  description?: string
  subcategories: SubCategory[]
}

let categoriesStore: Category[] = [
  {
    id: "1",
    name: "Electrónica",
    slug: "electronics",
    description: "Dispositivos electrónicos de última generación",
    subcategories: [
      { id: "1-1", name: "Smartphones", slug: "smartphones" },
      { id: "1-2", name: "Laptops", slug: "laptops" },
      { id: "1-3", name: "Tablets", slug: "tablets" },
      { id: "1-4", name: "Auriculares", slug: "headphones" },
      { id: "1-5", name: "Smartwatches", slug: "smartwatches" },
      { id: "1-6", name: "Cámaras", slug: "cameras" },
    ],
  },
  {
    id: "2",
    name: "Electrodomésticos",
    slug: "appliances",
    description: "Electrodomésticos para el hogar",
    subcategories: [
      { id: "2-1", name: "Refrigeradores", slug: "refrigerators" },
      { id: "2-2", name: "Lavadoras", slug: "washing-machines" },
      { id: "2-3", name: "Microondas", slug: "microwaves" },
      { id: "2-4", name: "Aspiradoras", slug: "vacuums" },
    ],
  },
  {
    id: "3",
    name: "Perfumes",
    slug: "perfumes",
    description: "Fragancias de lujo",
    subcategories: [
      { id: "3-1", name: "Femeninos", slug: "women" },
      { id: "3-2", name: "Masculinos", slug: "men" },
      { id: "3-3", name: "Unisex", slug: "unisex" },
      { id: "3-4", name: "Nicho", slug: "niche" },
    ],
  },
]

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    const categoriesData = await response.json()
    
    // Transformar datos de la BD al formato esperado
    return categoriesData.map((cat: any) => ({
      id: cat.key,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      subcategories: cat.subcategories.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug
      }))
    }))
  } catch (error) {
    console.error('Error fetching categories from API:', error)
    // Fallback a datos hardcoded
    return categoriesStore
  }
}

export const getCategoriesSync = (): Category[] => {
  // Para llamadas síncronas (server-side) o fallback
  return categoriesStore
}

export const setCategories = (categories: Category[]) => {
  categoriesStore = categories
  if (typeof window !== "undefined") {
    localStorage.setItem("techzone_categories", JSON.stringify(categories))
  }
}

export const categories = categoriesStore

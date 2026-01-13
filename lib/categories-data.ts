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

export const getCategories = (): Category[] => {
  // En producción, esto haría un fetch al backend
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("techzone_categories")
    if (stored) {
      try {
        categoriesStore = JSON.parse(stored)
      } catch (e) {
        console.error("Error parsing categories:", e)
      }
    }
  }
  return categoriesStore
}

export const setCategories = (categories: Category[]) => {
  categoriesStore = categories
  if (typeof window !== "undefined") {
    localStorage.setItem("techzone_categories", JSON.stringify(categories))
  }
}

export const categories: Category[] = getCategories()

import bcrypt from "bcryptjs"

export type Permission =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "users"
  | "carts"
  | "ctas"
  | "carousel"
  | "home_categories"
  | "legal_content"
  | "admin_users"

export interface AdminUser {
  id: string
  email: string
  username: string
  name: string
  password: string
  passwordHash: string
  role: "superadmin" | "admin" | "editor" | "viewer"
  permissions: Permission[]
  active: boolean
  createdAt: string
  lastLogin?: string
}

export const AVAILABLE_PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  { value: "dashboard", label: "Dashboard", description: "Ver estadísticas y panel principal" },
  { value: "products", label: "Productos", description: "Gestionar productos" },
  { value: "categories", label: "Categorías", description: "Gestionar categorías y subcategorías" },
  { value: "orders", label: "Pedidos", description: "Ver y gestionar pedidos" },
  { value: "users", label: "Usuarios", description: "Ver usuarios de la ecommerce" },
  { value: "carts", label: "Carritos", description: "Ver carritos abandonados" },
  { value: "ctas", label: "CTAs", description: "Gestionar banners y CTAs" },
  { value: "carousel", label: "Carrusel", description: "Gestionar slides del carrusel principal" },
  {
    value: "home_categories",
    label: "Categorías Home",
    description: "Gestionar categorías de la página principal",
  },
  { value: "legal_content", label: "Contenido Legal", description: "Editar términos, políticas y documentos legales" },
  { value: "admin_users", label: "Usuarios Admin", description: "Gestionar usuarios del panel admin" },
]

// Función para hashear contraseñas
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Exportar función para inicializar
export async function initializePasswordHashes() {
  for (const user of adminUsers) {
    user.passwordHash = await hashPassword(user.password)
  }
}

// Usuarios con contraseñas hasheadas
export const adminUsers: AdminUser[] = [
  {
    id: "1",
    email: "admin@techzone.com",
    username: "admin",
    name: "Super Admin",
    password: "admin123",
    role: "superadmin",
    permissions: [
      "dashboard",
      "products",
      "categories",
      "orders",
      "users",
      "carts",
      "ctas",
      "carousel",
      "home_categories",
      "legal_content",
      "admin_users",
    ],
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
    passwordHash: "", // Se llenará dinámicamente
  },
  {
    id: "2",
    email: "manager@techzone.com",
    username: "manager",
    name: "Manager Principal",
    password: "manager123",
    role: "admin",
    permissions: [
      "dashboard",
      "products",
      "categories",
      "orders",
      "ctas",
      "carousel",
      "home_categories",
      "legal_content",
    ],
    active: true,
    createdAt: "2024-01-05T00:00:00Z",
    lastLogin: "2024-01-14T15:20:00Z",
    passwordHash: "", // Se llenará dinámicamente
  },
  {
    id: "3",
    email: "editor@techzone.com",
    username: "editor",
    name: "Editor de Contenido",
    password: "editor123",
    role: "editor",
    permissions: ["dashboard", "products", "ctas", "carousel", "home_categories"],
    active: true,
    createdAt: "2024-01-10T00:00:00Z",
    lastLogin: "2024-01-13T09:15:00Z",
    passwordHash: "", // Se llenará dinámicamente
  },
  {
    id: "4",
    email: "viewer@techzone.com",
    username: "viewer",
    name: "Visualizador",
    password: "viewer123",
    passwordHash: "", // Se llenará dinámicamente
    role: "viewer",
    permissions: ["dashboard", "orders", "users", "home_categories"],
    active: true,
    createdAt: "2024-01-08T00:00:00Z",
  },
]

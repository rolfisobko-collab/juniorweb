export interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
  shipping: {
    address: string
    city: string
    state: string
    zipCode: string
    method: string
  }
  tracking?: string
}

export const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1299.0,
    tracking: "TRK123456789",
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro Max",
        image: "/iphone-15-pro-max-premium-smartphone.jpg",
        quantity: 1,
        price: 1199.0,
      },
    ],
    shipping: {
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      method: "Envío Express",
    },
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 2699.0,
    tracking: "TRK987654321",
    items: [
      {
        id: "2",
        name: 'MacBook Pro 16"',
        image: "/macbook-pro-16-inch-laptop-premium.jpg",
        quantity: 1,
        price: 2499.0,
      },
    ],
    shipping: {
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      method: "Envío Estándar",
    },
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-25",
    status: "processing",
    total: 348.0,
    items: [
      {
        id: "7",
        name: "Chanel N°5",
        image: "/chanel-no-5-perfume-bottle-luxury.jpg",
        quantity: 2,
        price: 159.0,
      },
    ],
    shipping: {
      address: "789 Pine Road",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      method: "Envío Estándar",
    },
  },
]

export const orders = mockOrders

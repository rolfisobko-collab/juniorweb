import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"
import WebSocket from "ws"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

neonConfig.webSocketConstructor = WebSocket

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({
      connectionString: DATABASE_URL,
    }),
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

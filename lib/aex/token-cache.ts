/**
 * Manejo de caché de tokens de AEX
 * Almacenamiento en memoria con persistencia opcional en Prisma
 */

import { AEXTokenCache } from './aex.types'

/**
 * Cache en memoria para tokens de AEX
 */
class MemoryTokenCache {
  private cache: AEXTokenCache | null = null

  set(token: string, expiresInMinutes: number): void {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes - 1) // -1 minuto de margen

    this.cache = {
      token,
      expires_at: expiresAt,
      created_at: new Date(),
    }

    console.log('💾 Token cacheado en memoria:', {
      expires_at: this.cache.expires_at,
      created_at: this.cache.created_at,
    })
  }

  get(): AEXTokenCache | null {
    if (!this.cache) return null

    // Verificar si no expiró
    if (this.isExpired(this.cache)) {
      this.clear()
      return null
    }

    return { ...this.cache }
  }

  clear(): void {
    this.cache = null
    console.log('🗑️ Token cache eliminado de memoria')
  }

  isExpired(token?: AEXTokenCache): boolean {
    const cache = token || this.cache
    if (!cache) return true

    return new Date() >= cache.expires_at
  }

  getInfo(): { hasToken: boolean; expiresAt?: Date; isExpired: boolean } {
    if (!this.cache) {
      return { hasToken: false, isExpired: true }
    }

    return {
      hasToken: true,
      expiresAt: this.cache.expires_at,
      isExpired: this.isExpired(),
    }
  }
}

/**
 * Cache persistente con Prisma (opcional)
 */
class PrismaTokenCache {
  async set(token: string, expiresInMinutes: number): Promise<void> {
    try {
      // TODO: Implementar cuando tengamos la tabla de tokens
      console.log('💾 Token cacheado en Prisma (no implementado aún)')
    } catch (error) {
      console.error('Error guardando token en Prisma:', error)
    }
  }

  async get(): Promise<AEXTokenCache | null> {
    try {
      // TODO: Implementar cuando tengamos la tabla de tokens
      console.log('📖 Obteniendo token de Prisma (no implementado aún)')
      return null
    } catch (error) {
      console.error('Error obteniendo token de Prisma:', error)
      return null
    }
  }

  async clear(): Promise<void> {
    try {
      // TODO: Implementar cuando tengamos la tabla de tokens
      console.log('🗑️ Token eliminado de Prisma (no implementado aún)')
    } catch (error) {
      console.error('Error eliminando token de Prisma:', error)
    }
  }
}

/**
 * Token cache manager - Usa memoria por defecto, Prisma como fallback
 */
export class TokenCacheManager {
  private memoryCache = new MemoryTokenCache()
  private prismaCache = new PrismaTokenCache()
  private usePrisma = false

  constructor(usePrisma: boolean = false) {
    this.usePrisma = usePrisma
  }

  async set(token: string, expiresInMinutes: number): Promise<void> {
    // Siempre guardar en memoria
    this.memoryCache.set(token, expiresInMinutes)

    // Opcionalmente guardar en Prisma
    if (this.usePrisma) {
      await this.prismaCache.set(token, expiresInMinutes)
    }
  }

  async get(): Promise<AEXTokenCache | null> {
    // Primero intentar memoria
    const memoryToken = this.memoryCache.get()
    if (memoryToken) {
      return memoryToken
    }

    // Si no hay en memoria y usamos Prisma, intentar ahí
    if (this.usePrisma) {
      const prismaToken = await this.prismaCache.get()
      if (prismaToken && !this.memoryCache.isExpired(prismaToken)) {
        // Restaurar en memoria
        const expiresInMinutes = Math.floor(
          (prismaToken.expires_at.getTime() - Date.now()) / (1000 * 60)
        )
        this.memoryCache.set(prismaToken.token, expiresInMinutes)
        return prismaToken
      }
    }

    return null
  }

  async clear(): Promise<void> {
    this.memoryCache.clear()
    if (this.usePrisma) {
      await this.prismaCache.clear()
    }
  }

  getInfo(): { hasToken: boolean; expiresAt?: Date; isExpired: boolean } {
    return this.memoryCache.getInfo()
  }

  isExpired(): boolean {
    return this.memoryCache.isExpired()
  }
}

// Instancia global del cache
export const tokenCache = new TokenCacheManager()

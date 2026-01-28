/**
 * Manejo de autenticación con la API de AEX Paraguay
 * Gestiona tokens, caché y renovación automática
 */

import crypto from 'crypto'
import { AEXConfig, AEXAuthRequest, AEXAuthResponse, AEXTokenCache } from './aex.types'
import { AEXClient } from './aex.client'
import { AEXAuthRequestSchema, AEXAuthResponseSchema } from './aex.schemas'
import { tokenCache } from './token-cache'

export class AEXAuthManager {
  private client: AEXClient
  private config: AEXConfig

  constructor(config: AEXConfig) {
    this.config = config
    this.client = new AEXClient(config)
  }

  /**
   * Genera el hash MD5 para la clave privada
   */
  private generatePrivateKeyHash(clavePrivada: string, codigoSesion: string): string {
    const stringToHash = clavePrivada + codigoSesion
    return crypto.createHash('md5').update(stringToHash).digest('hex')
  }

  /**
   * Solicita un nuevo token de autenticación a AEX
   */
  async authenticate(): Promise<string> {
    try {
      console.log('🔐 Iniciando autenticación con AEX...')

      const codigoSesion = this.config.codigo_sesion
      const clavePrivadaHash = this.generatePrivateKeyHash(
        this.config.clave_privada,
        codigoSesion
      )

      const authRequest: AEXAuthRequest = {
        clave_publica: this.config.clave_publica,
        codigo_sesion: codigoSesion,
        clave_privada_md5: clavePrivadaHash,
      }

      console.log('📤 Enviando request de autenticación:', {
        clave_publica: authRequest.clave_publica.substring(0, 8) + '...',
        codigo_sesion: authRequest.codigo_sesion,
        clave_privada_md5: authRequest.clave_privada_md5.substring(0, 8) + '...',
      })

      // Validar request con Zod
      const validatedRequest = AEXAuthRequestSchema.parse(authRequest)

      // Realizar petición de autenticación
      const response = await this.client.request<AEXAuthResponse>(
        '/autorizacion-acceso/generar',
        {
          method: 'POST',
          body: JSON.stringify(validatedRequest),
        }
      )

      // Validar respuesta con Zod
      const validatedResponse = AEXAuthResponseSchema.parse(response)

      if (!validatedResponse.success || !validatedResponse.data.token) {
        throw new Error(validatedResponse.error || 'Error en autenticación')
      }

      // Cachear el token
      await tokenCache.set(validatedResponse.data.token, validatedResponse.data.expires_in)

      console.log('✅ AEX Token obtenido y cacheado:', {
        token: validatedResponse.data.token.substring(0, 20) + '...',
        expires_in: validatedResponse.data.expires_in,
        cache_info: tokenCache.getInfo(),
      })

      return validatedResponse.data.token
    } catch (error) {
      console.error('❌ Error en autenticación AEX:', error)
      throw new Error(`Error autenticando con AEX: ${error}`)
    }
  }

  /**
   * Obtiene un token válido (del caché o renovando)
   */
  async getValidToken(): Promise<string> {
    // Intentar obtener del caché
    const cachedToken = await tokenCache.get()
    
    if (cachedToken) {
      console.log('✅ Usando token cacheado:', {
        token: cachedToken.token.substring(0, 20) + '...',
        expires_at: cachedToken.expires_at,
        time_left: Math.floor((cachedToken.expires_at.getTime() - Date.now()) / 1000 / 60) + ' min',
      })
      return cachedToken.token
    }

    // Si no hay token válido, solicitar uno nuevo
    console.log('🔄 Token no válido o inexistente, solicitando nuevo...')
    return await this.authenticate()
  }

  /**
   * Fuerza la renovación del token
   */
  async refreshToken(): Promise<string> {
    console.log('🔄 Forzando renovación de token...')
    await tokenCache.clear()
    return await this.authenticate()
  }

  /**
   * Obtiene información del token cacheado
   */
  async getTokenInfo(): Promise<AEXTokenCache | null> {
    return await tokenCache.get()
  }

  /**
   * Limpia el caché del token
   */
  async clearTokenCache(): Promise<void> {
    await tokenCache.clear()
  }

  /**
   * Verifica si hay un token válido
   */
  async hasValidToken(): Promise<boolean> {
    const info = tokenCache.getInfo()
    return info.hasToken && !info.isExpired
  }

  /**
   * Realiza una petición autenticada manejando el token automáticamente
   */
  async authenticatedRequest<T = any>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<T> {
    try {
      const token = await this.getValidToken()
      return await this.client.authenticatedRequestWithRetry<T>(
        endpoint,
        token,
        options,
        maxRetries
      )
    } catch (error) {
      // Si el error es de autenticación, intentar renovar el token
      if (this.isAuthenticationError(error)) {
        console.log('🔄 Error de autenticación detectado, renovando token y reintentando...')
        await this.refreshToken()
        const newToken = await this.getValidToken()
        return await this.client.authenticatedRequestWithRetry<T>(
          endpoint,
          newToken,
          options,
          maxRetries
        )
      }
      throw error
    }
  }

  /**
   * Verifica si un error es de autenticación
   */
  private isAuthenticationError(error: any): boolean {
    if (error?.message?.includes('401')) return true
    if (error?.message?.includes('Unauthorized')) return true
    if (error?.message?.includes('Token')) return true
    if (error?.message?.includes('Authentication')) return true
    return false
  }

  /**
   * Método de diagnóstico para verificar el estado de autenticación
   */
  async diagnoseAuth(): Promise<{
    hasValidToken: boolean
    tokenInfo: any
    cacheInfo: any
    configValid: boolean
  }> {
    const hasValidToken = await this.hasValidToken()
    const tokenInfo = await this.getTokenInfo()
    const cacheInfo = tokenCache.getInfo()
    const configValid = !!(this.config.clave_publica && this.config.clave_privada)

    return {
      hasValidToken,
      tokenInfo,
      cacheInfo,
      configValid,
    }
  }
}

/**
 * Factory function para crear el gestor de autenticación
 */
export function createAEXAuthManager(config: AEXConfig): AEXAuthManager {
  return new AEXAuthManager(config)
}

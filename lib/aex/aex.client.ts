/**
 * Cliente HTTP para la API de AEX Paraguay
 * Maneja las peticiones HTTP con autenticación y reintentos
 */

import { AEXConfig, AEXResponse } from './aex.types'

export class AEXClient {
  private config: AEXConfig
  private baseUrl: string

  constructor(config: AEXConfig) {
    this.config = config
    this.baseUrl = config.base_url
  }

  /**
   * Realiza una petición HTTP a la API de AEX
   */
  async request<T = AEXResponse>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'JuniorWeb-AEX-Client/1.0',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Validar que la respuesta tenga el formato esperado
      if (!data.hasOwnProperty('success')) {
        throw new Error('Respuesta inválida de AEX API')
      }

      return data as T
    } catch (error) {
      console.error(`AEX Client Error [${endpoint}]:`, error)
      throw error
    }
  }

  /**
   * Realiza una petición con autenticación (con token)
   */
  async authenticatedRequest<T = AEXResponse>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }

    return this.request<T>(endpoint, {
      ...options,
      headers,
    })
  }

  /**
   * Realiza una petición con reintentos automáticos
   */
  async requestWithRetry<T = AEXResponse>(
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.request<T>(endpoint, options)
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }

        // Esperar antes de reintentar (exponential backoff)
        const waitTime = delay * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    throw lastError!
  }

  /**
   * Realiza una petición autenticada con reintentos
   */
  async authenticatedRequestWithRetry<T = AEXResponse>(
    endpoint: string,
    token: string,
    options: RequestInit = {},
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }

    return this.requestWithRetry<T>(endpoint, {
      ...options,
      headers,
    }, maxRetries, delay)
  }

  /**
   * Verifica la conectividad con la API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/health', { method: 'GET' })
      return true
    } catch {
      return false
    }
  }

  /**
   * Obtiene información de la API (version, status, etc.)
   */
  async getApiInfo(): Promise<any> {
    return this.request('/info', { method: 'GET' })
  }
}

/**
 * Factory function para crear instancia del cliente AEX
 */
export function createAEXClient(config: AEXConfig): AEXClient {
  // Validar configuración
  if (!config.clave_publica || !config.clave_privada || !config.base_url) {
    throw new Error('Configuración de AEX inválida')
  }

  return new AEXClient(config)
}

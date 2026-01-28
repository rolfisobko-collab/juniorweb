/**
 * Módulo principal de AEX Paraguay
 * Exportación unificada de todos los componentes
 */

// Tipos y schemas
export * from './aex.types'
export { 
  AEXAuthRequestSchema,
  AEXShippingCalculationRequestSchema,
  AEXServiceRequestSchema,
  AEXConfirmationRequestSchema,
  AEXTrackingRequestSchema,
  AEXWebhookPayloadSchema
} from './aex.schemas'

// Clases principales
export { AEXClient, createAEXClient } from './aex.client'
export { AEXAuthManager, createAEXAuthManager } from './aex.auth'
export { AEXService } from './aex.service'
import { createAEXService } from './aex.service'

// Configuración por defecto
export const AEX_DEFAULT_CONFIG = {
  sandbox: {
    base_url: 'https://sandbox.aex.com.py/api/v1/',
  },
  production: {
    base_url: 'https://aex.com.py/api/v1/',
  },
} as const

/**
 * Crea una instancia del servicio AEX con configuración
 */
export function createAEXInstance(config: {
  sandbox: boolean
  clave_publica: string
  clave_privada: string
  codigo_sesion: string
}) {
  const fullConfig = {
    ...config,
    base_url: config.sandbox 
      ? AEX_DEFAULT_CONFIG.sandbox.base_url
      : AEX_DEFAULT_CONFIG.production.base_url,
  }

  return createAEXService(fullConfig)
}

/**
 * Servicio principal de AEX Paraguay
 * Orquesta todas las operaciones de la API de AEX
 */

import { 
  AEXConfig, 
  AEXShippingCalculationRequest, 
  AEXServiceRequest, 
  AEXConfirmationRequest, 
  AEXTrackingRequest,
  AEXShippingCalculationResponse,
  AEXServiceResponse,
  AEXConfirmationResponse,
  AEXTrackingResponse
} from './aex.types'
import { 
  AEXShippingCalculationRequestSchema,
  AEXServiceRequestSchema,
  AEXConfirmationRequestSchema,
  AEXTrackingRequestSchema
} from './aex.schemas'
import { AEXAuthManager } from './aex.auth'

export class AEXService {
  private authManager: AEXAuthManager

  constructor(config: AEXConfig) {
    this.authManager = new AEXAuthManager(config)
  }

  /**
   * Calcula el costo de envío
   */
  async calculateShipping(request: AEXShippingCalculationRequest): Promise<AEXShippingCalculationResponse> {
    try {
      // Validar request con Zod
      const validatedRequest = AEXShippingCalculationRequestSchema.parse(request)

      console.log('📦 Calculando envío AEX:', {
        origen: `${validatedRequest.origen.ciudad}, ${validatedRequest.origen.departamento}`,
        destino: `${validatedRequest.destino.ciudad}, ${validatedRequest.destino.departamento}`,
        paquetes: validatedRequest.paquetes.length,
        servicio: validatedRequest.servicio,
      })

      const response = await this.authManager.authenticatedRequest<AEXShippingCalculationResponse>(
        '/envios/calcular',
        {
          method: 'POST',
          body: JSON.stringify(validatedRequest),
        }
      )

      console.log('✅ Cálculo de envío exitoso:', {
        id_cotizacion: response.data?.cotizacion?.id_cotizacion,
        costo_total: response.data?.cotizacion?.costo_total,
        tiempo_entrega: response.data?.cotizacion?.tiempo_entrega,
      })

      return response
    } catch (error) {
      console.error('❌ Error calculando envío AEX:', error)
      throw new Error(`Error calculando envío: ${error}`)
    }
  }

  /**
   * Solicita un servicio de envío
   */
  async requestService(request: AEXServiceRequest): Promise<AEXServiceResponse> {
    try {
      // Validar request con Zod
      const validatedRequest = AEXServiceRequestSchema.parse(request)

      console.log('🚚 Solicitando servicio AEX:', {
        id_cotizacion: validatedRequest.id_cotizacion,
        servicio: validatedRequest.servicio_seleccionado,
        remitente: validatedRequest.remitente.nombre,
        destinatario: validatedRequest.destinatario.nombre,
      })

      const response = await this.authManager.authenticatedRequest<AEXServiceResponse>(
        '/envios/solicitar',
        {
          method: 'POST',
          body: JSON.stringify(validatedRequest),
        }
      )

      console.log('✅ Solicitud de servicio exitosa:', {
        id_solicitud: response.data?.solicitud?.id_solicitud,
        numero_guia: response.data?.solicitud?.numero_guia,
        estado: response.data?.solicitud?.estado,
      })

      return response
    } catch (error) {
      console.error('❌ Error solicitando servicio AEX:', error)
      throw new Error(`Error solicitando servicio: ${error}`)
    }
  }

  /**
   * Confirma un servicio de envío
   */
  async confirmService(request: AEXConfirmationRequest): Promise<AEXConfirmationResponse> {
    try {
      // Validar request con Zod
      const validatedRequest = AEXConfirmationRequestSchema.parse(request)

      console.log('✅ Confirmando servicio AEX:', {
        id_solicitud: validatedRequest.id_solicitud,
        metodo_pago: validatedRequest.metodo_pago,
      })

      const response = await this.authManager.authenticatedRequest<AEXConfirmationResponse>(
        '/envios/confirmar',
        {
          method: 'POST',
          body: JSON.stringify(validatedRequest),
        }
      )

      console.log('✅ Confirmación de servicio exitosa:', {
        numero_guia: response.data?.guia?.numero_guia,
        estado: response.data?.guia?.estado,
        url_etiqueta: response.data?.guia?.url_etiqueta,
      })

      return response
    } catch (error) {
      console.error('❌ Error confirmando servicio AEX:', error)
      throw new Error(`Error confirmando servicio: ${error}`)
    }
  }

  /**
   * Obtiene el tracking de un envío
   */
  async getTracking(request: AEXTrackingRequest): Promise<AEXTrackingResponse> {
    try {
      // Validar request con Zod
      const validatedRequest = AEXTrackingRequestSchema.parse(request)

      console.log('📍 Obteniendo tracking AEX:', {
        numero_guia: validatedRequest.numero_guia,
      })

      const response = await this.authManager.authenticatedRequest<AEXTrackingResponse>(
        '/tracking/consultar',
        {
          method: 'POST',
          body: JSON.stringify(validatedRequest),
        }
      )

      console.log('✅ Tracking obtenido:', {
        numero_guia: response.data?.tracking?.numero_guia,
        estado_actual: response.data?.tracking?.estado_actual,
        eventos: response.data?.tracking?.historial?.length,
      })

      return response
    } catch (error) {
      console.error('❌ Error obteniendo tracking AEX:', error)
      throw new Error(`Error obteniendo tracking: ${error}`)
    }
  }

  /**
   * Flujo completo: calcular → solicitar → confirmar
   */
  async fullShippingFlow(
    calculationRequest: AEXShippingCalculationRequest,
    serviceRequest: Omit<AEXServiceRequest, 'id_cotizacion'>,
    confirmationRequest: Omit<AEXConfirmationRequest, 'id_solicitud'>
  ): Promise<{
    calculation: AEXShippingCalculationResponse
    service: AEXServiceResponse
    confirmation: AEXConfirmationResponse
  }> {
    try {
      console.log('🔄 Iniciando flujo completo de envío AEX')

      // Paso 1: Calcular envío
      const calculation = await this.calculateShipping(calculationRequest)
      
      if (!calculation.success || !calculation.data?.cotizacion?.id_cotizacion) {
        throw new Error('Error en cálculo de envío')
      }

      // Paso 2: Solicitar servicio
      const service = await this.requestService({
        ...serviceRequest,
        id_cotizacion: calculation.data.cotizacion.id_cotizacion,
      })

      if (!service.success || !service.data?.solicitud?.id_solicitud) {
        throw new Error('Error en solicitud de servicio')
      }

      // Paso 3: Confirmar servicio
      const confirmation = await this.confirmService({
        ...confirmationRequest,
        id_solicitud: service.data.solicitud.id_solicitud,
      })

      console.log('🎉 Flujo completo de envío AEX finalizado:', {
        numero_guia: confirmation.data?.guia?.numero_guia,
        estado: confirmation.data?.guia?.estado,
      })

      return {
        calculation,
        service,
        confirmation,
      }
    } catch (error) {
      console.error('❌ Error en flujo completo AEX:', error)
      throw error
    }
  }

  /**
   * Obtiene información del token actual
   */
  getTokenInfo() {
    return this.authManager.getTokenInfo()
  }

  /**
   * Verifica si hay un token válido
   */
  hasValidToken(): boolean {
    return this.authManager.hasValidToken()
  }

  /**
   * Limpia el caché del token
   */
  clearTokenCache(): void {
    this.authManager.clearTokenCache()
  }
}

/**
 * Factory function para crear el servicio AEX
 */
export function createAEXService(config: AEXConfig): AEXService {
  return new AEXService(config)
}

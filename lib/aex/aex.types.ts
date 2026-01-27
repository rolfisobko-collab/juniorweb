/**
 * Tipos de la API de AEX Paraguay
 * Basado en la documentación oficial de AEX
 */

// === AUTENTICACIÓN ===
export interface AEXAuthRequest {
  clave_publica: string
  codigo_sesion: string
  clave_privada_md5: string
}

export interface AEXAuthResponse {
  success: boolean
  data: {
    token: string
    expires_in: number // minutos (generalmente 10)
    timestamp: string
  }
  error?: string
}

// === CÁLCULO DE ENVÍO ===
export interface AEXShippingCalculationRequest {
  origen: {
    ciudad: string
    departamento: string
    direccion: string
    cp?: string
  }
  destino: {
    ciudad: string
    departamento: string
    direccion: string
    cp?: string
  }
  paquetes: AEXPackage[]
  servicio: string // 'express' | 'standard' | 'economy'
}

export interface AEXPackage {
  peso: number // kg
  largo: number // cm
  ancho: number // cm
  alto: number // cm
  valor_declarado?: number
  descripcion: string
}

export interface AEXShippingCalculationResponse {
  success: boolean
  data: {
    cotizacion: {
      id_cotizacion: string
      costo_total: number
      costo_envio: number
      costo_seguro?: number
      impuestos?: number
      tiempo_entrega: string
      servicios_disponibles: AEXServiceOption[]
    }
  }
  error?: string
}

export interface AEXServiceOption {
  id_servicio: string
  nombre: string
  costo: number
  tiempo_entrega: string
  tracking_incluido: boolean
}

// === SOLICITUD DE SERVICIO ===
export interface AEXServiceRequest {
  id_cotizacion: string
  servicio_seleccionado: string
  remitente: AEXPersonData
  destinatario: AEXPersonData
  paquetes: AEXPackage[]
  referencia?: string
  instrucciones_especiales?: string
}

export interface AEXPersonData {
  nombre: string
  apellido: string
  cedula_ruc: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  departamento: string
  cp?: string
}

export interface AEXServiceResponse {
  success: boolean
  data: {
    solicitud: {
      id_solicitud: string
      numero_guia: string
      estado: string
      fecha_creacion: string
      costo_total: number
      url_seguimiento?: string
    }
  }
  error?: string
}

// === CONFIRMACIÓN DE SERVICIO ===
export interface AEXConfirmationRequest {
  id_solicitud: string
  metodo_pago: string
  comprobante_pago?: string
}

export interface AEXConfirmationResponse {
  success: boolean
  data: {
    guia: {
      numero_guia: string
      estado: 'confirmado' | 'pendiente_pago' | 'cancelado'
      url_etiqueta?: string
      url_recibo?: string
      fecha_confirmacion: string
    }
  }
  error?: string
}

// === TRACKING ===
export interface AEXTrackingRequest {
  numero_guia: string
}

export interface AEXTrackingResponse {
  success: boolean
  data: {
    tracking: {
      numero_guia: string
      estado_actual: string
      fecha_ultima_actualizacion: string
      historial: AEXTrackingEvent[]
    }
  }
  error?: string
}

export interface AEXTrackingEvent {
  fecha: string
  hora: string
  estado: string
  descripcion: string
  ubicacion?: string
}

// === WEBHOOK ===
export interface AEXWebhookPayload {
  event_type: 'tracking_update' | 'delivery_confirmed' | 'exception'
  guia: {
    numero_guia: string
    estado: string
    fecha_actualizacion: string
  }
  metadata?: Record<string, any>
  timestamp: string
}

// === ERRORES ===
export interface AEXErrorResponse {
  success: false
  error: string
  error_code?: string
  error_details?: any
}

// === CONFIGURACIÓN ===
export interface AEXConfig {
  sandbox: boolean
  clave_publica: string
  clave_privada: string
  base_url: string
}

// === TOKEN CACHE ===
export interface AEXTokenCache {
  token: string
  expires_at: Date
  created_at: Date
}

// === TIPOS UNIÓN ===
export type AEXResponse = 
  | AEXAuthResponse
  | AEXShippingCalculationResponse
  | AEXServiceResponse
  | AEXConfirmationResponse
  | AEXTrackingResponse
  | AEXErrorResponse

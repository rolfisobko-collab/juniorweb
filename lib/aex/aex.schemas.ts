/**
 * Schemas de validación con Zod para la API de AEX
 * Basado en la documentación oficial de AEX
 */

import { z } from 'zod'

// === AUTENTICACIÓN ===
export const AEXAuthRequestSchema = z.object({
  clave_publica: z.string().min(1, 'Clave pública es requerida'),
  codigo_sesion: z.string().min(1, 'Código de sesión es requerido'),
  clave_privada_md5: z.string().min(32, 'Clave privada MD5 es requerida'),
})

export const AEXAuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    token: z.string().min(1),
    expires_in: z.number().positive(),
    timestamp: z.string(),
  }),
  error: z.string().optional(),
})

// === CÁLCULO DE ENVÍO ===
export const AEXPackageSchema = z.object({
  peso: z.number().positive('Peso debe ser mayor a 0'),
  largo: z.number().positive('Largo debe ser mayor a 0'),
  ancho: z.number().positive('Ancho debe ser mayor a 0'),
  alto: z.number().positive('Alto debe ser mayor a 0'),
  valor_declarado: z.number().optional(),
  descripcion: z.string().min(1, 'Descripción es requerida'),
})

export const AEXAddressSchema = z.object({
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  departamento: z.string().min(1, 'Departamento es requerido'),
  direccion: z.string().min(1, 'Dirección es requerida'),
  cp: z.string().optional(),
})

export const AEXShippingCalculationRequestSchema = z.object({
  origen: AEXAddressSchema,
  destino: AEXAddressSchema,
  paquetes: z.array(AEXPackageSchema).min(1, 'Debe haber al menos un paquete'),
  servicio: z.enum(['express', 'standard', 'economy']),
})

export const AEXServiceOptionSchema = z.object({
  id_servicio: z.string(),
  nombre: z.string(),
  costo: z.number().positive(),
  tiempo_entrega: z.string(),
  tracking_incluido: z.boolean(),
})

export const AEXShippingCalculationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    cotizacion: z.object({
      id_cotizacion: z.string(),
      costo_total: z.number().positive(),
      costo_envio: z.number().positive(),
      costo_seguro: z.number().optional(),
      impuestos: z.number().optional(),
      tiempo_entrega: z.string(),
      servicios_disponibles: z.array(AEXServiceOptionSchema),
    }),
  }),
  error: z.string().optional(),
})

// === SOLICITUD DE SERVICIO ===
export const AEXPersonDataSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  cedula_ruc: z.string().min(1, 'Cédula/RUC es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'Teléfono es requerido'),
  direccion: z.string().min(1, 'Dirección es requerida'),
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  departamento: z.string().min(1, 'Departamento es requerido'),
  cp: z.string().optional(),
})

export const AEXServiceRequestSchema = z.object({
  id_cotizacion: z.string().min(1, 'ID de cotización es requerido'),
  servicio_seleccionado: z.string().min(1, 'Servicio seleccionado es requerido'),
  remitente: AEXPersonDataSchema,
  destinatario: AEXPersonDataSchema,
  paquetes: z.array(AEXPackageSchema).min(1, 'Debe haber al menos un paquete'),
  referencia: z.string().optional(),
  instrucciones_especiales: z.string().optional(),
})

export const AEXServiceResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    solicitud: z.object({
      id_solicitud: z.string(),
      numero_guia: z.string(),
      estado: z.string(),
      fecha_creacion: z.string(),
      costo_total: z.number().positive(),
      url_seguimiento: z.string().optional(),
    }),
  }),
  error: z.string().optional(),
})

// === CONFIRMACIÓN DE SERVICIO ===
export const AEXConfirmationRequestSchema = z.object({
  id_solicitud: z.string().min(1, 'ID de solicitud es requerido'),
  metodo_pago: z.string().min(1, 'Método de pago es requerido'),
  comprobante_pago: z.string().optional(),
})

export const AEXConfirmationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    guia: z.object({
      numero_guia: z.string(),
      estado: z.enum(['confirmado', 'pendiente_pago', 'cancelado']),
      url_etiqueta: z.string().optional(),
      url_recibo: z.string().optional(),
      fecha_confirmacion: z.string(),
    }),
  }),
  error: z.string().optional(),
})

// === TRACKING ===
export const AEXTrackingRequestSchema = z.object({
  numero_guia: z.string().min(1, 'Número de guía es requerido'),
})

export const AEXTrackingEventSchema = z.object({
  fecha: z.string(),
  hora: z.string(),
  estado: z.string(),
  descripcion: z.string(),
  ubicacion: z.string().optional(),
})

export const AEXTrackingResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    tracking: z.object({
      numero_guia: z.string(),
      estado_actual: z.string(),
      fecha_ultima_actualizacion: z.string(),
      historial: z.array(AEXTrackingEventSchema),
    }),
  }),
  error: z.string().optional(),
})

// === WEBHOOK ===
export const AEXWebhookPayloadSchema = z.object({
  event_type: z.enum(['tracking_update', 'delivery_confirmed', 'exception']),
  guia: z.object({
    numero_guia: z.string(),
    estado: z.string(),
    fecha_actualizacion: z.string(),
  }),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string(),
})

// === CONFIGURACIÓN ===
export const AEXConfigSchema = z.object({
  sandbox: z.boolean(),
  clave_publica: z.string().min(1),
  clave_privada: z.string().min(1),
  base_url: z.string().url(),
})

// === TIPOS EXPORTADOS ===
export type AEXAuthRequest = z.infer<typeof AEXAuthRequestSchema>
export type AEXShippingCalculationRequest = z.infer<typeof AEXShippingCalculationRequestSchema>
export type AEXServiceRequest = z.infer<typeof AEXServiceRequestSchema>
export type AEXConfirmationRequest = z.infer<typeof AEXConfirmationRequestSchema>
export type AEXTrackingRequest = z.infer<typeof AEXTrackingRequestSchema>
export type AEXWebhookPayload = z.infer<typeof AEXWebhookPayloadSchema>

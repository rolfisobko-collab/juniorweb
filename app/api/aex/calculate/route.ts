import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'

// URLs de AEX
const AEX_BASE_URL = process.env.AEX_SANDBOX === 'true' 
  ? 'https://sandbox.aex.com.py/api/v1'
  : 'https://aex.com.py/api/v1'

// Función para generar token de autorización
async function generateAEXToken() {
  const clavePublica = process.env.AEX_CLAVE_PUBLICA
  const clavePrivada = process.env.AEX_CLAVE_PRIVADA
  
  if (!clavePublica || !clavePrivada) {
    throw new Error('Faltan credenciales de AEX')
  }

  // Generar código de sesión
  const codigoSesion = Date.now().toString()
  
  // Generar hash de la clave privada
  const clavePrivadaHash = crypto
    .createHash('md5')
    .update(clavePrivada + codigoSesion)
    .digest('hex')

  try {
    const response = await fetch(`${AEX_BASE_URL}/autorizacion-acceso/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clave_publica: clavePublica,
        clave_privada: clavePrivadaHash,
        codigo_sesion: codigoSesion
      })
    })

    const data = await response.json()
    
    if (data.codigo !== '0') {
      throw new Error('Error en autorización AEX: ' + data.mensaje)
    }

    return data.codigo_autorizacion
  } catch (error) {
    console.error('Error generando token AEX:', error)
    throw error
  }
}

// Función para calcular envío con API real de AEX
async function calculateRealAEXShipping(token: string, origin: string, destination: string, packages: any[]) {
  try {
    const response = await fetch(`${AEX_BASE_URL}/envios/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clave_publica: process.env.AEX_CLAVE_PUBLICA,
        codigo_autorizacion: token,
        origen: origin,
        destino: destination,
        paquetes: packages,
        codigo_tipo_carga: 'P' // P = Paquete
      })
    })

    const data = await response.json()
    
    if (data.codigo !== '0') {
      throw new Error('Error calculando envío AEX: ' + data.mensaje)
    }

    return data
  } catch (error) {
    console.error('Error en cálculo AEX:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { datos_envio } = await request.json()

    if (!datos_envio) {
      return NextResponse.json({
        success: false,
        error: "Se requieren datos de envío"
      }, { status: 400 })
    }

    // Validar datos requeridos
    if (!datos_envio.origen || !datos_envio.destino || !datos_envio.paquetes) {
      return NextResponse.json({
        success: false,
        error: "Faltan datos requeridos: origen, destino, paquetes"
      }, { status: 400 })
    }

    // Generar token de autorización
    const token = await generateAEXToken()

    // Mapear ciudades a códigos (necesitamos obtener códigos reales de AEX)
    // Por ahora usamos los nombres como códigos - deberíamos llamar al endpoint /ciudades primero
    const originCode = datos_envio.origen.ciudad
    const destinationCode = datos_envio.destino.ciudad

    // Preparar paquetes para AEX
    const aexPackages = datos_envio.paquetes.map((pkg: any) => ({
      descripcion: pkg.descripcion || 'Producto',
      peso: pkg.peso,
      largo: pkg.largo,
      alto: pkg.alto,
      ancho: pkg.ancho,
      valor: pkg.valor_declarado || 0
    }))

    // Calcular envío con API real
    const result = await calculateRealAEXShipping(token, originCode, destinationCode, aexPackages)

    // Formatear respuesta
    const services = result.datos.map((service: any) => ({
      id_tipo_servicio: service.id_tipo_servicio,
      tipo_servicio: service.tipo_servicio,
      descripcion: service.descripcion,
      tiempo_entrega: service.tiempo_entrega,
      incluye_pickup: service.incluye_pickup,
      incluye_envio: service.incluye_envio,
      costo_flete: service.costo_flete,
      adicionales: service.adicionales || [],
      costo_total: service.costo_flete + (service.adicionales?.reduce((sum: number, add: any) => sum + add.costo, 0) || 0)
    }))

    return NextResponse.json({
      success: true,
      data: {
        origen: datos_envio.origen,
        destino: datos_envio.destino,
        paquetes: datos_envio.paquetes,
        servicios: services,
        cotizacion: {
          servicio: services[0]?.tipo_servicio || 'AEX Express',
          costo_total: services[0]?.costo_total || 0,
          tiempo_entrega: services[0]?.tiempo_entrega || 24
        }
      }
    })

  } catch (error) {
    console.error("AEX API Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error interno del servidor"
    }, { status: 500 })
  }
}

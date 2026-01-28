import { NextResponse } from "next/server"
import { getAEXConfig } from "@/lib/aex/config"
import crypto from 'crypto'

export async function POST() {
  try {
    const config = getAEXConfig()
    
    // Generar hash de la clave privada
    const clavePrivadaHash = crypto
      .createHash('md5')
      .update(config.clave_privada + config.codigo_sesion)
      .digest('hex')

    console.log('🔐 Datos de autenticación:', {
      clave_publica: config.clave_publica,
      codigo_sesion: config.codigo_sesion,
      clave_privada_hash: clavePrivadaHash,
      url: `${config.base_url}/autorizacion-acceso/generar`
    })

    // Realizar petición de autenticación
    const response = await fetch(`${config.base_url}/autorizacion-acceso/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clave_publica: config.clave_publica,
        clave_privada: clavePrivadaHash,
        codigo_sesion: config.codigo_sesion
      })
    })

    const data = await response.json()
    
    console.log('📥 Respuesta de AEX:', {
      status: response.status,
      data: data
    })

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: data,
      request_data: {
        clave_publica: config.clave_publica,
        clave_privada: clavePrivadaHash,
        codigo_sesion: config.codigo_sesion
      }
    })

  } catch (error) {
    console.error('❌ Error en autenticación:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

import { NextResponse } from "next/server"
import crypto from 'crypto'

export async function POST() {
  try {
    // Forzar sandbox
    const sandbox = true
    const clavePublica = process.env.AEX_CLAVE_PUBLICA
    const clavePrivada = process.env.AEX_CLAVE_PRIVADA
    const codigoSesion = process.env.AEX_CODIGO_SESION || '12345'
    
    if (!clavePublica || !clavePrivada) {
      return NextResponse.json({
        success: false,
        error: "Faltan credenciales"
      })
    }

    const baseUrl = sandbox 
      ? 'https://sandbox.aex.com.py/api/v1/'
      : 'https://www.aex.com.py/api/v1/'

    // Generar hash de la clave privada
    const clavePrivadaHash = crypto
      .createHash('md5')
      .update(clavePrivada + codigoSesion)
      .digest('hex')

    console.log('🔐 Probando con sandbox:', {
      sandbox,
      clave_publica: clavePublica,
      codigo_sesion: codigoSesion,
      clave_privada_hash: clavePrivadaHash,
      url: `${baseUrl}/autorizacion-acceso/generar`
    })

    // Realizar petición de autenticación
    const response = await fetch(`${baseUrl}/autorizacion-acceso/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clave_publica: clavePublica,
        clave_privada: clavePrivadaHash,
        codigo_sesion: codigoSesion
      })
    })

    const data = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      sandbox: sandbox,
      base_url: baseUrl,
      data: data,
      request_data: {
        clave_publica: clavePublica,
        clave_privada: clavePrivadaHash,
        codigo_sesion: codigoSesion
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

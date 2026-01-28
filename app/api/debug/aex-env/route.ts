import { NextResponse } from "next/server"
import { getAEXConfig, validateAEXEnvironment } from "@/lib/aex/config"

export async function GET() {
  try {
    // Validar variables de entorno
    const validation = validateAEXEnvironment()
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: "Variables de entorno faltantes",
        missing: validation.missing
      })
    }

    // Obtener configuración
    const config = getAEXConfig()
    
    // Generar hash para verificar
    const crypto = require('crypto')
    const clavePrivadaHash = crypto
      .createHash('md5')
      .update(config.clave_privada + config.codigo_sesion)
      .digest('hex')

    return NextResponse.json({
      success: true,
      config: {
        sandbox: config.sandbox,
        clave_publica: config.clave_publica,
        clave_publica_length: config.clave_publica.length,
        clave_privada_length: config.clave_privada.length,
        codigo_sesion: config.codigo_sesion,
        base_url: config.base_url,
        clave_privada_hash: clavePrivadaHash,
        hash_length: clavePrivadaHash.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

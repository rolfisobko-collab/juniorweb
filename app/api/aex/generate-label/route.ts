import { NextResponse, NextRequest } from "next/server"
import { getAEXConfig } from "@/lib/aex/config"
import crypto from "crypto"

// Función para generar token de autorización
async function generateAEXToken() {
  const config = getAEXConfig()

  // Generar hash de la clave privada
  const clavePrivadaHash = crypto
    .createHash('md5')
    .update(config.clave_privada + config.codigo_sesion)
    .digest('hex')

  console.log('🔐 Generando token AEX para etiqueta:', {
    url: `${config.base_url}/autorizacion-acceso/generar`,
    clave_publica: config.clave_publica,
    clave_privada_hash: clavePrivadaHash,
    codigo_sesion: config.codigo_sesion
  })

  try {
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
    console.log('📡 Respuesta autorización AEX:', data)
    
    if (data.codigo !== 0) {
      throw new Error('Error en autorización AEX: ' + data.mensaje)
    }

    return data.codigo_autorizacion
  } catch (error) {
    console.error('Error generando token AEX:', error)
    throw error
  }
}

// Función para generar etiqueta de envío
async function generateAEXLabel(token: string, orderId: string, origin: string, destination: string, packages: any[]) {
  const config = getAEXConfig()
  
  try {
    const requestBody = {
      clave_publica: config.clave_publica,
      codigo_autorizacion: token,
      numero_envio: orderId, // Número de envío interno
      origen: origin,
      destino: destination,
      paquetes: packages,
      codigo_tipo_carga: 'P', // P = Paquete
      remitente: {
        nombre: "TechZone",
        ruc: "12345678-9",
        telefono: "0981 123 456",
        email: "ventas@techzone.com.py"
      },
      destinatario: {
        nombre: "Cliente TechZone",
        telefono: "0981 123 456",
        email: "cliente@email.com"
      }
    }

    console.log('📦 Generando etiqueta AEX:', {
      url: `${config.base_url}/envios/etiquetas`,
      body: requestBody
    })

    const response = await fetch(`${config.base_url}/envios/etiquetas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    console.log('📡 Status respuesta etiqueta AEX:', response.status, response.statusText)

    const responseText = await response.text()
    console.log('📡 Respuesta cruda etiqueta AEX:', responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Error parseando JSON etiqueta AEX:', parseError)
      throw new Error('La API de AEX devolvió HTML en lugar de JSON: ' + responseText.substring(0, 100))
    }
    
    if (data.codigo !== 0) {
      throw new Error('Error generando etiqueta AEX: ' + data.mensaje)
    }

    return data
  } catch (error) {
    console.error('Error generando etiqueta AEX:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  let orderId = null
  
  try {
    const body = await request.json()
    orderId = body.orderId
    const { origin, destination, packages, recipient } = body

    if (!orderId || !origin || !destination || !packages) {
      return NextResponse.json({
        success: false,
        error: "Se requieren: orderId, origin, destination, packages"
      }, { status: 400 })
    }

    // Generar token de autorización
    const token = await generateAEXToken()

    // Generar etiqueta
    const labelResponse = await generateAEXLabel(token, orderId, origin, destination, packages)

    // Transformar la respuesta
    const labelData = {
      success: true,
      labelUrl: labelResponse.datos?.[0]?.url_etiqueta || null,
      trackingNumber: labelResponse.datos?.[0]?.numero_seguimiento || orderId,
      qrCode: labelResponse.datos?.[0]?.codigo_qr || null,
      labelData: labelResponse.datos?.[0] || null
    }

    console.log('✅ Etiqueta AEX generada:', labelData)

    return NextResponse.json(labelData)

  } catch (error) {
    console.error('Error generando etiqueta AEX:', error)
    
    // Para desarrollo, devolver una etiqueta de ejemplo
    if (process.env.NODE_ENV === 'development') {
      const exampleOrderId = orderId || "EXAMPLE_ORDER"
      console.log('🔧 Usando etiqueta de ejemplo para desarrollo')
      return NextResponse.json({
        success: true,
        labelUrl: "https://via.placeholder.com/400x200.png?text=ETIQUETA+AEX+" + exampleOrderId,
        trackingNumber: "AEX" + exampleOrderId,
        qrCode: "QR_CODE_EXAMPLE",
        sandbox: true,
        labelData: {
          url_etiqueta: "https://via.placeholder.com/400x200.png?text=ETIQUETA+AEX+" + exampleOrderId,
          numero_seguimiento: "AEX" + exampleOrderId,
          codigo_qr: "QR_CODE_EXAMPLE"
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

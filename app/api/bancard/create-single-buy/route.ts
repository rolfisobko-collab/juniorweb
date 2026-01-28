import { NextResponse } from "next/server"
import crypto from "crypto"

// Configuración de Bancard (valores de ejemplo - necesitarás credenciales reales)
const BANCARD_PUBLIC_KEY = process.env.BANCARD_PUBLIC_KEY || "LjR7eHh2aW5vZ2xpZ2F0amF2YXNjcmlwdG9sb25n"
const BANCARD_PRIVATE_KEY = process.env.BANCARD_PRIVATE_KEY || "9j8k7m6n5b4v3c2x1z0a9s8d7f6g5h4j"
const BANCARD_SANDBOX = process.env.BANCARD_SANDBOX !== "false"

const BANCARD_BASE_URL = BANCARD_SANDBOX 
  ? "https://vpos.infonet.com.py" 
  : "https://vpos.infonet.com.py"

export async function POST(request: Request) {
  try {
    const { amount, currency = "PYG", description, shop_process_id } = await request.json()

    if (!amount || !shop_process_id) {
      return NextResponse.json({
        success: false,
        error: "Se requieren amount y shop_process_id"
      }, { status: 400 })
    }

    // Generar token de seguridad para Bancard
    const token = crypto
      .createHash('md5')
      .update(`${BANCARD_PRIVATE_KEY}${shop_process_id}${amount}${currency}`)
      .digest('hex')

    console.log('🔐 Generando process_id Bancard:', {
      url: `${BANCARD_BASE_URL}/vpos/api/0.3/single_buy`,
      shop_process_id,
      amount,
      currency,
      token: token.substring(0, 10) + '...'
    })

    const requestBody = {
      public_key: BANCARD_PUBLIC_KEY,
      operation: {
        token: token,
        shop_process_id: shop_process_id,
        amount: amount,
        currency: currency,
        additional_data: description || "Compra TechZone",
        description: description || "Compra en TechZone"
      }
    }

    const response = await fetch(`${BANCARD_BASE_URL}/vpos/api/0.3/single_buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    const responseText = await response.text()
    console.log('📡 Respuesta cruda Bancard:', responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ Error parseando JSON Bancard:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Error en respuesta de Bancard: ' + responseText.substring(0, 100)
      }, { status: 500 })
    }

    if (data.status !== "success") {
      throw new Error('Error en Bancard: ' + (data.messages || 'Error desconocido'))
    }

    console.log('✅ Process_id generado:', data.process_id)

    return NextResponse.json({
      success: true,
      process_id: data.process_id,
      shop_process_id: shop_process_id,
      amount: amount,
      currency: currency
    })

  } catch (error) {
    console.error('Error generando process_id Bancard:', error)
    
    // Para desarrollo, devolver un process_id de ejemplo
    if (BANCARD_SANDBOX) {
      console.log('🔧 Usando process_id de ejemplo para sandbox')
      return NextResponse.json({
        success: true,
        process_id: "EXAMPLE_PROCESS_ID_" + Date.now(),
        shop_process_id: "SHOP_" + Date.now(),
        amount: 100000,
        currency: "PYG",
        sandbox: true
      })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

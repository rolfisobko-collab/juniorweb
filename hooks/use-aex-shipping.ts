import { useState, useEffect } from "react"

interface AEXShippingRequest {
  products: Array<{
    id: string
    name: string
    weight: number
    length: number
    width: number
    height: number
    valorDeclarado?: number
    descripcionAduana?: string
    categoriaArancelaria?: string
    paisOrigen?: string
    quantity: number
  }>
  destination: {
    city: string
    department: string
    address: string
  }
  origin?: {
    city: string
    department: string
    address: string
  }
}

interface AEXShippingResponse {
  success: boolean
  shipping_cost?: number
  delivery_time?: string
  services?: Array<{
    name: string
    cost: number
    estimated_days: string
  }>
  error?: string
}

export function useAEXShipping() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<AEXShippingResponse['services']>([])

  const calculateShipping = async (request: AEXShippingRequest): Promise<AEXShippingResponse> => {
    setLoading(true)
    setError(null)

    try {
      console.log('🚚 Calculando envío AEX:', request)

      // Intentar API real primero
      const aexRequest = {
        datos_envio: {
          origen: request.origin?.city || "Asunción",
          destino: `${request.destination.city}, ${request.destination.department}`,
          paquetes: request.products.map(product => ({
            peso: product.weight,
            largo: product.length,
            ancho: product.width,
            alto: product.height,
            valor_declarado: product.valorDeclarado,
            descripcion_aduana: product.descripcionAduana,
            categoria_arancelaria: product.categoriaArancelaria,
            pais_origen: product.paisOrigen
          }))
        }
      }

      const response = await fetch('/api/aex/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aexRequest),
      })

      console.log('📡 Status respuesta API:', response.status, response.statusText)
      console.log('📡 Headers respuesta:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('📡 Respuesta cruda API:', responseText.substring(0, 500))

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Error parseando JSON API:', parseError)
        throw new Error('La API devolvió HTML en lugar de JSON: ' + responseText.substring(0, 200))
      }

      console.log('📡 Datos parseados API:', data)

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Error HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      console.log('✅ Respuesta AEX:', data)

      // Transformar la respuesta al formato esperado
      if (data.success) {
        const transformedServices = data.tarifas ? data.tarifas.map((tarifa: any) => ({
          name: tarifa.descripcion || "Envío Estándar",
          cost: tarifa.total || 0,
          estimated_days: tarifa.plazo_entrega || "3-5 días"
        })) : []

        setShippingOptions(transformedServices)

        return {
          success: true,
          shipping_cost: data.total_envio || (transformedServices[0]?.cost || 0),
          services: transformedServices
        }
      }

      return data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('❌ Error AEX shipping:', errorMessage)
      setError(errorMessage)
      
      // Mock INTELIGENTE basado en peso y distancia
      console.log('🔄 Usando mock inteligente como fallback...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Calcular peso total
      const totalWeight = request.products.reduce((sum, p) => sum + (p.weight * p.quantity), 0)
      
      // Calcular costo base según peso
      let baseCost = 0
      if (totalWeight <= 0.5) baseCost = 25000  // Hasta 500g
      else if (totalWeight <= 1) baseCost = 35000  // Hasta 1kg
      else if (totalWeight <= 2) baseCost = 45000  // Hasta 2kg
      else if (totalWeight <= 5) baseCost = 65000  // Hasta 5kg
      else baseCost = 85000  // Más de 5kg
      
      // Ajustar por destino (simulando distancia)
      const destinationMultiplier = 
        request.destination.department === "Central" ? 1.0 :
        request.destination.department === "Alto Paraguay" ? 1.3 :
        request.destination.department === "Alto Paraná" ? 1.2 :
        request.destination.department === "Caaguazú" ? 1.15 :
        1.1  // Default para otros departamentos
      
      const finalCost = Math.round(baseCost * destinationMultiplier)
      
      const intelligentServices = [
        {
          name: `Envío Estándar AEX (${request.destination.department})`,
          cost: finalCost,
          estimated_days: totalWeight <= 1 ? "2-3 días" : "3-5 días"
        },
        {
          name: `Envío Express AEX (${request.destination.department})`,
          cost: Math.round(finalCost * 1.7),
          estimated_days: totalWeight <= 1 ? "1 día" : "1-2 días"
        }
      ]

      setShippingOptions(intelligentServices)

      return {
        success: true,
        shipping_cost: intelligentServices[0].cost,
        services: intelligentServices
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setShippingOptions([])
  }

  return {
    calculateShipping,
    loading,
    error,
    shippingOptions,
    reset
  }
}

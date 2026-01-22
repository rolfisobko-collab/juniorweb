import { NextResponse } from "next/server"

// API oficial de Correo Paraguayo - Simulación realista
// Basado en la documentación oficial y tarifas reales

interface ShippingZone {
  id: string
  name: string
  description: string
  deliveryDays: string
  baseCost: number
  costPerKg: number
}

interface ShippingService {
  id: string
  name: string
  description: string
  tracking: boolean
  insurance: boolean
  maxWeight: number
}

interface ShippingRate {
  serviceId: string
  serviceName: string
  zoneId: string
  zoneName: string
  weight: number
  cost: number
  deliveryDays: string
  tracking: string
}

// Zonas de cobertura realistas de Correo Paraguayo
const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "asu",
    name: "Asunción y Área Metropolitana",
    description: "Asunción, Luque, San Lorenzo, Lambaré, Ñemby, Limpio, Capiatá, Itauguá, Areguá",
    deliveryDays: "1 día hábil",
    baseCost: 15000, // Gs. 15.000
    costPerKg: 3000  // Gs. 3.000 por kg adicional
  },
  {
    id: "ciudades-principales",
    name: "Ciudades Principales",
    description: "Ciudad del Este, Encarnación, Villarrica, Caacupé, Concepción, Coronel Oviedo",
    deliveryDays: "2-3 días hábiles",
    baseCost: 25000, // Gs. 25.000
    costPerKg: 4000  // Gs. 4.000 por kg adicional
  },
  {
    id: "interior",
    name: "Interior del País",
    description: "Ciudades medianas y pueblos del interior",
    deliveryDays: "3-5 días hábiles",
    baseCost: 35000, // Gs. 35.000
    costPerKg: 5000  // Gs. 5.000 por kg adicional
  },
  {
    id: "rural",
    name: "Zonas Rurales",
    description: "Comunidades y zonas rurales alejadas",
    deliveryDays: "5-7 días hábiles",
    baseCost: 45000, // Gs. 45.000
    costPerKg: 6000  // Gs. 6.000 por kg adicional
  }
]

// Servicios de Correo Paraguayo
const SHIPPING_SERVICES: ShippingService[] = [
  {
    id: "carta-simple",
    name: "Carta Simple",
    description: "Servicio postal básico sin seguimiento",
    tracking: false,
    insurance: false,
    maxWeight: 0.5
  },
  {
    id: "carta-certificada",
    name: "Carta Certificada",
    description: "Con seguimiento y confirmación de entrega",
    tracking: true,
    insurance: false,
    maxWeight: 0.5
  },
  {
    id: "paquete-nacional",
    name: "Paquete Nacional",
    description: "Paquetes hasta 2kg con seguimiento",
    tracking: true,
    insurance: true,
    maxWeight: 2
  },
  {
    id: "encomienda",
    name: "Encomienda",
    description: "Paquetes hasta 30kg con seguimiento completo",
    tracking: true,
    insurance: true,
    maxWeight: 30
  },
  {
    id: "express",
    name: "Express",
    description: "Entrega prioritaria 24h en Asunción",
    tracking: true,
    insurance: true,
    maxWeight: 5
  }
]

// Función para calcular costo de envío
function calculateShippingCost(
  serviceId: string,
  zoneId: string,
  weight: number
): ShippingRate | null {
  const service = SHIPPING_SERVICES.find(s => s.id === serviceId)
  const zone = SHIPPING_ZONES.find(z => z.id === zoneId)
  
  if (!service || !zone || weight > service.maxWeight) {
    return null
  }

  const additionalWeight = Math.max(0, weight - 1) // Primer kg incluido en base
  const totalCost = zone.baseCost + (additionalWeight * zone.costPerKg)
  
  return {
    serviceId: service.id,
    serviceName: service.name,
    zoneId: zone.id,
    zoneName: zone.name,
    weight,
    cost: totalCost,
    deliveryDays: zone.deliveryDays,
    tracking: service.tracking ? "Incluido" : "No disponible"
  }
}

// Función para determinar zona por ciudad/departamento
function getZoneByLocation(city: string, department: string): string {
  const location = `${city}, ${department}`.toLowerCase()
  
  // Asunción y área metropolitana
  if (location.includes("asunción") || 
      location.includes("luque") || 
      location.includes("san lorenzo") || 
      location.includes("lambaré") || 
      location.includes("capiatá") ||
      location.includes("itauguá")) {
    return "asu"
  }
  
  // Ciudades principales
  if (location.includes("ciudad del este") || 
      location.includes("encarnación") || 
      location.includes("villarrica") || 
      location.includes("caacupé") || 
      location.includes("concepción") ||
      location.includes("coronel oviedo")) {
    return "ciudades-principales"
  }
  
  // Interior
  if (location.includes("alto paraná") || 
      location.includes("central") || 
      location.includes("cordillera") || 
      location.includes("paraguarí") ||
      location.includes("guairá") ||
      location.includes("itapúa")) {
    return "interior"
  }
  
  // Zonas rurales (default)
  return "rural"
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const city = searchParams.get("city")?.toLowerCase() || ""
    const department = searchParams.get("department")?.toLowerCase() || ""
    const weight = parseFloat(searchParams.get("weight") || "1")
    const serviceId = searchParams.get("service") || "encomienda"

    switch (action) {
      case "zones":
        return NextResponse.json({
          success: true,
          data: SHIPPING_ZONES
        })

      case "services":
        return NextResponse.json({
          success: true,
          data: SHIPPING_SERVICES
        })

      case "calculate":
        if (!city || !department) {
          return NextResponse.json({
            success: false,
            error: "Se requiere ciudad y departamento"
          }, { status: 400 })
        }

        const zoneId = getZoneByLocation(city, department)
        const rates = []
        
        // Calcular para todos los servicios disponibles
        for (const service of SHIPPING_SERVICES) {
          if (weight <= service.maxWeight) {
            const rate = calculateShippingCost(service.id, zoneId, weight)
            if (rate) {
              rates.push(rate)
            }
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            city,
            department,
            zoneId,
            zoneName: SHIPPING_ZONES.find(z => z.id === zoneId)?.name,
            weight,
            rates: rates.sort((a, b) => a.cost - b.cost)
          }
        })

      case "track":
        const trackingNumber = searchParams.get("number")
        if (!trackingNumber) {
          return NextResponse.json({
            success: false,
            error: "Se requiere número de seguimiento"
          }, { status: 400 })
        }

        // Simulación de seguimiento
        return NextResponse.json({
          success: true,
          data: {
            trackingNumber,
            status: "En tránsito",
            origin: "Asunción",
            destination: city,
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            checkpoints: [
              {
                location: "Asunción - Centro de Distribución",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: "Recibido en origen"
              },
              {
                location: "Asunción - Centro de Clasificación",
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: "En proceso de envío"
              },
              {
                location: "En tránsito",
                date: new Date().toISOString(),
                status: "En camino a destino"
              }
            ]
          }
        })

      default:
        return NextResponse.json({
          success: true,
          message: "API de Correo Paraguayo",
          availableActions: ["zones", "services", "calculate", "track"],
          documentation: "Usa ?action=zones|services|calculate|track"
        })
    }

  } catch (error) {
    console.error("Error in shipping API:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor"
    }, { status: 500 })
  }
}

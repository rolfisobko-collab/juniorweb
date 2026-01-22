import { NextRequest, NextResponse } from "next/server"

// Datos de AEX Paraguay
const AEX_ZONES = [
  { id: "asuncion", name: "Asunción y Área Metropolitana", baseCost: 25000, costPerKg: 5000, deliveryDays: "1 día hábil" },
  { id: "central", name: "Central", baseCost: 30000, costPerKg: 6000, deliveryDays: "1-2 días hábiles" },
  { id: "alto-parana", name: "Alto Paraná", baseCost: 45000, costPerKg: 8000, deliveryDays: "2-3 días hábiles" },
  { id: "itapua", name: "Itapúa", baseCost: 50000, costPerKg: 9000, deliveryDays: "2-3 días hábiles" },
  { id: "concepcion", name: "Concepción", baseCost: 48000, costPerKg: 8500, deliveryDays: "2-3 días hábiles" },
  { id: "san-pedro", name: "San Pedro", baseCost: 52000, costPerKg: 9500, deliveryDays: "3-4 días hábiles" },
  { id: "cordillera", name: "Cordillera", baseCost: 40000, costPerKg: 7000, deliveryDays: "2-3 días hábiles" },
  { id: "guaira", name: "Guairá", baseCost: 42000, costPerKg: 7500, deliveryDays: "2-3 días hábiles" },
  { id: "caaguazu", name: "Caaguazú", baseCost: 46000, costPerKg: 8000, deliveryDays: "2-3 días hábiles" },
  { id: "caazapa", name: "Caazapá", baseCost: 55000, costPerKg: 10000, deliveryDays: "3-4 días hábiles" },
  { id: "alto-paraguay", name: "Alto Paraguay", baseCost: 65000, costPerKg: 12000, deliveryDays: "4-5 días hábiles" },
  { id: "boqueron", name: "Boquerón", baseCost: 70000, costPerKg: 13000, deliveryDays: "5-7 días hábiles" },
  { id: "presidente-hayes", name: "Presidente Hayes", baseCost: 60000, costPerKg: 11000, deliveryDays: "4-5 días hábiles" },
  { id: "amambay", name: "Amambay", baseCost: 58000, costPerKg: 10500, deliveryDays: "3-4 días hábiles" },
  { id: "canindeyu", name: "Canindeyú", baseCost: 56000, costPerKg: 10000, deliveryDays: "3-4 días hábiles" },
  { id: "neembucu", name: "Ñeembucú", baseCost: 48000, costPerKg: 8500, deliveryDays: "2-3 días hábiles" },
  { id: "paraguari", name: "Paraguarí", baseCost: 38000, costPerKg: 6500, deliveryDays: "2-3 días hábiles" }
]

const AEX_SERVICES = [
  { id: "express", name: "AEX Express", maxWeight: 30, tracking: true },
  { id: "standard", name: "AEX Standard", maxWeight: 50, tracking: true },
  { id: "economy", name: "AEX Economy", maxWeight: 100, tracking: false }
]

interface AEXRate {
  serviceId: string
  serviceName: string
  zoneId: string
  zoneName: string
  weight: number
  cost: number
  deliveryDays: string
  tracking: string
}

function getZoneByLocation(city: string, department: string): string {
  const normalizedCity = city.toLowerCase().normalize("NFD").replace(/[\u0301\u0308\u0300\u0302\u0303]/g, "")
  const normalizedDept = department.toLowerCase().normalize("NFD").replace(/[\u0301\u0308\u0300\u0302\u0303]/g, "")

  // Mapeo de ciudades a zonas
  const cityToZone: Record<string, string> = {
    "asuncion": "asuncion",
    "lambare": "asuncion",
    "luque": "asuncion",
    "san lorenzo": "asuncion",
    "capiata": "central",
    "itagua": "central",
    "aregua": "central",
    "ypané": "central",
    "limpio": "central",
    "nemby": "central",
    "san antonio": "central",
    "ciudad del este": "alto-parana",
    "hernandarias": "alto-parana",
    "presidente franco": "alto-parana",
    "encarnacion": "itapua",
    "carmen del parana": "itapua",
    "san juan bautista": "itapua",
    "concepcion": "concepcion",
    "horqueta": "concepcion"
  }

  // Buscar por ciudad primero
  if (cityToZone[normalizedCity]) {
    return cityToZone[normalizedCity]
  }

  // Si no encuentra por ciudad, buscar por departamento
  const deptToZone: Record<string, string> = {
    "asuncion": "asuncion",
    "central": "central",
    "alto parana": "alto-parana",
    "itapua": "itapua",
    "concepcion": "concepcion",
    "san pedro": "san-pedro",
    "cordillera": "cordillera",
    "guaira": "guaira",
    "caaguazu": "caaguazu",
    "caazapa": "caazapa",
    "alto paraguay": "alto-paraguay",
    "boqueron": "boqueron",
    "presidente hayes": "presidente-hayes",
    "amambay": "amambay",
    "canindeyu": "canindeyu",
    "neembucu": "neembucu",
    "paraguari": "paraguari"
  }

  return deptToZone[normalizedDept] || "central" // Default a Central
}

function calculateAEXShippingCost(serviceId: string, zoneId: string, weight: number): AEXRate | null {
  const service = AEX_SERVICES.find(s => s.id === serviceId)
  const zone = AEX_ZONES.find(z => z.id === zoneId)
  
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

export async function POST(request: NextRequest) {
  try {
    const { action, city, department, weight } = await request.json()

    if (action === "calculate") {
      if (!city || !department) {
        return NextResponse.json({
          success: false,
          error: "Se requiere ciudad y departamento"
        }, { status: 400 })
      }

      if (!weight || weight <= 0) {
        return NextResponse.json({
          success: false,
          error: "Se requiere un peso válido"
        }, { status: 400 })
      }

      const zoneId = getZoneByLocation(city, department)
      const rates = []
      
      // Calcular para todos los servicios AEX disponibles
      for (const service of AEX_SERVICES) {
        if (weight <= service.maxWeight) {
          const rate = calculateAEXShippingCost(service.id, zoneId, weight)
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
          zoneName: AEX_ZONES.find(z => z.id === zoneId)?.name,
          weight,
          rates: rates.sort((a, b) => a.cost - b.cost)
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: "Acción no válida"
    }, { status: 400 })

  } catch (error) {
    console.error("AEX API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor"
    }, { status: 500 })
  }
}

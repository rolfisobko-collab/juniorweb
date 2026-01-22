import { NextResponse } from "next/server"

// Lista de departamentos de Paraguay para filtrar resultados
const PARAGUAY_DEPARTMENTS = [
  "Asunción", "Alto Paraná", "Central", "Guairá", "Itapúa",
  "Concepción", "San Pedro", "Cordillera", "Paraguarí", "Misiones",
  "Ñeembucú", "Amambay", "Presidente Hayes", "Alto Paraguay",
  "Caaguazú", "Canindeyú"
]

// Cache simple para evitar múltiples llamadas a la API
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Función para buscar direcciones usando OpenStreetMap Nominatim
async function searchNominatim(query: string) {
  // Verificar cache primero
  const cacheKey = query.toLowerCase()
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=py&limit=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ParaguayEcommerce/1.0' // Requerido por Nominatim
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Guardar en cache
    cache.set(cacheKey, { data, timestamp: Date.now() })
    
    return data
  } catch (error) {
    console.error("Error calling Nominatim API:", error)
    return []
  }
}

// Función para formatear dirección de Nominatim
function formatAddress(place: any) {
  const address = place.address || {}
  
  // Construir la dirección completa
  let fullAddress = ""
  
  if (place.display_name) {
    fullAddress = place.display_name
  } else {
    const parts = []
    if (address.road) parts.push(address.road)
    if (address.house_number) parts.push(address.house_number)
    if (address.suburb) parts.push(address.suburb)
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village)
    }
    if (address.state) parts.push(address.state)
    if (address.postcode) parts.push(address.postcode)
    fullAddress = parts.join(", ")
  }

  return {
    id: place.place_id,
    display_name: place.display_name || fullAddress,
    lat: place.lat,
    lon: place.lon,
    type: place.type,
    importance: place.importance,
    address: {
      road: address.road || "",
      house_number: address.house_number || "",
      suburb: address.suburb || "",
      city: address.city || address.town || address.village || "",
      state: address.state || "",
      postcode: address.postcode || "",
      country: address.country || "Paraguay"
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() || ""
  
  try {
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        query,
        source: "nominatim"
      })
    }

    // Buscar en OpenStreetMap Nominatim
    const nominatimResults = await searchNominatim(query)
    
    // Filtrar y formatear resultados para Paraguay
    const paraguayResults = nominatimResults
      .filter((place: any) => {
        const address = place.address || {}
        const country = address.country || ""
        const state = address.state || ""
        
        // Incluir si es de Paraguay o si el estado coincide con nuestros departamentos
        return country.toLowerCase().includes("paraguay") || 
               PARAGUAY_DEPARTMENTS.some(dept => 
                 state.toLowerCase().includes(dept.toLowerCase())
               )
      })
      .map(formatAddress)
      .slice(0, 8) // Limitar a 8 resultados

    // Si no hay resultados de Nominatim, intentar con búsqueda más amplia
    if (paraguayResults.length === 0) {
      const broadResults = await searchNominatim(`${query}, Paraguay`)
      const formattedBroadResults = broadResults
        .slice(0, 5)
        .map(formatAddress)
      
      return NextResponse.json({
        success: true,
        results: formattedBroadResults,
        query,
        source: "nominatim-broad",
        total: formattedBroadResults.length
      })
    }

    return NextResponse.json({
      success: true,
      results: paraguayResults,
      query,
      source: "nominatim",
      total: paraguayResults.length
    })

  } catch (error) {
    console.error("Error in addresses API:", error)
    
    // Fallback a datos básicos si la API falla
    return NextResponse.json({
      success: true,
      results: [],
      query,
      source: "fallback",
      error: "API temporalmente no disponible",
      message: "Por favor, ingrese la dirección manualmente"
    })
  }
}

"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DepartmentCitySelectorProps {
  selectedDepartment: string
  selectedCity: string
  onDepartmentChange: (dept: string) => void
  onCityChange: (city: string) => void
}

// Lista estática de departamentos de Paraguay
const PARAGUAY_DEPARTMENTS = [
  "Asunción", "Alto Paraná", "Central", "Guairá", "Itapúa",
  "Concepción", "San Pedro", "Cordillera", "Paraguarí", "Misiones",
  "Ñeembucú", "Amambay", "Presidente Hayes", "Alto Paraguay",
  "Caaguazú", "Canindeyú"
]

export default function DepartmentCitySelector({
  selectedDepartment,
  selectedCity,
  onDepartmentChange,
  onCityChange
}: DepartmentCitySelectorProps) {
  const [departments] = useState<string[]>(PARAGUAY_DEPARTMENTS)
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  // Cargar ciudades cuando se selecciona un departamento
  useEffect(() => {
    if (!selectedDepartment) {
      setCities([])
      return
    }

    const fetchCities = async () => {
      setLoadingCities(true)
      try {
        const response = await fetch(`/api/addresses?q=${encodeURIComponent(selectedDepartment)}`)
        const data = await response.json()
        
        if (data.success && data.results) {
          // Extraer ciudades únicas de los resultados
          const citySet = new Set<string>()
          
          data.results.forEach((result: any) => {
            if (result.address) {
              if (result.address.city) {
                citySet.add(result.address.city)
              }
              if (result.address.town) {
                citySet.add(result.address.town)
              }
              if (result.address.village) {
                citySet.add(result.address.village)
              }
            }
            
            // También buscar en display_name
            if (result.display_name) {
              const parts = result.display_name.split(', ')
              if (parts.length >= 2) {
                // El penúltimo elemento suele ser la ciudad
                const cityCandidate = parts[parts.length - 2]
                if (cityCandidate && !cityCandidate.includes('Región') && !cityCandidate.includes('Distrito')) {
                  citySet.add(cityCandidate)
                }
              }
            }
          })
          
          // Si no encontramos ciudades, agregar algunas comunes para el departamento
          if (citySet.size === 0) {
            const commonCities = getCommonCities(selectedDepartment)
            setCities(commonCities)
          } else {
            setCities(Array.from(citySet).sort())
          }
        } else {
          // Fallback a ciudades comunes
          const commonCities = getCommonCities(selectedDepartment)
          setCities(commonCities)
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
        // Fallback a ciudades comunes
        const commonCities = getCommonCities(selectedDepartment)
        setCities(commonCities)
      } finally {
        setLoadingCities(false)
      }
    }
    fetchCities()
  }, [selectedDepartment])

  // Función de fallback con ciudades comunes
  const getCommonCities = (dept: string): string[] => {
    const cityMap: { [key: string]: string[] } = {
      "Asunción": ["Asunción"],
      "Alto Paraná": ["Ciudad del Este", "Hernandarias", "Presidente Franco", "Minga Guazú", "Los Cedrales"],
      "Central": ["Luque", "San Lorenzo", "Lambaré", "Capiatá", "Itauguá", "Areguá", "Ypané", "Itá", "Caacupé", "Pirayú"],
      "Guairá": ["Villarrica", "Mbocayaty del Yhaguy", "Yataity", "Independencia", "Paso Yobai"],
      "Itapúa": ["Encarnación", "Pedro Juan Caballero", "San Juan del Paraná", "Carmen del Paraná", "General Artigas"],
      "Concepción": ["Concepción", "Horqueta", "Yby Yaú", "Resquín", "Vallemí"],
      "San Pedro": ["San Pedro de Ycuamandiyú", "General Elizardo Aquino", "Choré", "Santa Rosa del Aguaray"],
      "Cordillera": ["Caacupé", "Pirayú", "Arroyos y Esteros", "Tobatí", "Altos"],
      "Paraguarí": ["Paraguarí", "Ybycuí", "Carayaó", "Mbuyapey", "Quiindy"],
      "Misiones": ["San Ignacio", "San Juan Bautista", "Santa María", "Ayolas", "San Patricio"],
      "Ñeembucú": ["Pilar", "Alberdi", "Capiatá del Ñeembucú", "General José Eduvigis", "Humaitá"],
      "Amambay": ["Bella Vista", "Pedro Juan Caballero", "Bahía Negra", "Puerto Casado"],
      "Presidente Hayes": ["Villa Hayes", "Benjamín Aceval", "Nanawa", "Tres de Mayo"],
      "Alto Paraguay": ["Cerro Corá", "Fuerte Olimpo", "Puerto Casado"],
      "Caaguazú": ["Coronel Oviedo", "Caaguazú", "Naranjal", "Mcal. Estigarribia", "Yhú"],
      "Canindeyú": ["Salto del Guairá", "Curuguaty", "Yataity", "Mcal. Estigarribia"]
    }
    
    return cityMap[dept] || ["Ciudad principal"]
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="department">Departamento *</Label>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ciudad/Pueblo *</Label>
        <Select 
          value={selectedCity} 
          onValueChange={onCityChange}
          disabled={!selectedDepartment || loadingCities}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              selectedDepartment 
                ? (loadingCities ? "Cargando ciudades..." : "Seleccionar ciudad")
                : "Primero selecciona departamento"
            } />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

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

  // Función de fallback con ciudades comunes
  const getCommonCities = (dept: string): string[] => {
    const cityMap: { [key: string]: string[] } = {
      "Asunción": ["Asunción"],
      "Alto Paraná": ["Ciudad del Este", "Hernandarias", "Presidente Franco", "Minga Guazú"],
      "Central": ["Luque", "San Lorenzo", "Lambaré", "Capiatá", "Itauguá"],
      "Guairá": ["Villarrica", "Mbocayaty del Yhaguy", "Yataity"],
      "Itapúa": ["Encarnación", "Pedro Juan Caballero", "San Juan del Paraná"],
      "Concepción": ["Concepción", "Horqueta", "Yby Yaú"],
      "San Pedro": ["San Pedro de Ycuamandiyú", "General Elizardo Aquino"],
      "Cordillera": ["Caacupé", "Pirayú", "Arroyos y Esteros"],
      "Paraguarí": ["Paraguarí", "Ybycuí", "Carayaó"],
      "Misiones": ["San Ignacio", "San Juan Bautista", "Santa María"],
      "Ñeembucú": ["Pilar", "Alberdi", "Capiatá del Ñeembucú"],
      "Amambay": ["Bella Vista", "Pedro Juan Caballero"],
      "Presidente Hayes": ["Villa Hayes", "Benjamín Aceval"],
      "Alto Paraguay": ["Cerro Corá", "Fuerte Olimpo"],
      "Caaguazú": ["Coronel Oviedo", "Caaguazú", "Naranjal"],
      "Canindeyú": ["Salto del Guairá", "Curuguaty"]
    }
    
    return cityMap[dept] || ["Ciudad principal"]
  }

  // Cargar ciudades cuando se selecciona un departamento
  useEffect(() => {
    if (!selectedDepartment) {
      setCities([])
      return
    }

    // Cargar ciudades comunes directamente
    const commonCities = getCommonCities(selectedDepartment)
    setCities(commonCities)
  }, [selectedDepartment])

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
          disabled={!selectedDepartment}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              selectedDepartment 
                ? "Seleccionar ciudad"
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

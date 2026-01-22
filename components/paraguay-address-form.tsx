"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Department {
  name: string
  cities: string[]
}

interface ParaguayAddressFormProps {
  address: string
  city: string
  state: string
  zipCode: string
  apartmentNumber: string
  onAddressChange: (value: string) => void
  onCityChange: (value: string) => void
  onStateChange: (value: string) => void
  onZipCodeChange: (value: string) => void
  onApartmentNumberChange: (value: string) => void
}

export default function ParaguayAddressForm({
  address,
  city,
  state,
  zipCode,
  apartmentNumber,
  onAddressChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  onApartmentNumberChange
}: ParaguayAddressFormProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Cargar departamentos al montar
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/addresses")
        const data = await response.json()
        if (data.success) {
          const deptList = data.departments.map((dept: string) => ({
            name: dept,
            cities: []
          }))
          setDepartments(deptList)
        }
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    fetchDepartments()
  }, [])

  const handleDepartmentChange = (deptName: string) => {
    onStateChange(deptName)
    
    // Cargar ciudades del departamento seleccionado
    const fetchCities = async () => {
      try {
        const response = await fetch(`/api/addresses?q=${encodeURIComponent(deptName)}`)
        const data = await response.json()
        if (data.success) {
          const deptResult = data.results.find((r: any) => r.type === "department" && r.name === deptName)
          if (deptResult) {
            setAvailableCities(deptResult.cities || [])
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }
    fetchCities()
  }

  return (
    <div className="space-y-4">
      {/* Select de Departamento */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">Departamento *</Label>
          <Select value={state} onValueChange={handleDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select de Ciudad */}
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad/Pueblo *</Label>
          <Select 
            value={city} 
            onValueChange={onCityChange}
            disabled={!state || availableCities.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={state ? "Seleccionar ciudad" : "Primero selecciona departamento"} />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campo de dirección */}
      <div className="space-y-2">
        <Label htmlFor="address-detail">Calle y Número *</Label>
        <Input
          id="address-detail"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Ej: Av. España 123"
        />
      </div>

      {/* Campo opcional de departamento */}
      <div className="space-y-2">
        <Label htmlFor="apartment">Departamento/Piso (Opcional)</Label>
        <Input
          id="apartment"
          value={apartmentNumber}
          onChange={(e) => onApartmentNumberChange(e.target.value)}
          placeholder="Ej: Depto 4A, Piso 3, Torre B"
        />
      </div>

      {/* Código Postal */}
      <div className="space-y-2">
        <Label htmlFor="zipCode">Código Postal *</Label>
        <Input
          id="zipCode"
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value)}
          placeholder="000000"
        />
      </div>
    </div>
  )
}

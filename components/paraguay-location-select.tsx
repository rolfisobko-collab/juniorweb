"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, X } from "lucide-react"

interface ParaguayLocationSelectProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: { address: string; city: string; department: string }) => void
}

// Datos de Paraguay
const paraguayData = {
  "Asunción": {
    department: "Asunción",
    cities: ["Asunción", "Lambaré", "Luque", "San Antonio", "San Lorenzo", "Villarrica", "Ñemby"]
  },
  "Alto Paraná": {
    department: "Alto Paraná",
    cities: ["Ciudad del Este", "Hernandarias", "Presidente Franco", "Puerto Iguazú", "Encarnación", "Cambyretá"]
  },
  "Central": {
    department: "Central", 
    cities: ["Areguá", "Caacupé", "Carapeguá", "Capiatá", "Itá", "Itauguá", "Julián Augusto Saldivar", "Limpio", "Nueva Italia", "Pirayú", "San Antonio", "San José de los Arroyos", "San Juan Bautista", "San Pedro", "Sapucaí", "Villarrica", "Yaguarón", "Ybycuí", "Ypané"]
  },
  "Concepción": {
    department: "Concepción",
    cities: ["Concepción", "Horqueta", "General Resquín", "Yby Pytá", "Pedro Juan Caballero", "Coronel Oviedo", "Trinidad", "Altos", "Yataity"]
  },
  "Cordillera": {
    department: "Cordillera",
    cities: ["Caaguazú", "Coronel Oviedo", "Mcal. López", "Naranjal", "Raúl Arsenio Oviedo", "San Joaquín", "San José", "Yataity"]
  },
  "Guairá": {
    department: "Guairá",
    cities: ["Villarrica", "Mbocayaty", "Naranjal", "Yby Pytá", "Itanará", "Paso Yobai", "Independencia", "General Higinio Morínigo"]
  },
  "Itapúa": {
    department: "Itapúa",
    cities: ["Encarnación", "San Juan Bautista", "San Pedro del Ycuamandiyú", "Carmen del Paraná", "Trinidad", "General Artigas", "Pirayú", "Coronel Bogado", "Alborada", "Cambyretá", "Eden", "Fram", "San Cosme y Damián", "Yatay", "Bella Vista", "Capitán Miranda"]
  },
  "Misiones": {
    department: "Misiones",
    cities: ["San Juan Bautista", "San Ignacio", "Ayolas", "Santa María", "San Miguel", "San Pedro", "Yabebyry", "Pilar"]
  },
  "Ñeembucú": {
    department: "Ñeembucú",
    cities: ["Pilar", "Capiatá", "Benjamín Aceval", "San Estanislao", "Villarrica", "Alto Verá", "Guarambaré", "Yby Pytá", "Humaitá", "General Elizardo Aquino", "Lima", "Pirayú"]
  },
  "Paraguarí": {
    department: "Paraguarí",
    cities: ["San Pedro", "San Juan Bautista", "Yhú", "San Antonio", "Escobar", "Yby Pytá", "Coronel Oviedo", "Mcal. López", "Sapucaí", "Capiatá", "Villarrica", "Guarambaré", "Pirayú"]
  },
  "Presidente Hayes": {
    department: "Presidente Hayes",
    cities: ["Villarrica", "San Pedro", "Benjamín Aceval", "Tres Bocas", "Alto Verá", "Pilar", "Isla Pucú", "Nanawa", "Puerto Pinasco"]
  }
}

export default function ParaguayLocationSelect({ isOpen, onClose, onLocationSelect }: ParaguayLocationSelectProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [street, setStreet] = useState("")
  const [streetNumber, setStreetNumber] = useState("")
  const [apartment, setApartment] = useState("")

  const departments = Object.keys(paraguayData)

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department)
    setSelectedCity("")
  }

  const handleLocationSelect = () => {
    if (selectedDepartment && selectedCity && street && streetNumber) {
      const addressParts = [
        `${street} ${streetNumber}`,
        apartment && `Dept ${apartment}`,
        selectedCity,
        selectedDepartment,
        "Paraguay"
      ].filter(Boolean)

      const fullAddress = addressParts.join(", ")
      
      onLocationSelect({
        address: fullAddress,
        city: selectedCity,
        department: selectedDepartment
      })
      onClose()
    }
  }

  const currentCities = selectedDepartment ? paraguayData[selectedDepartment as keyof typeof paraguayData]?.cities || [] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Seleccionar Ubicación en Paraguay
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Departamento */}
          <div className="space-y-2">
            <Label htmlFor="department">Departamento *</Label>
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
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

          {/* Ciudad */}
          {selectedDepartment && (
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {currentCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dirección */}
          {selectedCity && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    placeholder="Ej: Eusebio Ayala"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">N° *</Label>
                  <Input
                    id="number"
                    placeholder="1234"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apartment">Departamento (Opcional)</Label>
                <Input
                  id="apartment"
                  placeholder="Ej: 3A, Torre 2, Piso 5"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Ubicación seleccionada */}
          {selectedDepartment && selectedCity && street && streetNumber && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label>Ubicación Seleccionada</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {street} {streetNumber}
                  {apartment && `, Dept ${apartment}`}
                  {`, ${selectedCity}, ${selectedDepartment}, Paraguay`}
                </span>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleLocationSelect}
              disabled={!selectedDepartment || !selectedCity || !street || !streetNumber}
            >
              Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

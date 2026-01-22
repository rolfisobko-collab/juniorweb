"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Package, Clock, MapPin } from "lucide-react"

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

interface ShippingCalculatorProps {
  city: string
  department: string
  weight?: number // Peso total del carrito en kg
  onShippingSelect: (rate: ShippingRate) => void
}

export default function ShippingCalculator({
  city,
  department,
  weight,
  onShippingSelect
}: ShippingCalculatorProps) {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [services, setServices] = useState<ShippingService[]>([])
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedService, setSelectedService] = useState<string>("encomienda")
  const [inputWeight, setInputWeight] = useState<string>(weight?.toString() || "1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Función para calcular tarifas
  const calculateRates = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/shipping?action=calculate&city=${encodeURIComponent(city)}&department=${encodeURIComponent(department)}&weight=${inputWeight}&service=${selectedService}`
      )
      const data = await response.json()

      if (data.success) {
        setRates(data.data.rates)
        // Seleccionar automáticamente la primera opción (más económica)
        if (data.data.rates.length > 0) {
          onShippingSelect(data.data.rates[0])
        }
      } else {
        setError(data.error || "Error al calcular tarifas")
        setRates([])
      }
    } catch (error) {
      console.error("Error calculating rates:", error)
      setError("Error de conexión")
      setRates([])
    } finally {
      setLoading(false)
    }
  }

  // Actualizar el input cuando cambia el peso prop
  useEffect(() => {
    if (weight !== undefined) {
      setInputWeight(weight.toString())
    }
  }, [weight])

  // Forzar cálculo inicial cuando se tienen ciudad y departamento
  useEffect(() => {
    if (city && department && weight) {
      calculateRates()
    }
  }, [city, department, weight])

  // Cargar zonas y servicios al montar
  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const [zonesRes, servicesRes] = await Promise.all([
          fetch("/api/shipping?action=zones"),
          fetch("/api/shipping?action=services")
        ])

        const zonesData = await zonesRes.json()
        const servicesData = await servicesRes.json()

        if (zonesData.success) {
          setZones(zonesData.data)
        }
        if (servicesData.success) {
          setServices(servicesData.data)
        }
      } catch (error) {
        console.error("Error fetching shipping data:", error)
        setError("Error al cargar datos de envío")
      }
    }

    fetchShippingData()
  }, [])

  // Calcular tarifas cuando cambian los datos
  useEffect(() => {
    if (!city || !department || !weight) {
      setRates([])
      return
    }

    const calculateRates = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `/api/shipping?action=calculate&city=${encodeURIComponent(city)}&department=${encodeURIComponent(department)}&weight=${inputWeight}&service=${selectedService}`
        )
        const data = await response.json()

        if (data.success) {
          setRates(data.data.rates)
          // Seleccionar automáticamente la primera opción (más económica)
          if (data.data.rates.length > 0) {
            onShippingSelect(data.data.rates[0])
          }
        } else {
          setError(data.error || "Error al calcular tarifas")
          setRates([])
        }
      } catch (error) {
        console.error("Error calculating rates:", error)
        setError("Error de conexión")
        setRates([])
      } finally {
        setLoading(false)
      }
    }

    calculateRates()
  }, [city, department, weight, selectedService, onShippingSelect])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Calcular Envío</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="service">Tipo de Envío</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {service.maxWeight}kg max • {service.tracking ? "Con seguimiento" : "Sin seguimiento"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso Estimado (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="1.0"
              min="0.1"
              max="30"
              step="0.1"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
            <span className="text-sm text-muted-foreground">Calculando tarifas...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {rates.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Opciones de Envío Disponibles</h3>
            
            {rates.map((rate, index) => (
              <div
                key={`${rate.serviceId}-${index}`}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedService === rate.serviceId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onShippingSelect(rate)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-base">{rate.serviceName}</h4>
                    <p className="text-sm text-muted-foreground">{rate.zoneName}</p>
                    <p className="text-xs text-muted-foreground">
                      {rate.deliveryDays} • {rate.tracking}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(rate.cost)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      por {rate.weight}kg
                    </div>
                  </div>
                </div>
                
                {selectedService === rate.serviceId && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 0-1.414 1.414l-8-8a1 1 0 0 0-1.414 1.414L10.586 9.293a1 1 0 0 0 1.414-1.414L17 17.707V17a1 1 0 0 0 1.414-1.414l-8-8a1 1 0 0 0-1.414-1.414L10.586 9.293a1 1 0 0 0 1.414-1.414z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Opción seleccionada</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && !error && rates.length === 0 && city && department && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              No hay opciones de envío disponibles para esta ubicación y peso.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, Clock, Check, AlertCircle } from "lucide-react"

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

interface AEXShippingCalculatorProps {
  city: string
  department: string
  weight: number
  onShippingSelect: (shipping: AEXRate) => void
}

export default function AEXShippingCalculator({ city, department, weight, onShippingSelect }: AEXShippingCalculatorProps) {
  const [rates, setRates] = useState<AEXRate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRate, setSelectedRate] = useState<AEXRate | null>(null)

  useEffect(() => {
    if (city && department && weight > 0) {
      calculateRates()
    }
  }, [city, department, weight])

  const calculateRates = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/aex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "calculate",
          city,
          department,
          weight
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRates(data.data.rates)
      } else {
        setError(data.error || "Error al calcular tarifas")
      }
    } catch (err) {
      setError("Error de conexión con AEX")
    } finally {
      setLoading(false)
    }
  }

  const handleRateSelect = (rate: AEXRate) => {
    setSelectedRate(rate)
    onShippingSelect(rate)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Calculando tarifas de AEX...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button onClick={calculateRates} variant="outline" className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (rates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Ingresa tu ubicación para ver las tarifas de AEX</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Tarifas de AEX</h3>
        <span className="text-sm text-muted-foreground">
          ({city}, {department})
        </span>
      </div>

      {rates.map((rate) => (
        <div
          key={`${rate.serviceId}-${rate.zoneId}`}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedRate?.serviceId === rate.serviceId && selectedRate?.zoneId === rate.zoneId
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => handleRateSelect(rate)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {rate.serviceId === "express" && <Package className="h-5 w-5 text-primary" />}
                  {rate.serviceId === "standard" && <Truck className="h-5 w-5 text-primary" />}
                  {rate.serviceId === "economy" && <Package className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h4 className="font-semibold">{rate.serviceName}</h4>
                  <p className="text-sm text-muted-foreground">{rate.zoneName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {rate.deliveryDays}
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {rate.weight} kg
                </div>
                {rate.tracking === "Incluido" && (
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Tracking
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                Gs. {rate.cost.toLocaleString('es-PY')}
              </div>
            </div>
          </div>

          {selectedRate?.serviceId === rate.serviceId && selectedRate?.zoneId === rate.zoneId && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Opción seleccionada</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

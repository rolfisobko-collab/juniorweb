"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Package, MapPin, Store, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react"

// Datos de Paraguay para AEX
const PARAGUAY_DEPARTMENTS = [
  { value: 'asuncion', label: 'Asunción' },
  { value: 'central', label: 'Central' },
  { value: 'alto_parana', label: 'Alto Paraná' },
  { value: 'itapua', label: 'Itapúa' },
  { value: 'concepcion', label: 'Concepción' },
  { value: 'san_pedro', label: 'San Pedro' },
  { value: 'cordillera', label: 'Cordillera' },
  { value: 'guaira', label: 'Guairá' },
  { value: 'caaguazu', label: 'Caaguazú' },
  { value: 'caazapa', label: 'Caazapá' },
  { value: 'canindeyu', label: 'Canindeyú' },
  { value: 'neembucu', label: 'Ñeembucú' },
  { value: 'amambay', label: 'Amambay' },
  { value: 'presidente_hayes', label: 'Presidente Hayes' },
  { value: 'alto_paraguay', label: 'Alto Paraguay' },
  { value: 'boqueron', label: 'Boquerón' }
]

interface CheckoutStepsProps {
  items: any[]
  user: any
  total: number
}

export default function CheckoutSteps({ items, user, total }: CheckoutStepsProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    method: "",
    cost: 0,
    address: "",
    city: "",
    department: "",
    notes: ""
  })
  const [aexCalculating, setAexCalculating] = useState(false)
  const [showAexForm, setShowAexForm] = useState(false)
  const [paymentData, setPaymentData] = useState({
    method: "card",
    currency: "PYG"
  })

  // Calcular peso total del carrito
  const calculateTotalWeight = () => {
    return items.reduce((total, item) => {
      const productWeight = item.product.weight || 0.5
      return total + (productWeight * item.quantity)
    }, 0)
  }

  const shippingOptions = [
    {
      id: "pickup",
      name: "Retiro en Local",
      description: "Retira tu pedido en nuestro local",
      cost: 0,
      icon: Store,
      time: "Inmediato",
      address: "Av. Eusebio Ayala 1234, Asunción"
    },
    {
      id: "aex",
      name: "Envío AEX",
      description: "Envío por Agencia de Envíos Express",
      cost: null, // ← Se calcula con API
      icon: Truck,
      time: "Según servicio",
      requiresAddress: true,
      needsCalculation: true // ← Indica que necesita cálculo
    },
    {
      id: "coordi",
      name: "Envío a Coordinar",
      description: "Coordinamos entrega directa",
      cost: null, // ← Sin precio, se le pasa al cliente
      icon: Truck,
      time: "1-2 días hábiles",
      requiresAddress: true
    }
  ]

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleShippingSelect = (option: any) => {
    setShippingData(prev => ({
      ...prev,
      method: option.id,
      cost: option.cost
    }))
  }

  const calculateFinalTotal = () => {
    const shippingCost = shippingData.cost || 0
    const taxAmount = total * 0.1
    return total + shippingCost + taxAmount
  }

  // Calcular envío con AEX
  const calculateAEXShipping = async (city: string, department: string) => {
    setAexCalculating(true)
    
    try {
      // Calcular datos del paquete desde el carrito
      const peso_total = items.reduce((sum, item) => {
        const productWeight = item.product.weight || 0.5
        return sum + (productWeight * item.quantity)
      }, 0)
      
      const valor_total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      
      const paquete = {
        peso: Math.round(peso_total * 100) / 100,
        largo: 30,
        ancho: 20,
        alto: 15,
        valor_declarado: valor_total,
        descripcion: `Pedido con ${items.length} productos`
      }

      const request = {
        datos_envio: {
          origen: {
            ciudad: "Ciudad del Este",
            departamento: "Alto Paraná",
            direccion: "Tienda Online - Centro de Distribución"
          },
          destino: {
            ciudad: city,
            departamento: department,
            direccion: shippingData.address || "Dirección del cliente"
          },
          paquetes: [paquete],
          servicio: "express"
        }
      }

      console.log('📦 Enviando a AEX:', request)

      const response = await fetch('/api/aex/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      const data = await response.json()

      if (data.success) {
        // Actualizar el costo del envío
        setShippingData(prev => ({
          ...prev,
          cost: data.data.cotizacion.costo_total,
          city: city,
          department: department
        }))
        
        console.log('✅ Costo AEX calculado:', data.data.cotizacion.costo_total)
        setShowAexForm(false)
      } else {
        alert('Error calculando envío: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión con AEX')
    } finally {
      setAexCalculating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step === 1 && "Información de Envío"}
                  {step === 2 && "Método de Envío"}
                  {step === 3 && "Información de Pago"}
                </p>
              </div>
              {step < 3 && (
                <div className={`w-8 h-0.5 ml-4 ${
                  currentStep > step ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Shipping Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    placeholder="Av. Eusebio Ayala 1234"
                    value={shippingData.address}
                    onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Select value={shippingData.city} onValueChange={(value) => setShippingData(prev => ({ ...prev, city: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asuncion">Asunción</SelectItem>
                      <SelectItem value="ciudad-del-este">Ciudad del Este</SelectItem>
                      <SelectItem value="encarnacion">Encarnación</SelectItem>
                      <SelectItem value="san-lorenzo">San Lorenzo</SelectItem>
                      <SelectItem value="lambaré">Lambaré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <Select value={shippingData.department} onValueChange={(value) => setShippingData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asuncion">Asunción</SelectItem>
                      <SelectItem value="alto-parana">Alto Paraná</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="itapua">Itapúa</SelectItem>
                      <SelectItem value="caaguazu">Caaguazú</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Input
                    id="notes"
                    placeholder="Referencias adicionales"
                    value={shippingData.notes}
                    onChange={(e) => setShippingData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button onClick={handleNextStep} className="flex items-center gap-2">
                Siguiente: Método de Envío
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Shipping Method */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Método de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {shippingOptions.map((option) => {
                const Icon = option.icon
                return (
                  <div
                    key={option.id}
                    className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      shippingData.method === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleShippingSelect(option)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{option.name}</h3>
                            <p className="text-muted-foreground">{option.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {option.time}
                              </div>
                              {option.address && (
                                <p>{option.address}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {option.cost === 0 ? "Gratis" : option.cost === null ? "A calcular" : `Gs. ${option.cost.toLocaleString('es-PY')}`}
                            </div>
                          </div>
                        </div>
                        {shippingData.method === option.id && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Opción seleccionada</span>
                            </div>
                            
                            {/* Si es AEX y necesita cálculo */}
                            {option.needsCalculation && (
                              <div className="mt-3 space-y-3">
                                {!showAexForm ? (
                                  <div className="flex items-center gap-2 text-sm text-green-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>Selecciona tu ubicación para calcular el costo</span>
                                    
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="ml-auto"
                                      onClick={() => setShowAexForm(true)}
                                    >
                                      <MapPin className="h-4 w-4 mr-2" />
                                      Seleccionar Ciudad
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold text-sm">Datos de Envío AEX</h4>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label className="text-xs">Departamento</Label>
                                        <Select onValueChange={(value) => {
                                          const dept = PARAGUAY_DEPARTMENTS.find(d => d.value === value)
                                          if (dept) {
                                            // Aquí iría la lógica para cargar ciudades
                                          }
                                        }}>
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Departamento" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {PARAGUAY_DEPARTMENTS.map((dept) => (
                                              <SelectItem key={dept.value} value={dept.value}>
                                                {dept.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <Label className="text-xs">Ciudad</Label>
                                        <Select>
                                          <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder="Ciudad" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {/* Ciudades se cargarían dinámicamente */}
                                            <SelectItem value="asuncion">Asunción</SelectItem>
                                            <SelectItem value="ciudad_del_este">Ciudad del Este</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button 
                                        size="sm" 
                                        onClick={() => calculateAEXShipping("Asunción", "Asunción")}
                                        disabled={aexCalculating}
                                      >
                                        {aexCalculating ? (
                                          <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Calculando...
                                          </>
                                        ) : (
                                          <>
                                            <Truck className="h-4 w-4 mr-2" />
                                            Calcular Envío
                                          </>
                                        )}
                                      </Button>
                                      
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => setShowAexForm(false)}
                                      >
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button onClick={handleNextStep} className="flex items-center gap-2" disabled={!shippingData.method}>
                Siguiente: Información de Pago
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment Information */}
      {currentStep === 3 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Método de Pago *</Label>
                    <Select value={paymentData.method} onValueChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Tarjeta de Crédito/Débito</SelectItem>
                        <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                        <SelectItem value="cash">Pago en Efectivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda *</Label>
                    <Select value={paymentData.currency} onValueChange={(value) => setPaymentData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar moneda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PYG">Guaraníes (PYG)</SelectItem>
                        <SelectItem value="USD">Dólares (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentData.method === "card" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">Información de Tarjeta</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Número de Tarjeta</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nombre en la Tarjeta</Label>
                        <Input id="card-name" placeholder="JUAN PEREZ" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Vencimiento</Label>
                        <Input id="card-expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input id="card-cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentData.method === "transfer" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Instrucciones para Transferencia</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p><strong>Banco:</strong> Banco Continental</p>
                      <p><strong>Cuenta:</strong> 123456789</p>
                      <p><strong>Titular:</strong> TechZone Ecommerce</p>
                      <p><strong>Monto:</strong> {paymentData.currency === "PYG" ? 
                        `Gs. ${calculateFinalTotal().toLocaleString('es-PY')}` : 
                        `$${(calculateFinalTotal() / 7500).toFixed(2)}`
                      }</p>
                    </div>
                  </div>
                )}

                {paymentData.method === "cash" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Instrucciones para Pago en Efectivo</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>1. Confirma tu pedido</p>
                      <p>2. Prepara el monto exacto</p>
                      <p>3. Paga contra entrega</p>
                      <p><strong>Monto:</strong> {paymentData.currency === "PYG" ? 
                        `Gs. ${calculateFinalTotal().toLocaleString('es-PY')}` : 
                        `$${(calculateFinalTotal() / 7500).toFixed(2)}`
                      }</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button className="flex items-center gap-2">
                    Confirmar Pedido
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product.name} x{item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>{shippingData.cost === 0 ? "Gratis" : `Gs. ${shippingData.cost.toLocaleString('es-PY')}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-2xl">
                      {paymentData.currency === "PYG" ? 
                        `Gs. ${calculateFinalTotal().toLocaleString('es-PY')}` : 
                        `$${(calculateFinalTotal() / 7500).toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

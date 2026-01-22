"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Package, MapPin, Store, Clock, ChevronLeft, ChevronRight, Check, CreditCard } from "lucide-react"
import ParaguayLocationSelectV2 from "@/components/paraguay-location-select-v2"
import AEXShippingCalculator from "@/components/aex-shipping-calculator"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    method: "",
    cost: 0,
    address: "",
    city: "",
    department: "",
    notes: "",
    aexService: null as any
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: ""
  })
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)

  // Mock data para el carrito
  const items = [
    {
      id: "1",
      product: {
        id: "1",
        name: "iPhone 15 Pro Max",
        price: 1199,
        weight: 0.22
      },
      quantity: 1
    }
  ]
  
  const total = 1199
  const user = { name: "Usuario Demo", email: "demo@email.com" }

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
      cost: null, // Se calcula dinámicamente
      icon: Truck,
      time: "Según servicio",
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
      cost: option.cost || 0,
      aexService: null
    }))
    
    // Si requiere dirección, abrir modal de ubicación
    if (option.requiresAddress) {
      setIsLocationModalOpen(true)
    }
  }

  const handleLocationSelect = (location: { 
    address: string; 
    city: string; 
    department: string;
    district: string;
    neighborhood: string;
    street: string;
    number: string;
    postalCode: string;
    apartment: string;
  }) => {
    setShippingData(prev => ({
      ...prev,
      address: location.address,
      city: location.district,
      department: location.department
    }))
  }

  const handleAEXSelect = (aexService: any) => {
    setShippingData(prev => ({
      ...prev,
      aexService,
      cost: aexService.cost
    }))
  }

  const calculateTotalWeight = () => {
    return items.reduce((total, item) => total + (item.product.weight || 0.5) * item.quantity, 0)
  }

  const calculateFinalTotal = () => {
    const shippingCost = shippingData.cost || 0
    const taxAmount = total * 0.1
    return total + shippingCost + taxAmount
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Completa los siguientes pasos para finalizar tu pedido
        </p>
      </div>

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
                            {option.requiresAddress && (
                              <div className="mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setIsLocationModalOpen(true)}
                                  className="w-full"
                                >
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Seleccionar Ciudad y Departamento
                                </Button>
                              </div>
                            )}
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
                            {shippingData.address && (
                              <div className="mt-2 text-sm text-green-600">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {shippingData.address}
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

            {/* AEX Calculator */}
            {shippingData.method === "aex" && shippingData.city && shippingData.department && (
              <div className="mt-6">
                <AEXShippingCalculator
                  city={shippingData.city}
                  department={shippingData.department}
                  weight={calculateTotalWeight()}
                  onShippingSelect={handleAEXSelect}
                />
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button onClick={handleNextStep} className="flex items-center gap-2" disabled={!shippingData.method || (shippingData.method === "aex" && !shippingData.aexService)}>
                Siguiente: Confirmación
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
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
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Información de Tarjeta</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Número de Tarjeta</Label>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Nombre en la Tarjeta</Label>
                      <Input 
                        id="card-name" 
                        placeholder="JUAN PEREZ"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Vencimiento</Label>
                      <Input 
                        id="card-expiry" 
                        placeholder="MM/AA"
                        value={paymentData.cardExpiry}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input 
                        id="card-cvv" 
                        placeholder="123"
                        value={paymentData.cardCvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardCvv: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

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
                      Gs. {calculateFinalTotal().toLocaleString('es-PY')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Location Modal */}
      <ParaguayLocationSelectV2
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  )
}

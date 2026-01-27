"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Package, MapPin, Store, Clock, ChevronLeft, ChevronRight, Check, CreditCard, Home } from "lucide-react"
import ParaguayLocationSelect from "@/components/paraguay-location-select"

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    method: "",
    cost: 0,
    address: "",
    city: "",
    department: "",
    notes: ""
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: ""
  })
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isConvenirModalOpen, setIsConvenirModalOpen] = useState(false)

  // Mock data para el carrito
  const items = [
    {
      id: "1",
      product: {
        id: "1",
        name: "iPhone 17 Pro Max",
        price: 1299,
        weight: 0.22
      },
      quantity: 1
    }
  ]
  
  const total = 1299
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
    },
    {
      id: "convenir",
      name: "Envío a Convenir",
      description: "Coordinamos envío directamente contigo",
      cost: null, // Se calcula según ubicación
      icon: Package,
      time: "A coordinar",
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
      cost: option.cost || 0
    }))
    
    // Si requiere dirección, abrir modal de ubicación correspondiente
    if (option.requiresAddress) {
      if (option.id === "aex") {
        setIsLocationModalOpen(true)
      } else if (option.id === "convenir") {
        setIsConvenirModalOpen(true)
      }
    }
  }

  const handleLocationSelect = (location: { 
    address: string; 
    city: string; 
    department: string;
  }) => {
    setShippingData(prev => ({
      ...prev,
      address: location.address,
      city: location.city,
      department: location.department
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
                  {step === 1 && "Método de Envío"}
                  {step === 2 && "Información de Pago"}
                  {step === 3 && "Compra Realizada"}
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

      {/* Step 1: Shipping Method */}
      {currentStep === 1 && (
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
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (option.id === "aex") {
                                      setIsLocationModalOpen(true)
                                    } else if (option.id === "convenir") {
                                      setIsConvenirModalOpen(true)
                                    }
                                  }}
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

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button onClick={handleNextStep} className="flex items-center gap-2" disabled={
                !shippingData.method || 
                (shippingData.method === "convenir" && !shippingData.address)
              }>
                Siguiente: Información de Pago
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Payment Information */}
      {currentStep === 2 && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre del Titular *</Label>
                      <Input
                        id="cardName"
                        placeholder="Nombre del titular"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Vencimiento *</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={paymentData.cardExpiry}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV *</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        value={paymentData.cardCvv}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardCvv: e.target.value }))}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button onClick={handleNextStep} className="flex items-center gap-2">
                    Realizar Compra
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Gs. {total.toLocaleString('es-PY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>
                      {shippingData.cost === 0 ? "Gratis" : shippingData.cost === null ? "A calcular" : `Gs. ${shippingData.cost.toLocaleString('es-PY')}`}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-2xl">
                      Gs. {(total + (shippingData.cost || 0)).toLocaleString('es-PY')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Step 3: Order Success */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Compra Realizada con Éxito!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Felicitaciones! Tu pedido ha sido procesado correctamente y está siendo preparado para envío.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">Resumen del Pedido</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de Orden:</span>
                    <span className="font-medium">#ORD-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pagado:</span>
                    <span className="font-medium">Gs. {(total + (shippingData.cost || 0)).toLocaleString('es-PY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Envío:</span>
                    <span className="font-medium">{shippingOptions.find(opt => opt.id === shippingData.method)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-medium">{shippingData.address || "Retiro en local"}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/orders')}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Ver Mis Órdenes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Location Modal */}
      <ParaguayLocationSelect
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />

      {/* Convenir Modal */}
      <ParaguayLocationSelect
        isOpen={isConvenirModalOpen}
        onClose={() => setIsConvenirModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  )
}

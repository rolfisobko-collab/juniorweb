"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Package, MapPin, Store, Clock, ChevronLeft, ChevronRight, Check, CreditCard, Home, Loader2 } from "lucide-react"
import ParaguayLocationSelect from "@/components/paraguay-location-select"
import { useAEXShipping } from "@/hooks/use-aex-shipping"
import { useToast } from "@/hooks/use-toast"
import BancardCheckout from "@/components/bancard-checkout"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    cardCvv: "",
    method: "bancard" // Método de pago por defecto
  })
  const [bancardProcessId, setBancardProcessId] = useState<string | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isConvenirModalOpen, setIsConvenirModalOpen] = useState(false)
  
  // Hook para cálculo de envío AEX
  const { calculateShipping, loading: aexLoading, error: aexError, shippingOptions: aexServices } = useAEXShipping()

  // useEffect para autocalcular cuando los datos de envío están completos
  useEffect(() => {
    if (shippingData.method === "aex" && 
        shippingData.city && 
        shippingData.department && 
        shippingData.address && 
        !aexLoading &&
        shippingData.cost === 0) { // Solo calcular si no hay costo previo
      console.log('🔄 useEffect: Datos completos, calculando envío AEX automáticamente')
      calculateAEXShipping()
    }
  }, [shippingData.city, shippingData.department, shippingData.address, shippingData.method])

  // Función para generar process_id de Bancard
  const generateBancardProcessId = async () => {
    try {
      setPaymentLoading(true)
      const totalAmount = total + (shippingData.cost || 0)
      
      const response = await fetch('/api/bancard/create-single-buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "PYG",
          description: `Compra TechZone - ${items.length} productos`,
          shop_process_id: `TZ_${Date.now()}`
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setBancardProcessId(data.process_id)
        toast({
          title: "Formulario de pago listo",
          description: "Formulario seguro de Bancard cargado correctamente"
        })
      } else {
        throw new Error(data.error || 'Error generando process_id')
      }
    } catch (error) {
      console.error('Error generando process_id:', error)
      toast({
        title: "Error en el pago",
        description: "No se pudo inicializar el formulario de pago",
        variant: "destructive"
      })
    } finally {
      setPaymentLoading(false)
    }
  }

  // Manejar éxito del pago
  const handlePaymentSuccess = (response: any) => {
    toast({
      title: "¡Pago exitoso!",
      description: "Tu compra ha sido procesada correctamente"
    })
    
    // Aquí podrías redirigir a una página de confirmación
    setTimeout(() => {
      router.push('/checkout/success')
    }, 2000)
  }

  // Manejar error en el pago
  const handlePaymentError = (error: any) => {
    toast({
      title: "Error en el pago",
      description: error.message || "Hubo un error procesando tu pago",
      variant: "destructive"
    })
  }

  // Mock data para el carrito con productos AEX
  const items = [
    {
      id: "1",
      product: {
        id: "1",
        name: "iPhone 17 Pro Max",
        price: 1299,
        weight: 0.22,
        length: 15,
        width: 7.5,
        height: 0.8,
        valorDeclarado: 1299,
        descripcionAduana: "iPhone 17 Pro Max 256GB - Smartphone premium",
        categoriaArancelaria: "8517.13.00",
        paisOrigen: "China"
      },
      quantity: 1
    }
  ]
  
  const total = 1299
  const user = { name: "Usuario Demo", email: "demo@email.com" }

  // Función para calcular envío AEX
  const calculateAEXShipping = async () => {
    console.log('🚀 Iniciando cálculo AEX...')
    console.log('📊 Estado actual shippingData:', shippingData)
    
    // Obtener los valores más recientes del estado
    const currentCity = shippingData.city
    const currentDepartment = shippingData.department  
    const currentAddress = shippingData.address
    
    console.log('📍 Datos para cálculo:', {
      city: currentCity,
      department: currentDepartment,
      address: currentAddress,
      method: shippingData.method
    })
    
    if (!currentCity || !currentDepartment || !currentAddress) {
      console.error('❌ Datos incompletos:', {
        hasCity: !!currentCity,
        hasDepartment: !!currentDepartment,
        hasAddress: !!currentAddress
      })
      
      toast({
        title: "Datos incompletos",
        description: "Por favor completa la dirección de envío",
        variant: "destructive"
      })
      return
    }

    const shippingRequest = {
      products: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        weight: item.product.weight,
        length: item.product.length,
        width: item.product.width,
        height: item.product.height,
        valorDeclarado: item.product.valorDeclarado,
        descripcionAduana: item.product.descripcionAduana,
        categoriaArancelaria: item.product.categoriaArancelaria,
        paisOrigen: item.product.paisOrigen,
        quantity: item.quantity
      })),
      destination: {
        city: currentCity,
        department: currentDepartment,
        address: currentAddress
      }
    }

    console.log('� Enviando solicitud AEX:', shippingRequest)

    const result = await calculateShipping(shippingRequest)
    
    console.log('📋 Resultado AEX:', result)
    
    if (result.success && result.shipping_cost) {
      setShippingData(prev => ({
        ...prev,
        cost: result.shipping_cost || 0
      }))
      
      toast({
        title: "Envío calculado",
        description: `Costo de envío: Gs. ${result.shipping_cost.toLocaleString('es-PY')}`
      })
    } else {
      console.error('❌ Error en cálculo AEX:', result.error)
      toast({
        title: "Error al calcular envío",
        description: result.error || "No se pudo calcular el costo de envío",
        variant: "destructive"
      })
    }
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
    
    // Si es AEX y ya hay dirección, calcular automáticamente
    if (option.id === "aex") {
      if (shippingData.city && shippingData.department && shippingData.address) {
        // Pequeño delay para asegurar que el método se actualizó
        setTimeout(() => calculateAEXShipping(), 100)
      } else {
        setIsLocationModalOpen(true)
      }
    }
    // Si requiere dirección, abrir modal de ubicación correspondiente
    else if (option.requiresAddress) {
      if (option.id === "convenir") {
        setIsConvenirModalOpen(true)
      }
    }
  }

  const handleLocationSelect = (location: { 
    address: string; 
    city: string; 
    department: string;
  }) => {
    console.log('📍 Ubicación seleccionada:', location)
    
    setShippingData(prev => ({
      ...prev,
      address: location.address,
      city: location.city,
      department: location.department
    }))
    
    // Si el método seleccionado es AEX, calcular el envío automáticamente
    // Usamos un callback para asegurar que tenemos el estado actualizado
    setTimeout(() => {
      setShippingData(currentData => {
        console.log('🔄 Estado actualizado:', currentData)
        
        if (currentData.method === "aex" && currentData.city && currentData.department && currentData.address) {
          console.log('🚚 Disparando cálculo automático de AEX')
          calculateAEXShipping()
        }
        
        return currentData
      })
    }, 200)
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
                              {option.id === "aex" && aexLoading ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span className="text-lg">Calculando...</span>
                                </div>
                              ) : option.id === "aex" && shippingData.method === "aex" && shippingData.cost > 0 ? (
                                `Gs. ${shippingData.cost.toLocaleString('es-PY')}`
                              ) : option.cost === 0 ? "Gratis" : option.cost === null ? "A calcular" : `Gs. ${option.cost.toLocaleString('es-PY')}`}
                            </div>
                            {option.id === "aex" && aexError && (
                              <div className="mt-1 text-sm text-red-600">
                                Error: {aexError}
                              </div>
                            )}
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
                            {option.id === "aex" && shippingData.address && (
                              <div className="mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    calculateAEXShipping()
                                  }}
                                  disabled={aexLoading}
                                  className="w-full"
                                >
                                  {aexLoading ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Recalculando...
                                    </>
                                  ) : (
                                    <>
                                      <Truck className="h-4 w-4 mr-2" />
                                      Recalcular Envío
                                    </>
                                  )}
                                </Button>
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
                {/* Selección de método de pago */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Método de Pago</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentData.method === "bancard" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentData(prev => ({ ...prev, method: "bancard" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Bancard vPOS</div>
                          <div className="text-sm text-gray-600">Pago seguro con tarjeta de crédito/débito</div>
                        </div>
                        {paymentData.method === "bancard" && (
                          <Check className="w-5 h-5 text-blue-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulario de Bancard */}
                {paymentData.method === "bancard" && (
                  <div className="space-y-4">
                    {!bancardProcessId ? (
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                          <h3 className="text-lg font-medium">Formulario de Pago Seguro</h3>
                          <p className="text-gray-600">Serás redirigido al formulario seguro de Bancard</p>
                        </div>
                        <Button 
                          onClick={generateBancardProcessId}
                          disabled={paymentLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {paymentLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Inicializando pago...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Continuar al Pago Seguro
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Formulario de pago seguro activo</span>
                          </div>
                        </div>
                        <BancardCheckout
                          processId={bancardProcessId}
                          amount={total + (shippingData.cost || 0)}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          onCancel={() => {
                            setBancardProcessId(null)
                            toast({
                              title: "Pago cancelado",
                              description: "Has cancelado el proceso de pago"
                            })
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  {!bancardProcessId && (
                    <Button 
                      onClick={handleNextStep} 
                      className="flex items-center gap-2"
                      disabled={paymentData.method !== "bancard"}
                    >
                      Realizar Compra
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
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

"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface BancardCheckoutProps {
  processId: string
  amount: number
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

export default function BancardCheckout({ 
  processId, 
  amount, 
  onSuccess, 
  onError, 
  onCancel 
}: BancardCheckoutProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Cargar el script de Bancard si no está cargado
    if (!window.Bancard) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/Bancard/bancard-checkout-js@master/build/bancard-checkout-1.0.0.js'
      script.async = true
      script.onload = initializeBancard
      script.onerror = () => {
        setError("Error cargando el formulario de pago de Bancard")
        setLoading(false)
      }
      document.body.appendChild(script)
    } else {
      initializeBancard()
    }

    return () => {
      // Limpiar el iframe cuando el componente se desmonte
      if (iframeRef.current) {
        iframeRef.current.innerHTML = ''
      }
    }
  }, [processId])

  const initializeBancard = () => {
    try {
      setLoading(true)
      setError(null)

      // Configurar estilos personalizados para que coincidan con el diseño
      const styles = {
        'button-background-color': '#3b82f6', // Azul primario
        'button-border-color': '#2563eb',
        'button-text-color': '#ffffff',
        'form-background-color': '#ffffff',
        'form-border-color': '#e5e7eb',
        'header-background-color': '#f9fafb',
        'header-text-color': '#111827',
        'hr-border-color': '#e5e7eb',
        'input-background-color': '#ffffff',
        'input-border-color': '#d1d5db',
        'input-placeholder-color': '#9ca3af',
        'input-text-color': '#374151',
        'label-kyc-text-color': '#000000'
      }

      const options = {
        styles: styles,
        onEvent: (event: any) => {
          console.log('🔄 Evento Bancard:', event)
          
          switch(event.type) {
            case 'payment_success':
              setLoading(false)
              if (onSuccess) {
                onSuccess({
                  process_id: processId,
                  amount: amount,
                  response: event
                })
              }
              break
              
            case 'payment_error':
              setLoading(false)
              setError(event.message || 'Error en el pago')
              if (onError) {
                onError(event)
              }
              break
              
            case 'payment_cancel':
              setLoading(false)
              if (onCancel) {
                onCancel()
              }
              break
              
            case 'form_loaded':
              setLoading(false)
              break
          }
        }
      }

      // Crear el formulario de pago
      if (window.Bancard && window.Bancard.Checkout && iframeRef.current) {
        window.Bancard.Checkout.createForm('bancard-iframe-container', processId, options)
      } else {
        throw new Error('La librería de Bancard no está disponible')
      }

    } catch (err) {
      console.error('Error inicializando Bancard:', err)
      setError("Error inicializando el formulario de pago")
      setLoading(false)
    }
  }

  // Para desarrollo, mostrar un formulario simulado
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center p-8 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando formulario de pago seguro...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
          <p className="font-medium">Error en el formulario de pago</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div 
        id="bancard-iframe-container" 
        ref={iframeRef}
        className="w-full min-h-[400px]"
        style={{ display: loading || error ? 'none' : 'block' }}
      />

      {/* Formulario de desarrollo para pruebas */}
      {isDevelopment && !loading && !error && (
        <div className="mt-4 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
          <p className="text-sm text-blue-700 font-medium mb-2">
            🔧 Modo Desarrollo - Formulario Simulado
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tarjeta (simulado)
              </label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                placeholder="1234 5678 9012 3456"
                defaultValue="4567 8901 2345 6789"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="MM/AA"
                  defaultValue="12/25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="123"
                  defaultValue="123"
                />
              </div>
            </div>
            <button 
              onClick={() => onSuccess?.({
                process_id: processId,
                amount: amount,
                simulated: true
              })}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Pagar Gs. {amount.toLocaleString('es-PY')} (Simulado)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Declaración de tipos para el objeto global de Bancard
declare global {
  interface Window {
    Bancard?: {
      Checkout: {
        createForm: (containerId: string, processId: string, options: any) => void
      }
    }
  }
}
